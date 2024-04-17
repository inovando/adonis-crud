declare module '@ioc:AdonisCrud/Crud/Controller' {
  export interface CrudOperationsOptions {
    repository: any
    validators: {
      store?: any
      update?: any
    }
    storeProps: string[]
    updateProps: string[]
    event: any
    transformer?: any
  }

  const Crud: (options: CrudOperationsOptions) => ClassDecorator

  export { Crud }
}
