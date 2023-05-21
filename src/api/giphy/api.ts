import { GetGifsParams, GetGifsResponse } from "./types"
import qs from "qs-lite"

const BASE_URL = "https://api.giphy.com/v1"

/**
 * The key to use for the Giphy API. It's public, so no need to hide it.
 * @see https://github.com/Giphy/giphy-js/issues/120#issuecomment-680988917
 */
const GIPHY_KEY = "NHkcAdjuIxKxdQCOgc99xWWSpgrSO44d"

/**
 * The maximum offset that can be used for the Giphy API.
 * @see https://developers.giphy.com/docs/api/endpoint#search
 */
export const MAX_OFFSET = 4999
/**
 * The maximum limit that can be used for the Giphy API.
 * @see https://developers.giphy.com/docs/api/endpoint#search
 */
export const MAX_LIMIT = 50
export const MAX_TOTAL_COUNT = MAX_OFFSET + 1

export const getGifs = async (params: GetGifsParams) => {
  const response = await fetch(
    `${BASE_URL}/gifs/search?api_key=${GIPHY_KEY}&${qs.stringify(params)}`
  )
  if (!response.ok) return Promise.reject(response)
  // Nice to have(May 21, 2023): add parsing?
  return (await response.json()) as GetGifsResponse
}
