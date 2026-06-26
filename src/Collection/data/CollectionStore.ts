import { makeAutoObservable, computed } from 'mobx'
import { WatchlistSchema, WatchlistEntrySchema } from '../core'
import type { WatchlistEntry, WatchStatus } from '../core'

const COLLECTION_KEY = 'cineview_collection'

class CollectionStore {
  entries: WatchlistEntry[] = []

  constructor() {
    makeAutoObservable(this, {
      watchlistCount: computed,
    })
    this.loadFromStorage()
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(COLLECTION_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        const validated = WatchlistSchema.safeParse(parsed)
        if (validated.success) {
          this.entries = validated.data
        }
      }
    } catch {
      this.entries = []
    }
  }

  private saveToStorage() {
    try {
      const validated = WatchlistSchema.safeParse(this.entries)
      if (validated.success) {
        localStorage.setItem(COLLECTION_KEY, JSON.stringify(validated.data))
      }
    } catch {
      console.error('Failed to save collection to storage')
    }
  }

  get watchlistCount(): number {
    return this.entries.length
  }

  isInWatchlist(mediaId: number, mediaType: 'movie' | 'tv'): boolean {
    return this.entries.some(
      (e) => e.mediaId === mediaId && e.mediaType === mediaType
    )
  }

  getEntry(mediaId: number, mediaType: 'movie' | 'tv'): WatchlistEntry | undefined {
    return this.entries.find(
      (e) => e.mediaId === mediaId && e.mediaType === mediaType
    )
  }

  getCountByStatus(status: WatchStatus): number {
    return this.entries.filter((e) => e.status === status).length
  }

  addToWatchlist(
    mediaId: number,
    mediaType: 'movie' | 'tv',
    title: string,
    posterPath: string | null,
    rating: number
  ) {
    if (this.isInWatchlist(mediaId, mediaType)) return

    const entry = WatchlistEntrySchema.parse({
      id: crypto.randomUUID(),
      mediaId,
      mediaType,
      status: 'want_to_watch',
      note: '',
      title,
      posterPath,
      rating,
      addedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    this.entries.push(entry)
    this.saveToStorage()
  }

  removeFromWatchlist(mediaId: number, mediaType: 'movie' | 'tv') {
    this.entries = this.entries.filter(
      (e) => !(e.mediaId === mediaId && e.mediaType === mediaType)
    )
    this.saveToStorage()
  }

  updateStatus(mediaId: number, mediaType: 'movie' | 'tv', status: WatchStatus) {
    const entry = this.getEntry(mediaId, mediaType)
    if (!entry) return
    entry.status = status
    entry.updatedAt = new Date().toISOString()
    this.saveToStorage()
  }

  updateNote(mediaId: number, mediaType: 'movie' | 'tv', note: string) {
    const entry = this.getEntry(mediaId, mediaType)
    if (!entry) return
    entry.note = note.slice(0, 300)
    entry.updatedAt = new Date().toISOString()
    this.saveToStorage()
  }

  clearWatchlist() {
    this.entries = []
    this.saveToStorage()
  }
}

export const collectionStore = new CollectionStore()
export default CollectionStore