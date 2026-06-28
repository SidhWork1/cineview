import { useState } from 'react'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import ImageWithFallback from '../../../Common/components/ImageWithFallback'
import { collectionStore } from '../../data'
import { TMDB_IMAGE_BASE_URL, IMAGE_SIZES } from '../../../Common/constants'

const MyListsPage = observer(() => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [newListDescription, setNewListDescription] = useState('')

  const handleCreateList = () => {
    if (!newListName.trim()) return
    collectionStore.createList(newListName.trim(), newListDescription.trim() || undefined)
    setNewListName('')
    setNewListDescription('')
    setShowCreateModal(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">My Lists</h1>
          <p className="text-white/50 text-sm mt-1">
            Manage and share your curated collections of cinema.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + Create New List
        </button>
      </div>

      {/* Empty State */}
      {collectionStore.lists.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-white/30 text-sm">
            You haven't created any lists yet.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 text-purple-400 hover:text-purple-300 text-sm transition-colors"
          >
            Create your first list
          </button>
        </div>
      )}

      {/* Lists Grid */}
      {collectionStore.lists.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collectionStore.lists.map((list) => {
            const previewItems = list.items.slice(0, 4)

            return (
              <Link
                key={list.id}
                to={`/lists/${list.id}`}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-colors group"
              >
                {/* Poster Previews */}
                <div className="flex gap-2 mb-4 h-24">
                  {previewItems.length > 0 ? (
                    previewItems.map((item) => {
                      const posterUrl = item.posterPath
                        ? `${TMDB_IMAGE_BASE_URL}${IMAGE_SIZES.poster.small}${item.posterPath}`
                        : null
                      return (
                        <div
                          key={`${item.mediaType}_${item.mediaId}`}
                          className="flex-1 rounded-lg overflow-hidden"
                        >
                          <ImageWithFallback
                            src={posterUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )
                    })
                  ) : (
                    <div className="w-full h-full bg-white/5 rounded-lg flex items-center justify-center">
                      <span className="text-white/20 text-xs">No items yet</span>
                    </div>
                  )}
                </div>

                {/* List Info */}
                <h3 className="text-white font-semibold text-sm group-hover:text-purple-400 transition-colors">
                  {list.name}
                </h3>
                <p className="text-white/40 text-xs mt-1">
                  {list.items.length} {list.items.length === 1 ? 'item' : 'items'}
                </p>
                {list.description && (
                  <p className="text-white/30 text-xs mt-1 truncate">
                    {list.description}
                  </p>
                )}
              </Link>
            )
          })}
        </div>
      )}

      {/* Create List Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="w-full max-w-md bg-[#141414] border border-white/10 rounded-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-white font-semibold text-lg mb-4">
              Create New List
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-1.5">
                  List Name
                </label>
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value.slice(0, 60))}
                  placeholder="e.g. Sci-Fi Classics"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-500 transition-colors"
                  autoFocus
                />
                <p className="text-white/30 text-xs mt-1 text-right">
                  {newListName.length}/60
                </p>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-1.5">
                  Description (optional)
                </label>
                <textarea
                  value={newListDescription}
                  onChange={(e) => setNewListDescription(e.target.value)}
                  placeholder="What's this list about?"
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white/70 text-sm rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateList}
                  disabled={!newListName.trim()}
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Create List
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
})

export default MyListsPage