import { useState } from 'react'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import ImageWithFallback from '../../../Common/components/ImageWithFallback'
import { collectionStore } from '../../data'
import { TMDB_IMAGE_BASE_URL, IMAGE_SIZES } from '../../../Common/constants'
import type { WatchlistEntry, WatchStatus } from '../../core'

interface WatchlistCardProps {
  entry: WatchlistEntry
}

const STATUS_LABELS: Record<WatchStatus, string> = {
  want_to_watch: 'Want to Watch',
  watching: 'Watching',
  completed: 'Completed',
}

const STATUS_COLORS: Record<WatchStatus, string> = {
  want_to_watch: 'bg-blue-500/20 text-blue-400',
  watching: 'bg-yellow-500/20 text-yellow-400',
  completed: 'bg-green-500/20 text-green-400',
}

const WatchlistCard = observer(({ entry }: WatchlistCardProps) => {
  const [isEditingNote, setIsEditingNote] = useState(false)
  const [noteText, setNoteText] = useState(entry.note)

  const posterUrl = entry.posterPath
    ? `${TMDB_IMAGE_BASE_URL}${IMAGE_SIZES.poster.medium}${entry.posterPath}`
    : null

  const detailPath =
    entry.mediaType === 'movie'
      ? `/movies/${entry.mediaId}`
      : `/tv/${entry.mediaId}`

  const handleStatusChange = (status: WatchStatus) => {
    collectionStore.updateStatus(entry.mediaId, entry.mediaType, status)
  }

  const handleNoteSave = () => {
    collectionStore.updateNote(entry.mediaId, entry.mediaType, noteText)
    setIsEditingNote(false)
  }

  const handleNoteCancel = () => {
    setNoteText(entry.note)
    setIsEditingNote(false)
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-colors">
      {/* Poster */}
      <Link to={detailPath}>
        <div className="aspect-[2/3] overflow-hidden">
          <ImageWithFallback
            src={posterUrl}
            alt={entry.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <Link to={detailPath}>
          <h3 className="text-white font-medium text-sm truncate mb-1">
            {entry.title}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-yellow-400 text-xs">
            ★ {entry.rating.toFixed(1)}
          </span>
        </div>

        {/* Status Badge */}
        <span
          className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-3 ${STATUS_COLORS[entry.status]}`}
        >
          {STATUS_LABELS[entry.status]}
        </span>

        {/* Status Selector */}
        <select
          value={entry.status}
          onChange={(e) => handleStatusChange(e.target.value as WatchStatus)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white/70 text-xs focus:outline-none focus:border-purple-500 transition-colors mb-3"
        >
          <option value="want_to_watch">Want to Watch</option>
          <option value="watching">Watching</option>
          <option value="completed">Completed</option>
        </select>

        {/* Note */}
        {isEditingNote ? (
          <div>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value.slice(0, 300))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs resize-none focus:outline-none focus:border-purple-500 transition-colors"
              rows={3}
              placeholder="Add a note..."
            />
            <div className="flex items-center justify-between mt-1">
              <span
                className={`text-xs ${
                  noteText.length >= 280
                    ? 'text-red-400'
                    : 'text-white/30'
                }`}
              >
                {noteText.length}/300
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleNoteCancel}
                  className="text-xs text-white/40 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNoteSave}
                  className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsEditingNote(true)}
            className="w-full text-left text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            {entry.note ? (
              <span className="text-white/50 line-clamp-2">{entry.note}</span>
            ) : (
              '+ Add note'
            )}
          </button>
        )}

        {/* Remove */}
        <button
          onClick={() =>
            collectionStore.removeFromWatchlist(entry.mediaId, entry.mediaType)
          }
          className="w-full mt-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs rounded-lg transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  )
})

export default WatchlistCard