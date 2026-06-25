/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { AnimeGenre, GenresAnimeQuery, JikanResponse } from './jikan-api'

type ExtractSlots<Path extends string> = Path extends `${string}{${infer Param}}${infer Rest}`
  ? { [K in Param]: string | number } & ExtractSlots<Rest>
  : {}

declare global {
  type JikanArguments<
    Path extends keyof JikanPaths,
    T extends {
      query?: unknown
      body?: unknown
    } = {
      query?: unknown
      body?: unknown
    },
  > = T & ExtractSlots<Path>

  /** Record<Path, [Arguments, ReturnData, Error]> */
  interface JikanPaths {
    'genres/anime': [
      JikanArguments<'genres/anime', { query?: GenresAnimeQuery }>,
      JikanResponse<AnimeGenre[]>,
    ]
  }
}
