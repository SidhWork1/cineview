import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import ImageWithFallback from '../../../Common/components/ImageWithFallback'
import { collectionStore } from '../../data'
import { TMDB_IMAGE_BASE_URL, IMAGE_SIZES } from '../../../Common/constants'

const ListDetailPage = observer(() => {
  const { id } = useParams<{ id: string }>()
  const [isRenaming, setIsRenaming] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const list = id ? collectionStore.getListById(id) : undefined

  if (!list) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-white font-bold text-2xl">List Not Found</h1>
        <p className="text-white/40 text-sm">
          This list doesn't exist or has been deleted.
        </p>
        <Link
          to="/lists"
          className="text-purple-500 hover:text-purple-400 text-sm transition-colors"
        >
          Back to My Lists
        </Link>
      </div>
    )
  }

  const handleStartRename = () => {
    setNewName(list.name)
    setNewDescription(list.description ?? '')
    setIsRenaming(true)
  }

  const handleSaveRename = () => {
    if (!newName.trim()) return
    collectionStore.renameList(list.id, newName.trim(), newDescription.trim() || undefined)
    setIsRenaming(false)
  }

  const handleDelete = () => {
    collectionStore.deleteList(list.id)
    window.location.href = '/lists'
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex-1">
          {isRenaming ? (
            <div className="space-y-3 max-w-md">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value.slice(0, 60))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                autoFocus
              />
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Description (optional)"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white/70 text-sm focus:outline-none focus:border-purple-500 transition-colors"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setIsRenaming(false)}
                  className="px-4 py-1.5 bg-white/5 hover:bg-white/10 text-white/60 text-xs rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveRename}
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-white">{list.name}</h1>
              {list.description && (
                <p className="text-white/50 text-sm mt-1">{list.description}</p>
              )}
              <p className="text-white/30 text-xs mt-2">
                {list.items.length} {list.items.length === 1 ? 'item' : 'items'}
              </p>
            </>
          )}
        </div>

        {/* Actions */}
        {!isRenaming && (
          <div className="flex gap-2 ml-4">
            <button
              onClick={handleStartRename}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/60 text-xs rounded-lg transition-colors"
            >
              ✎ Rename
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <Link
        to="/lists"
        className="text-purple-500 hover:text-purple-400 text-sm transition-colors mb-8 inline-block"
      >
        ← Back to My Lists
      </Link>

      {/* Empty State */}
      {list.items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-white/30 text-sm">This list is empty.</p>
          <p className="text-white/20 text-xs mt-1">
            Add movies or TV shows from their detail pages.
          </p>
        </div>
      )}

      {/* Items Grid */}
      {list.items.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
          {list.items.map((item) => {
            const posterUrl = item.posterPath
              ? `${TMDB_IMAGE_BASE_URL}${IMAGE_SIZES.poster.medium}${item.posterPath}`
              : null
            const detailPath =
              item.mediaType === 'movie'
                ? `/movies/${item.mediaId}`
                : `/tv/${item.mediaId}`

            return (
              <div key={`${item.mediaType}_${item.mediaId}`} className="group relative">
                <Link to={detailPath}>
                  <div className="rounded-xl overflow-hidden aspect-[2/3] mb-2">
                    <ImageWithFallback
                      src={posterUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <p className="text-white/80 text-xs font-medium truncate">
                    {item.title}
                  </p>
                  <p className="text-white/40 text-xs">
                    ★ {item.rating.toFixed(1)}
                  </p>
                </Link>
                <button
                  onClick={() =>
                    collectionStore.removeFromList(list.id, item.mediaId, item.mediaType)
                  }
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/80 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="w-full max-w-sm bg-[#141414] border border-white/10 rounded-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-white font-semibold text-lg mb-2">
              Delete List
            </h2>
            <p className="text-white/50 text-sm mb-6">
              Are you sure you want to delete "{list.name}"? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white/70 text-sm rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 bg-red-500/80 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
})

export default ListDetailPage