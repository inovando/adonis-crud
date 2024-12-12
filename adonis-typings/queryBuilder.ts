declare module '@ioc:AdonisCrud/Crud/QueryBuilder' {
  import { Knex } from 'knex'
  import {
    ModelQueryBuilderContract,
    LucidModel,
    LucidRow,
    ModelPaginatorContract,
  } from '@ioc:Adonis/Lucid/Orm'

  // Interface genérica para os parâmetros do método `build`
  interface QueryBuild<Model extends LucidModel> {
    model: Model
    qs: Record<string, any>
    selectFields?: string[]
  }

  // Adicionando suporte ao Lucid Model genérico no contrato do QueryBuilder
  export type ExecutableQueryBuilderContract<Model extends LucidModel> = ModelQueryBuilderContract<
    Model,
    InstanceType<Model>
  > & {
    toSQL(): Knex.Sql
    toQuery(): string
    exec(): Promise<LucidRow[]>
    paginate(page: number, perPage: number): Promise<ModelPaginatorContract<InstanceType<Model>>>
  }

  // Interface para o construtor de QueryBuilder
  export interface QueryBuilderType {
    build<Model extends LucidModel>(args: QueryBuild<Model>): ExecutableQueryBuilderContract<Model>
  }

  // Exportação principal do QueryBuilder
  const QueryBuilder: QueryBuilderType
  export { QueryBuilder }
}
