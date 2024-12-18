import { LucidModel } from '@ioc:Adonis/Lucid/Orm'
import { QueryBuilder } from '../../QueryBuilder/QueryBuilder'
import { DateTime } from 'luxon'
import {
  GetByIdRequest,
  IndexRequest,
  RequestUpdatePayload,
  ShowRequest,
} from '@ioc:AdonisCrud/Crud/Types'
import { IRepository } from '@ioc:AdonisCrud/Crud/AbstractCrudRepository'

export abstract class AbstractCrudRepository<T> implements IRepository<T> {
  protected selecteFields: Array<string> = []
  constructor(private model: LucidModel) {}

  public index({ qs: { ...rest } }: IndexRequest): QueryBuilder {
    const query = QueryBuilder.build({
      model: this.model,
      qs: rest,
      selectFields: this.selecteFields,
    })
    return query
  }

  public async show({ id, status, includes }: ShowRequest): Promise<T> {
    return this.getById({ id, status, includes })
  }

  public async store(propsToStore: Partial<T>): Promise<T> {
    const model = (await this.model.create(propsToStore)) as T
    return model
  }

  public async update({ id, body }: RequestUpdatePayload<T>) {
    const modelToUpdate = await this.getById({ id })
    if (!modelToUpdate) {
      return false
    }
    modelToUpdate.merge(body)
    await modelToUpdate.save()
    return modelToUpdate
  }

  public async destroy(id: string) {
    const modelToDelete = await this.getById({ id })
    if (!modelToDelete) return false
    try {
      modelToDelete.merge({ status: false, deleted_at: DateTime.now() })
      await modelToDelete.save()
      return true
    } catch (error) {
      throw error
    }
  }

  public async getById({ id, status, includes = '' }: GetByIdRequest) {
    const query: any = QueryBuilder.build({
      model: this.model,
      qs: { status, id, includes },
      selectFields: this.selecteFields,
    })

    return query.first()
  }

  public async bulkInsert(items: Partial<T>[]) {
    return this.model.createMany(items)
  }

  public async bulkDelete(ids: string[]) {
    try {
      await this.model.query().whereIn('id', ids).delete()
      return true
    } catch (error) {
      throw error
    }
  }
}
