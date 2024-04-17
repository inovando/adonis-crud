declare module '@ioc:AdonisCrud/Crud/Repository' {
  import { LucidModel } from '@ioc:Adonis/Lucid/Orm'

  const CrudRepository: <T extends LucidModel>(Model: T) => ClassDecorator
  export { CrudRepository }
}
