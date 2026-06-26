import { z } from 'zod'

export const EpisodeSchema = z.object({
  id: z.number(),
  name: z.string(),
  overview: z.string(),
  episode_number: z.number(),
  air_date: z.string().nullable(),
  still_path: z.string().nullable(),
  runtime: z.number().nullable(),
})

export const SeasonSchema = z.object({
  id: z.number(),
  name: z.string(),
  season_number: z.number(),
  episode_count: z.number(),
  poster_path: z.string().nullable(),
  air_date: z.string().nullable(),
})

export const TVShowSchema = z.object({
  id: z.number(),
  name: z.string(),
  overview: z.string(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  vote_average: z.number(),
  vote_count: z.number(),
  first_air_date: z.string().optional(),
  genre_ids: z.array(z.number()).optional(),
  genres: z.array(z.object({ id: z.number(), name: z.string() })).optional(),
  number_of_episodes: z.number().optional(),
  number_of_seasons: z.number().optional(),
  status: z.string().optional(),
  networks: z.array(z.object({ name: z.string() })).optional(),
})

export const TVShowDetailSchema = TVShowSchema.extend({
  seasons: z.array(SeasonSchema),
  genres: z.array(z.object({ id: z.number(), name: z.string() })),
  status: z.string(),
})

export const SeasonDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  season_number: z.number(),
  episodes: z.array(EpisodeSchema),
})

export type TVShow = z.infer<typeof TVShowSchema>
export type TVShowDetail = z.infer<typeof TVShowDetailSchema>
export type Season = z.infer<typeof SeasonSchema>
export type SeasonDetail = z.infer<typeof SeasonDetailSchema>
export type Episode = z.infer<typeof EpisodeSchema>