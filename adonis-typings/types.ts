declare module '@ioc:AdonisCrud/Crud/Types' {
  export type ShowRequest = {
    id: string
    status?: boolean
    includes: string
  }

  export type QsRequest = {
    page?: number
    perPage?: number
    all?: boolean
    order?: 'asc' | 'desc'
    sort?: string
  }

  export type RequestUpdatePayload<T> = {
    id: string
    body: Partial<T>
  }

  export type GetByIdRequest = {
    id: string
    status?: boolean
    includes?: string
  }

  export type IndexRequest = {
    qs: Pick<QsRequest, 'page' | 'perPage' | 'all'>
    authUser?: any
  }
}
