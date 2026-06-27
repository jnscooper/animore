/* eslint-disable @typescript-eslint/no-explicit-any */
export type JikanResponse<T, P extends boolean = false> = P extends true
  ? {
      data: T
    } & Pagination
  : { data: T }

export type Pagination = {
  pagination: {
    last_visible_page: number
    has_next_page: boolean
    current_page: number
    items: {
      count: number
      total: number
      per_page: number
    }
  }
}

export type AnimeType =
  | 'TV'
  | 'OVA'
  | 'Movie'
  | 'Special'
  | 'ONA'
  | 'Music'
  | 'CM'
  | 'PV'
  | 'TV Special'
  | 'Unknown'

export type AnimeStatus = 'Finished Airing' | 'Currently Airing' | 'Not yet aired'

export type AnimeSeason = 'winter' | 'spring' | 'summer' | 'fall'

export type AnimeImage = {
  image_url: string
  small_image_url: string
  large_image_url: string
}

export type AnimeImages = {
  jpg: AnimeImage
  webp: AnimeImage
}

export type Anime = {
  mal_id: number
  url: string

  images: AnimeImages
  trailer: Record<string, any>

  approved: boolean

  titles: AnimeTitle[]

  title: string
  title_english: string | null
  title_japanese: string | null
  title_synonyms: string[]

  type: AnimeType

  source: string

  episodes: number | null

  status: AnimeStatus

  airing: boolean

  aired: AnimeAired

  duration: string

  rating: string

  score: number | null
  scored_by: number

  rank: number | null
  popularity: number

  members: number
  favorites: number

  synopsis: string | null
  background: string | null

  season: AnimeSeason | null
  year: number | null

  broadcast: AnimeBroadcast

  producers: AnimeEntity[]
  licensors: AnimeEntity[]
  studios: AnimeEntity[]

  genres: AnimeGenre[]
  explicit_genres: AnimeGenre[]
  themes: AnimeGenre[]
  demographics: AnimeGenre[]
}

export type AnimeTitle = {
  type: string
  title: string
}

export type AnimeEntity = {
  mal_id: number
  type: string
  name: string
  url: string
}

export type AnimeGenre = {
  mal_id: number
  type: string
  name: string
  url: string
}

export type AnimeAired = {
  from: string | null
  to: string | null
  prop: {
    from: AnimeDateProp
    to: AnimeDateProp
  }
  string: string
}

export type AnimeDateProp = {
  day: number | null
  month: number | null
  year: number | null
}

export type AnimeBroadcast = {
  day: string | null
  time: string | null
  timezone: string | null
  string: string | null
}

export type GenresAnimeQuery = {
  filter?: 'genres' | 'explicit_genres' | 'themes' | 'demographics'
}

export type TopAnimeQuery = {
  type?: AnimeType
  filter?: 'airing' | 'upcoming' | 'bypopularity' | 'favorite'
  rating?: 'g' | 'pg' | 'pg13' | 'r17' | 'r' | 'rx'
  sfw?: boolean
  page?: number
  limit?: number
}

export type CharacterItem = {
  mal_id: number
  url: string
  name: string
  image_url: string
}

export type VoiceActor = {
  person: {
    mal_id: number
    url: string
    name: string
    image_url: string
  }
  language: string
}

export type Character = {
  character: CharacterItem
  role: string
  voice_actors: VoiceActor[]
}
