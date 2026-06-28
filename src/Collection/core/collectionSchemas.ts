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

export const ListItemSchema = z.object({
  mediaId: z.number(),
  mediaType: z.enum(['movie', 'tv']),
  title: z.string(),
  posterPath: z.string().nullable(),
  rating: z.number(),
  addedAt: z.string(),
})

export const CustomListSchema = z.object({
  id: z.string(),
  name: z.string().max(60),
  description: z.string().optional(),
  items: z.array(ListItemSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const CustomListsSchema = z.array(CustomListSchema)

export const EpisodeProgressSchema = z.record(z.string(), z.array(z.number()))

export const CollectionStorageSchema = z.object({
  watchlist: WatchlistSchema,
  lists: CustomListsSchema,
  episodeProgress: EpisodeProgressSchema,
})

export type WatchStatus = z.infer<typeof WatchStatusSchema>
export type WatchlistEntry = z.infer<typeof WatchlistEntrySchema>
export type ListItem = z.infer<typeof ListItemSchema>
export type CustomList = z.infer<typeof CustomListSchema>
export type EpisodeProgress = z.infer<typeof EpisodeProgressSchema>