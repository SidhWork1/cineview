import { makeAutoObservable, computed } from 'mobx'
import {
  CollectionStorageSchema,
  WatchlistEntrySchema,
} from '../core'
import type {
  WatchlistEntry,
  WatchStatus,
  CustomList,
  EpisodeProgress,
} from '../core'

const COLLECTION_KEY = 'cineview_collection'

class CollectionStore {
  watchlist: WatchlistEntry[] = []
  lists: CustomList[] = []
  episodeProgress: EpisodeProgress = {}

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
        const validated = CollectionStorageSchema.safeParse(parsed)
        if (validated.success) {
          this.watchlist = validated.data.watchlist
          this.lists = validated.data.lists
          this.episodeProgress = validated.data.episodeProgress
        }
      }
    } catch {
      this.watchlist = []
      this.lists = []
      this.episodeProgress = {}
    }
  }

  private saveToStorage() {
    try {
      const data = {
        watchlist: this.watchlist,
        lists: this.lists,
        episodeProgress: this.episodeProgress,
      }
      const validated = CollectionStorageSchema.safeParse(data)
      if (validated.success) {
        localStorage.setItem(COLLECTION_KEY, JSON.stringify(validated.data))
      }
    } catch {
      console.error('Failed to save collection to storage')
    }
  }

  // ─── Watchlist ───────────────────────────────────────────

  get watchlistCount(): number {
    return this.watchlist.length
  }

  get entries(): WatchlistEntry[] {
    return this.watchlist
  }

  isInWatchlist(mediaId: number, mediaType: 'movie' | 'tv'): boolean {
    return this.watchlist.some(
      (e) => e.mediaId === mediaId && e.mediaType === mediaType
    )
  }

  getEntry(mediaId: number, mediaType: 'movie' | 'tv'): WatchlistEntry | undefined {
    return this.watchlist.find(
      (e) => e.mediaId === mediaId && e.mediaType === mediaType
    )
  }

  getCountByStatus(status: WatchStatus): number {
    return this.watchlist.filter((e) => e.status === status).length
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

    this.watchlist.push(entry)
    this.saveToStorage()
  }

  removeFromWatchlist(mediaId: number, mediaType: 'movie' | 'tv') {
    this.watchlist = this.watchlist.filter(
      (e) => !(e.mediaId === mediaId && e.mediaType === mediaType)
    )
    const progressKey = `${mediaType}_${mediaId}`
    delete this.episodeProgress[progressKey]
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
    this.watchlist = []
    this.saveToStorage()
  }

  // ─── Custom Lists ─────────────────────────────────────────

  getListById(id: string): CustomList | undefined {
    return this.lists.find((l) => l.id === id)
  }

  isInList(listId: string, mediaId: number, mediaType: 'movie' | 'tv'): boolean {
    const list = this.getListById(listId)
    if (!list) return false
    return list.items.some(
      (i) => i.mediaId === mediaId && i.mediaType === mediaType
    )
  }

  createList(name: string, description?: string) {
    const list: CustomList = {
      id: crypto.randomUUID(),
      name: name.slice(0, 60),
      description,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.lists.push(list)
    this.saveToStorage()
  }

  renameList(listId: string, name: string, description?: string) {
    const list = this.getListById(listId)
    if (!list) return
    list.name = name.slice(0, 60)
    list.description = description
    list.updatedAt = new Date().toISOString()
    this.saveToStorage()
  }

  deleteList(listId: string) {
    this.lists = this.lists.filter((l) => l.id !== listId)
    this.saveToStorage()
  }

  addToList(
    listId: string,
    mediaId: number,
    mediaType: 'movie' | 'tv',
    title: string,
    posterPath: string | null,
    rating: number
  ) {
    const list = this.getListById(listId)
    if (!list) return
    if (this.isInList(listId, mediaId, mediaType)) return
    list.items.push({
      mediaId,
      mediaType,
      title,
      posterPath,
      rating,
      addedAt: new Date().toISOString(),
    })
    list.updatedAt = new Date().toISOString()
    this.saveToStorage()
  }

  removeFromList(listId: string, mediaId: number, mediaType: 'movie' | 'tv') {
    const list = this.getListById(listId)
    if (!list) return
    list.items = list.items.filter(
      (i) => !(i.mediaId === mediaId && i.mediaType === mediaType)
    )
    list.updatedAt = new Date().toISOString()
    this.saveToStorage()
  }

  // ─── Episode Progress ─────────────────────────────────────

  private getProgressKey(showId: number, seasonNumber: number): string {
    return `tv_${showId}_season_${seasonNumber}`
  }

  isEpisodeWatched(showId: number, seasonNumber: number, episodeNumber: number): boolean {
    const key = this.getProgressKey(showId, seasonNumber)
    return this.episodeProgress[key]?.includes(episodeNumber) ?? false
  }

  getSeasonProgress(showId: number, seasonNumber: number, totalEpisodes: number): number {
    const key = this.getProgressKey(showId, seasonNumber)
    const watched = this.episodeProgress[key]?.length ?? 0
    if (totalEpisodes === 0) return 0
    return Math.round((watched / totalEpisodes) * 100)
  }

  toggleEpisodeWatched(showId: number, seasonNumber: number, episodeNumber: number) {
    const key = this.getProgressKey(showId, seasonNumber)
    const current = this.episodeProgress[key] ?? []
    if (current.includes(episodeNumber)) {
      this.episodeProgress[key] = current.filter((n) => n !== episodeNumber)
    } else {
      this.episodeProgress[key] = [...current, episodeNumber]
    }
    this.saveToStorage()
  }

  markAllEpisodes(showId: number, seasonNumber: number, episodeNumbers: number[]) {
    const key = this.getProgressKey(showId, seasonNumber)
    this.episodeProgress[key] = [...episodeNumbers]
    this.saveToStorage()
  }

  unmarkAllEpisodes(showId: number, seasonNumber: number) {
    const key = this.getProgressKey(showId, seasonNumber)
    this.episodeProgress[key] = []
    this.saveToStorage()
  }
}

export const collectionStore = new CollectionStore()
export default CollectionStore