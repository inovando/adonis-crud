import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AdonisCrudProvider {
  public static needsApplication = true
  constructor(protected app: ApplicationContract) {}

  public async register() {
    const QueryBuilder = await import('../src/QueryBuilder/QueryBuilder')
    const CrudControllerDecorator = await import('../src/Decorators/Controller/CrudDecorator')
    const CrudRepository = await import('../src/Decorators/Repository/CrudRepository')
    const PaginationHelper = await import('../src/Decorators/Controller/PaginationHelper')

    this.app.container.bind('AdonisCrud/Crud/Controller', () => {
      return CrudControllerDecorator
    })

    const AbstractCrudRepositoryService = await import(
      '../src/Decorators/Repository/AbstractCrudRepository'
    )

    this.app.container.bind('AdonisCrud/Crud/QueryBuilder', () => {
      return QueryBuilder
    })

    this.app.container.bind('AdonisCrud/Crud/Repository', () => {
      return CrudRepository
    })

    this.app.container.bind('AdonisCrud/Crud/AbstractCrudRepository', () => {
      return AbstractCrudRepositoryService
    })

    this.app.container.bind('AdonisCrud/Controller/PaginationHelper', () => {
      return PaginationHelper
    })
  }

  public async ready() {}

  public async boot() {}
}
