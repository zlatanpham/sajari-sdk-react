export const SET_COMPLETION = 'SEARCH_SET_COMPLETION'
export const SET_BODY = 'SEARCH_SET_BODY'
export const SET_PAGE = 'SEARCH_SET_PAGE'
export const SET_RESULTS_PER_PAGE = 'SEARCH_SET_RESULTS_PER_PAGE'
export const TRIGGER_SEARCH = 'SEARCH_TRIGGER'

export const setCompletion = (completion, namespace) => (
  { type: SET_COMPLETION, completion, namespace }
)

export const setBody = (body, namespace) => (
  { type: SET_BODY, body, namespace }
)

export const setPage = (page, namespace) => (
  { type: SET_PAGE, page, namespace }
)

export const setResultsPerPage = (resultsPerPage, namespace) => (
  { type: SET_RESULTS_PER_PAGE, resultsPerPage, namespace }
)

export const triggerSearch = (namespace) => (
  { type: TRIGGER_SEARCH, namespace }
)