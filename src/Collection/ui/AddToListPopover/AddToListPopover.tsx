import { useState, useRef, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { collectionStore } from '../../data'

interface AddToListPopoverProps {
  mediaId: number
  mediaType: 'movie' | 'tv'
  title: string
  posterPath: string | null
  rating: number
}

const AddToListPopover = observer(({
  mediaId,
  mediaType,
  title,
  posterPath,
  rating,
}: AddToListPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [newListName, setNewListName] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggleList = (listId: string) => {
    if (collectionStore.isInList(listId, mediaId, mediaType)) {
      collectionStore.removeFromList(listId, mediaId, mediaType)
    } else {
      collectionStore.addToList(listId, mediaId, mediaType, title, posterPath, rating)
    }
  }

  const handleCreateAndAdd = () => {
    if (!newListName.trim()) return
    collectionStore.createList(newListName.trim())
    const newList = collectionStore.lists[collectionStore.lists.length - 1]
    if (newList) {
      collectionStore.addToList(newList.id, mediaId, mediaType, title, posterPath, rating)
    }
    setNewListName('')
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors"
      >
        ☰ Add to List
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="p-3 border-b border-white/10">
            <p className="text-white/60 text-xs font-medium">Add to list</p>
          </div>

          {/* Existing Lists */}
          <div className="max-h-48 overflow-y-auto">
            {collectionStore.lists.length === 0 && (
              <p className="text-white/30 text-xs p-3">
                No lists yet. Create one below.
              </p>
            )}
            {collectionStore.lists.map((list) => {
              const isAdded = collectionStore.isInList(list.id, mediaId, mediaType)
              return (
                <button
                  key={list.id}
                  onClick={() => handleToggleList(list.id)}
                  className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/5 transition-colors"
                >
                  <span className="text-white/80 text-xs truncate">
                    {list.name}
                  </span>
                  <span
                    className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ml-2 ${
                      isAdded
                        ? 'bg-purple-600 border-purple-600'
                        : 'border-white/20'
                    }`}
                  >
                    {isAdded && (
                      <span className="text-white text-xs">✓</span>
                    )}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Create New List */}
          <div className="p-3 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value.slice(0, 60))}
                placeholder="New list name..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-purple-500 transition-colors"
              />
              <button
                onClick={handleCreateAndAdd}
                disabled={!newListName.trim()}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-xs rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
})

export default AddToListPopover