async function PaginationResponse({ qs, query }) {
  const { all, page = 1, perPage = 10 } = qs

  if (all) {
    return query.exec()
  }
  const {
    rows,
    currentPage,
    perPage: per_page,
    total,
    lastPage,
  } = await query.paginate(page, perPage)

  return {
    rows,
    pages: {
      page: currentPage,
      perPage: per_page,
      total: total,
      lastPage: lastPage,
    }
  }

}

export default PaginationResponse
