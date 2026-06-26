import { z } from 'zod'

export const SearchMovieResultSchema = z.object({
  id: z.number(),
  media_type: z.literal('movie'),
  title: z.string(),
  poster_path: z.string().nullable(),
  vote_average: z.number(),
  release_date: z.string().optional(),
})

export const SearchTVResultSchema = z.object({
  id: z.number(),
  media_type: z.literal('tv'),
  name: z.string(),
  poster_path: z.string().nullable(),
  vote_average: z.number(),
  first_air_date: z.string().optional(),
})

export const SearchPersonResultSchema = z.object({
  id: z.number(),
  media_type: z.literal('person'),
  name: z.string(),
  profile_path: z.string().nullable(),
  known_for_department: z.string().optional(),
})

export const SearchResultSchema = z.discriminatedUnion('media_type', [
  SearchMovieResultSchema,
  SearchTVResultSchema,
  SearchPersonResultSchema,
])

export const SearchResponseSchema = z.object({
  results: z.array(SearchResultSchema),
})

export type SearchMovie = z.infer<typeof SearchMovieResultSchema>
export type SearchTV = z.infer<typeof SearchTVResultSchema>
export type SearchPerson = z.infer<typeof SearchPersonResultSchema>
export type SearchResult = z.infer<typeof SearchResultSchema>