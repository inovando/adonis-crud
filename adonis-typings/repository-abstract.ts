declare module '@ioc:AdonisCrud/Crud/AbstractCrudRepository' {
  import {
    GetByIdRequest,
    IndexRequest,
    RequestUpdatePayload,
    ShowRequest,
  } from '@ioc:AdonisCrud/Crud/Types'

  import { LucidModel } from '@ioc:Adonis/Lucid/Orm'
  import {
    AbstractRepositorRequestUpdatePayload,
    AbstractRepositorIndexRequest,
  } from '@ioc:AdonisCrud/Types/AbstractRepositoryQsParamsIndex'

  export interface IRepository<T> {
    index(request: IndexRequest)
    show({ id, status }: ShowRequest): Promise<T>
    update({ id, body }: RequestUpdatePayload<T>): Promise<T>
    destroy(id)
    getById(id)
    bulkInsert(items)
    bulkDelete(ids)
    store(propsToStore): Promise<T>
  }

  export interface AbstractCrudRepositoryInterface<T> {
    index(request: AbstractRepositorIndexRequest<T>): Promise<any>
    show({ id, status }: ShowRequest): Promise<T>
    update({ id, body }: AbstractRepositorRequestUpdatePayload<T>): Promise<T>
    destroy(id: string)
    getById({ id }: GetByIdRequest)
    bulkInsert(items: Partial<T>[])
    bulkDelete(ids: string[])
    store(propsToStore: Partial<T>): Promise<T>
  }

  const AbstractCrudRepository: {
    new <T>(model: LucidModel): AbstractCrudRepositoryInterface<T>
  }

  export { AbstractCrudRepository }
}
