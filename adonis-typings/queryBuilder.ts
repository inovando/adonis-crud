declare module '@ioc:AdonisCrud/Crud/QueryBuilder' {
  import { Knex } from 'knex'
  import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
  import { LucidModel, LucidRow } from '@ioc:Adonis/Lucid/Orm'
  interface QueryBuild {
    model: LucidModel
    qs: any
    selectFields?: String[]
  }

  export type ExecutableQueryBuilderContract = {
    debug(debug: boolean): any
    timeout(
      time: number,
      options?: {
        cancel: boolean
      }
    ): any
    useTransaction(trx: TransactionClientContract): any
    reporterData(data: any): any
    toQuery(): string
    exec(): Promise<LucidRow[]>
    toSQL(): Knex.Sql
    paginate(page: number, perPage?: number): Promise<any>
  }

  export interface QueryBuilderType {
    build: ({ model, qs }: QueryBuild) => ExecutableQueryBuilderContract
  }

  const QueryBuilder: QueryBuilderType
  export { QueryBuilder }
}
