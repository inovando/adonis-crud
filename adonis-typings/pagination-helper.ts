declare module '@ioc:AdonisCrud/Controller/PaginationHelper' {
  interface PaginationQueryParams {
    all?: boolean
    page?: number
    perPage?: number
  }

  interface PaginationQuery {
    exec: () => Promise<any[]>
    paginate: (
      page: number,
      perPage: number
    ) => Promise<{
      rows: any[]
      currentPage: number
      perPage: number
      total: number
      lastPage: number
    }>
  }

  interface PaginationResponseResult {
    rows: any[]
    pages: {
      page: number
      perPage: number
      total: number
      lastPage: number
    }
  }

  const PaginationHelper: ({
    qs,
    query,
  }: {
    qs: PaginationQueryParams
    query: PaginationQuery
  }) => Promise<any[] | PaginationResponseResult>

  export default PaginationHelper
}
