import { useNavigate } from 'react-router-dom'
import useNotes from '../hooks/useNotes'

const DeletedNotes = () => {
  const { deletedNotes, permanentDelete, restoreNote } = useNotes()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/home')}
            className="text-gray-500 hover:text-white transition text-sm flex items-center gap-1">
            ← Back
          </button>
          <h1 className="text-xl font-semibold text-white">Trash</h1>
          {deletedNotes.length > 0 && (
            <span className="bg-red-500/15 border border-red-500/25 text-red-400 text-xs px-2.5 py-0.5 rounded-full font-medium">
              {deletedNotes.length}
            </span>
          )}
        </div>

        {deletedNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <span className="text-5xl">🗑️</span>
            <p className="text-gray-500">Trash is empty</p>
            <p className="text-gray-700 text-sm">Deleted notes will appear here</p>
          </div>
        ) : (
          <>
            <p className="text-gray-600 text-sm mb-6">Restore or permanently delete your notes.</p>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {deletedNotes.map(item => (
                <div key={item._id}
                  className="flex flex-col bg-white/3 border border-white/8 rounded-xl p-4 h-44 hover:border-white/15 transition-all">
                  <h3 className="text-sm font-semibold text-gray-300 capitalize line-clamp-1 mb-1">{item.title}</h3>
                  <div className="w-6 h-0.5 bg-red-500/40 rounded-full mb-2"></div>
                  <p className="text-gray-600 text-xs leading-relaxed line-clamp-3 flex-1">{item.description}</p>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => permanentDelete(item._id)}
                      className="flex-1 border border-red-500/25 text-red-500 py-1.5 rounded-lg text-xs font-medium hover:bg-red-500/15 transition cursor-pointer">
                      Delete forever
                    </button>
                    <button onClick={() => restoreNote(item._id)}
                      className="flex-1 border border-green-500/25 text-green-400 py-1.5 rounded-lg text-xs font-medium hover:bg-green-500/15 transition cursor-pointer">
                      Restore
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default DeletedNotes
