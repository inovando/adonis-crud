export const WHERE_OPERATOR_END = 'AND'
export const WHERE_OPERATOR_OR = 'OR'

interface OperatorQueryParam {
  query: any
  param: string
  value: string
  relation?: string
  whereOperator: string
}

export enum Operator {
  Equals = '$equals',
  ILike = '$ilike',
  GreaterThanOrEqual = '$gte',
  LessThanOrEqual = '$le',
  NotEqual = '$not',
  Null = '$null',
  NotNull = '$notNull',
  LessThan = '$lt',
  GreaterThan = '$gt',
  LessThanOrEqual2 = '$lte',
  NotEqual2 = '$ne',
  Like = '$like',
  NotLike = '$notLike',
  ILike2 = '$iLike',
  NotILike = '$notILike',
  In = '$in',
  NotIn = '$notIn',
  Between = '$between',
  NotBetween = '$notBetween',
}

const Operators: Record<Operator, (params: OperatorQueryParam) => void> = {
  [Operator.Equals]: ({ query, param, value, relation }: OperatorQueryParam) => {
    if (relation && relation !== '') {
      query.where(`${relation}.${param}`, value)
    }

    if (!relation) {
      query.where(`${param}`, value)
    }
  },
  [Operator.ILike]: ({ query, param, value, whereOperator, relation }: OperatorQueryParam) => {
    if (relation) {
      if (whereOperator.toUpperCase() === WHERE_OPERATOR_END)
        query.where(`${relation}.${param}`, 'ILIKE', `%${value}%`)

      if (whereOperator.toUpperCase() === WHERE_OPERATOR_OR)
        query.orWhere(`${relation}.${param}`, 'ILIKE', `%${value}%`)
    }

    if (whereOperator.toUpperCase() === WHERE_OPERATOR_END)
      query.where(`${param}`, 'ILIKE', `%${value}%`)

    if (whereOperator.toUpperCase() === WHERE_OPERATOR_OR) {
      query.orWhere((q) => {
        q.where(`${param}`, 'ILIKE', `%${value}%`)
      })
    }
  },
  [Operator.GreaterThanOrEqual]: ({ query, param, value }: OperatorQueryParam) => {
    query.where(`${param}`, '>=', value)
  },
  [Operator.LessThanOrEqual]: ({ query, param, value }: OperatorQueryParam) => {
    query.where(`${param}`, '<=', value)
  },
  [Operator.NotEqual]: ({ query, param, value }: OperatorQueryParam) => {
    query.where(`${param}`, '<>', value)
  },
  [Operator.NotNull]: ({ query, param }: OperatorQueryParam) => {
    query.whereNotNull(`${param}`)
  },
  [Operator.Null]: ({ query, param }: OperatorQueryParam) => {
    query.where(`${param}`, null)
  },
  [Operator.LessThan]: ({ query, param, value }: OperatorQueryParam) => {
    query.where(`${param}`, '<', value)
  },
  [Operator.GreaterThan]: ({ query, param, value }: OperatorQueryParam) => {
    query.where(`${param}`, '>', value)
  },
  [Operator.LessThanOrEqual2]: ({ query, param, value }: OperatorQueryParam) => {
    query.where(`${param}`, '<=', value)
  },
  [Operator.NotEqual2]: ({ query, param, value }: OperatorQueryParam) => {
    query.where(`${param}`, '<>', value)
  },
  [Operator.Like]: ({ query, param, value }: OperatorQueryParam) => {
    query.where(`${param}`, 'LIKE', `%${value}%`)
  },
  [Operator.NotLike]: ({ query, param, value }: OperatorQueryParam) => {
    query.where(`${param}`, 'NOT LIKE', `%${value}%`)
  },
  [Operator.ILike2]: ({ query, param, value }: OperatorQueryParam) => {
    query.where(`${param}`, 'ILIKE', `%${value}%`)
  },
  [Operator.NotILike]: ({ query, param, value }: OperatorQueryParam) => {
    query.where(`${param}`, 'NOT ILIKE', `%${value}%`)
  },
  [Operator.In]: ({ query, param, value, relation }: OperatorQueryParam) => {
    const isString = typeof value === 'string'

    if (relation && relation !== '') {
      query.whereIn(`${relation}.${param}`, !isString ? value : value.split(','))
    }

    if (!relation) {
      query.whereIn(`${param}`, !isString ? value : value.split(','))
    }
  },
  [Operator.NotIn]: ({ query, param, value }: OperatorQueryParam) => {
    const isString = typeof value === 'string'

    query.whereNotIn(`${param}`, !isString ? value : value.split(','))
  },

  [Operator.Between]: ({ query, param, value }: OperatorQueryParam) => {
    const [start, end] = value.split(',')
    query.whereBetween(`${param}`, [start, end])
  },
  [Operator.NotBetween]: ({ query, param, value }: OperatorQueryParam) => {
    const [start, end] = value.split(',')
    const startOfDay = new Date(start)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(end)
    endOfDay.setHours(23, 59, 59, 999)

    query.whereNotBetween(`${param}`, [start, end])
  },
}

export { Operators }
