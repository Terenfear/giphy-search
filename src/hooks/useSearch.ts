import { useMemo, useSyncExternalStore } from "react"

const SEARCH_CHANGE_EVENT_TYPE = "searchChange"

export const useSearch = (): [URLSearchParams, typeof updateSearch] => {
  const searchString = useSyncExternalStore(subscribe, getSnapshot)
  const searchParams = useMemo(
    () => new URLSearchParams(searchString),
    [searchString]
  )
  return [searchParams, updateSearch]
}

const subscribe = (onStoreChange: () => void) => {
  // handle back/forward navigation
  window.addEventListener("popstate", onStoreChange)
  // handle manual search change
  window.addEventListener(SEARCH_CHANGE_EVENT_TYPE, onStoreChange)
  return () => {
    window.removeEventListener("popstate", onStoreChange)
    window.removeEventListener(SEARCH_CHANGE_EVENT_TYPE, onStoreChange)
  }
}

const getSnapshot = () => {
  return window.location.search
}

const updateSearch = (update: (searchDraft: URLSearchParams) => void) => {
  const search = window.location.search
  const searchParams = new URLSearchParams(search)
  update(searchParams)
  // Nice to have(May 21, 2023): order should matter?
  if (searchParams.toString() !== search) {
    const newRelativePathQuery =
      window.location.pathname + "?" + searchParams.toString()
    history.pushState(null, "", newRelativePathQuery)
    window.dispatchEvent(new CustomEvent(SEARCH_CHANGE_EVENT_TYPE))
  }
}
