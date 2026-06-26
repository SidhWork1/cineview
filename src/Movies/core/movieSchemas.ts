import { z } from 'zod'

export const GenreSchema = z.object({
  id: z.number(),
  name: z.string(),
})

export const MovieSchema = z.object({
  id: z.number(),
  title: z.string(),
  overview: z.string(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  vote_average: z.number(),
  vote_count: z.number(),
  release_date: z.string().optional(),
  genre_ids: z.array(z.number()).optional(),
  genres: z.array(GenreSchema).optional(),
})

export const MovieListResponseSchema = z.object({
  results: z.array(MovieSchema),
})

export const CastMemberSchema = z.object({
  id: z.number(),
  name: z.string(),
  character: z.string(),
  profile_path: z.string().nullable(),
})

export const MovieCreditsSchema = z.object({
  cast: z.array(CastMemberSchema),
})

export const VideoSchema = z.object({
  key: z.string(),
  site: z.string(),
  type: z.string(),
})

export const MovieVideosSchema = z.object({
  results: z.array(VideoSchema),
})

export const MovieDetailSchema = MovieSchema.extend({
  genres: z.array(GenreSchema),
  runtime: z.number().nullable(),
  tagline: z.string().nullable(),
  status: z.string(),
})

export const GenreListSchema = z.object({
  genres: z.array(GenreSchema),
})

export type Genre = z.infer<typeof GenreSchema>
export type Movie = z.infer<typeof MovieSchema>
export type MovieDetail = z.infer<typeof MovieDetailSchema>
export type CastMember = z.infer<typeof CastMemberSchema>
export type Video = z.infer<typeof VideoSchema>