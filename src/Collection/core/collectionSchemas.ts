import { z } from 'zod'

export const WatchStatusSchema = z.enum([
  'want_to_watch',
  'watching',
  'completed',
])

export const WatchlistEntrySchema = z.object({
  id: z.string(),
  mediaId: z.number(),
  mediaType: z.enum(['movie', 'tv']),
  status: WatchStatusSchema,
  note: z.string().max(300),
  title: z.string(),
  posterPath: z.string().nullable(),
  rating: z.number(),
  addedAt: z.string(),
  updatedAt: z.string(),
})

export const WatchlistSchema = z.array(WatchlistEntrySchema)

export type WatchStatus = z.infer<typeof WatchStatusSchema>
export type WatchlistEntry = z.infer<typeof WatchlistEntrySchema>