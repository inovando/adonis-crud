import { LucidModel } from '@ioc:Adonis/Lucid/Orm'
import { QueryBuilder } from '../../QueryBuilder/QueryBuilder'
import { DateTime } from 'luxon'

type FunctionMap = {
  [key: string]: Function
}

export function CrudRepository<T extends LucidModel>(Model: T): ClassDecorator {
  return (target) => {
    const functionMap: FunctionMap = {
      index({ qs: { ...rest } }) {
        const query = QueryBuilder.build({
          model: Model,
          qs: rest,
          selectFields: [],
        })
        return query
      },
      async show({ id, status, includes }) {
        return this.getById({ id, status, includes })
      },
      async store(propsToStore) {
        const model = await Model.create(propsToStore)
        return model
      },
      async update({ id, body }) {
        const modelToUpdate = await this.getById({ id })
        if (!modelToUpdate) {
          return false
        }
        modelToUpdate.merge(body)
        return await modelToUpdate.save()
      },
      async destroy(id) {
        const modelToDelete = await this.getById({ id })
        if (!modelToDelete) return false
        try {
          await modelToDelete.merge({ status: false, deleted_at: DateTime.now() })
          await modelToDelete.save()

          return true
        } catch (error) {
          throw error
        }
      },
      async getById({ id, status, includes = [] }) {
        if (!id) {
          throw new Error('Id is required')
        }
        const query = Model.query()

        if (status) {
          query.where('status', status)
        }

        const model = await query.where('id', id).first()
        return model
      },
    }

    const targetPrototype = target.prototype

    Object.assign(targetPrototype, {
      ...functionMap,
      model: Model,
    })

    Object.defineProperty(targetPrototype, 'Model', {
      value: Model,
      writable: false,
      configurable: false,
    })
  }
}
