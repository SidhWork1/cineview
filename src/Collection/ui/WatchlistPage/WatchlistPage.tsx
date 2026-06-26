import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import WatchlistCard from '../WatchlistCard'
import { collectionStore } from '../../data'
import type { WatchStatus, WatchlistEntry } from '../../core'

type FilterTab = 'all' | WatchStatus
type SortOption = 'date_added' | 'rating' | 'title'

const WatchlistPage = observer(() => {
  const { t } = useTranslation('watchlist')
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [sortBy, setSortBy] = useState<SortOption>('date_added')

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: t('status.all'), count: collectionStore.entries.length },
    { key: 'want_to_watch', label: t('status.wantToWatch'), count: collectionStore.getCountByStatus('want_to_watch') },
    { key: 'watching', label: t('status.watching'), count: collectionStore.getCountByStatus('watching') },
    { key: 'completed', label: t('status.completed'), count: collectionStore.getCountByStatus('completed') },
  ]

  const filtered: WatchlistEntry[] =
    activeTab === 'all'
      ? [...collectionStore.entries]
      : collectionStore.entries.filter((e) => e.status === activeTab)

  const sorted = filtered.sort((a, b) => {
    if (sortBy === 'date_added') {
      return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    }
    if (sortBy === 'rating') return b.rating - a.rating
    if (sortBy === 'title') return a.title.localeCompare(b.title)
    return 0
  })

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <h1 className="text-3xl font-bold text-white mb-2">{t('title')}</h1>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap mb-6 mt-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
            }`}
          >
            {tab.label}
            <span className="ml-1.5 opacity-60">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Sort Controls */}
      <div className="flex items-center justify-end mb-6">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white/70 text-xs focus:outline-none focus:border-purple-500 transition-colors"
        >
          <option value="date_added">Date Added</option>
          <option value="rating">Rating</option>
          <option value="title">Title</option>
        </select>
      </div>

      {/* Empty State */}
      {sorted.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-white/30 text-sm">{t('empty')}</p>
        </div>
      )}

      {/* Grid */}
      {sorted.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {sorted.map((entry) => (
            <WatchlistCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  )
})

export default WatchlistPage