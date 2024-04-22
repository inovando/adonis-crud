import { Operator, Operators, WHERE_OPERATOR_OR } from './QueryOperators'

import { ExecutableQueryBuilderContract } from '@ioc:AdonisCrud/Crud/QueryBuilder'

const keysToIgnorePagination = ['page', 'perPage', 'all', 'include', 'header']
const orderAndSortToIgnore = ['order', 'sort']
const queryOpertosToIgnore = [
  'select_fields',
  'where_operator',
  'select_fields_relationships',
  'order_fields_relationships',
  'relation_join_key',
  'relational_pivot_table',
  'relational_local_key',
]

const keysToIgnore = keysToIgnorePagination
  .concat(orderAndSortToIgnore)
  .concat(queryOpertosToIgnore)

export class QueryBuilder {
  private static hasInclude(model, includes: any = []) {
    let includesNotAvailables: any = []

    for (const include of includes) {
      const [first] = include.split('.')

      if (!model.$hasRelation(first)) {
        includesNotAvailables.push(include)
      }
    }

    if (includesNotAvailables.length) {
      throw new Error(`invalid relations includes ${includesNotAvailables.map((e) => e)}`)
    }
  }

  private static applyOrder({ query, qs, model }) {
    const { sort = 'created_at', order = 'asc', select_fields_relationships } = qs
    const [relation, field] = sort.split('.')
    const tableName = model.table
    let select = [`*`]

    if (select_fields_relationships) {
      select = select_fields_relationships[relation]?.split(',')
    }

    if (relation && field) {
      const relationModel = model.$getRelation(`${relation}`).relatedModel()
      const { table: relationTable } = relationModel
      const relationShiopDefinitions = model.$relationsDefinitions.get(relation)
      const { options, type } = relationShiopDefinitions
      const { foreignKey, localKey } = options
      const s = select.map((field) => `${relationTable}.${field}`)
      const selectQueryFields = [...s, `${tableName}.*`, `${relationTable}.id as ${relation}_id`]

      if (type === 'belongsTo') {
        query.join(`${relationTable}`, `${tableName}.${foreignKey}`, `${relationTable}.id`)
      }

      if (type === 'hasOne') {
        query.join(`${relationTable}`, `${tableName}.${localKey}`, `${relationTable}.${foreignKey}`)
      }

      query.select(selectQueryFields).orderBy(`${relationTable}.${field}`, order)
    }

    if (!field) {
      query.orderBy(sort, order)
    }
  }

  public static build({ model, qs, selectFields }): ExecutableQueryBuilderContract {
    const selectFieldsQs = qs.select_fields?.split(',') || []
    const mergedSelectFields = new Set(selectFields?.concat(selectFieldsQs)) || []

    const query = model.query().select([...mergedSelectFields] as unknown as Array<string>)

    const whereOperator = qs?.where_operator || 'and'
    const includes = this.splitAndTrim(qs.includes)

    this.handleIncludes(query, includes, model, qs)
    this.handleQueryStringParameters(query, qs, whereOperator)
    this.applyOrder({ query, qs, model })
    return query
  }

  private static splitAndTrim(str: string): string[] {
    return (
      str
        ?.split(',')
        .filter((item) => item !== '')
        .map((item) => item.trim()) || []
    )
  }

  private static async handleIncludes(query: any, includes: string[], model, qs) {
    const arrayOptions = []
    const { select_fields_relationships } = qs

    for (const include of includes) {
      const [firstRelation, secondRelation] = include.split('.')
      const selectFields = select_fields_relationships?.[firstRelation] || '*'
      const selectFieldsSecond = select_fields_relationships?.[secondRelation] || '*'

      if (!arrayOptions[firstRelation]) {
        arrayOptions[firstRelation] = { firstRelation, subs: [], selectFields }
      }

      if (secondRelation) {
        arrayOptions[firstRelation].subs.push({ secondRelation, selectFieldsSecond })
      }

      if (firstRelation && !secondRelation) {
        this.hasInclude(model, includes)
      }
    }

    if (arrayOptions) {
      for (const relationOption of Object.keys(arrayOptions)) {
        query.preload(`${arrayOptions[relationOption].firstRelation}`, (q) => {
          const selectFirst = `${arrayOptions[relationOption].selectFields}` || '*'
          let valuesArray = selectFirst.split(',')
          q.select(valuesArray)

          arrayOptions[relationOption].subs.forEach((sub) => {
            q.preload(`${sub.secondRelation}`, (secondQuery) => {
              const select = sub?.selectFieldsSecond?.split(',') || '*'
              secondQuery.select(select)
            })
          })
        })
      }
    }
  }

  private static parseBooleanParams(value, operator) {
    const booleans = { ['true']: true, ['false']: false }
    if (operator === '$in' || operator === '$notIn') {
      const arr = value.split(',').map((e) => booleans[e])
      return arr
    }
    return booleans[value]
  }

  private static async handleQueryStringParameters(query: any, qs: any, whereOperator: string) {
    for (const key in qs) {
      if (keysToIgnore.includes(key)) continue
      let value = qs[key]
      let parts = key.split('.')

      let param = parts[0]

      const scenarios = {
        3: () => this.handleThreePartKey(query, parts, value, whereOperator),
        2: () => this.handleTwoPartKey(query, parts, value, whereOperator),
        1: () => this.handleOnePartKey(query, param, value, whereOperator),
      }

      const scenario = scenarios[parts.length]
      if (scenario) {
        scenario()
      }
    }
  }

  private static getTableNameRelation(query, relation) {
    const model = query.model.$relationsDefinitions
    let table
    model.forEach((e) => {
      if (e.relationName === relation) {
        table = e.relatedModel().table
      }
    })

    return table ? table : 'relation not found!'
  }

  private static handleThreePartKey(
    query: any,
    parts: string[],
    value: any,
    whereOperator: string
  ) {
    const [relation, field, op] = parts

    let table = this.getTableNameRelation(query, relation)

    let operator = op.startsWith('$') ? (op as Operator) : Operator.Equals
    let bolean_params = value
    if (
      (operator === '$in' || operator === '$notIn') &&
      (value === 'true,false' || value === 'false,true')
    ) {
      bolean_params = this.parseBooleanParams(value, operator)
    }

    if (whereOperator.toUpperCase() === WHERE_OPERATOR_OR) {
      query.orWhereHas(relation, (subQuery) => {
        Operators[operator]({
          query: subQuery,
          param: field,
          value: bolean_params,
          relation: table,
          whereOperator,
        })
      })
    }

    if (whereOperator.toUpperCase() !== WHERE_OPERATOR_OR) {
      query.whereHas(relation, (subQuery) => {
        Operators[operator]({
          query: subQuery,
          param: field,
          value: bolean_params,
          relation: table,
          whereOperator,
        })
      })
    }

    // query.whereHas(relation, (subQuery) => {
    //   Operators[operator]({ query: subQuery, param: field, value, relation, whereOperator })
    // })
  }

  private static handleTwoPartKey(query: any, parts: string[], value: any, whereOperator: string) {
    const [first, second] = parts

    let operator: any = second as Operator

    if (second.startsWith('$')) {
      Operators[operator]({ query, param: first, value, whereOperator })
    } else {
      query.whereHas(first, (subQuery) => {
        Operators[operator]({ query: subQuery, param: second, value, whereOperator })
      })
    }
  }

  private static handleOnePartKey(query: any, param: string, value: any, whereOperator: string) {
    const tableName = query.model.table
    let paramWithTableName = `${tableName}.${param}`
    let operator: any = Operator.Equals
    if (value === 'true' || value === 'false') {
      value = this.parseBooleanParams(value, operator)
    }
    Operators[operator]({ query, param: paramWithTableName, value, whereOperator })
  }
}
