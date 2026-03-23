const NoteCard = ({ data, deleteNote, editNote }) => {
  const hasImage = data.attachment?.type === 'image'
  const hasAudio = data.attachment?.type === 'audio'

  return (
    <div className="flex flex-col bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all duration-200">

      {/* Image preview — sirf tab dikhega jab image ho */}
      {hasImage && (
        <div className="h-36 overflow-hidden shrink-0">
          <img
            src={data.attachment.url}
            alt={data.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col p-4 gap-2">

        {/* Title */}
        <h3 className="text-sm font-semibold text-white capitalize leading-tight line-clamp-2">
          {data.title}
        </h3>

        {/* Accent line */}
        <div className="w-6 h-0.5 bg-indigo-500/60 rounded-full"></div>

        {/* Description */}
        <p className="text-gray-400 text-xs leading-relaxed line-clamp-3 min-h-[48px]">
          {data.description || 'No description'}
        </p>

        {/* Audio indicator */}
        {hasAudio && (
          <div className="flex items-center gap-1.5 text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded-lg">
            <span>🎵</span>
            <span>Audio attached</span>
          </div>
        )}

        {/* Date */}
        <p className="text-gray-600 text-xs">
          {new Date(data.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
          })}
        </p>

        {/* Buttons */}
        <div className="flex gap-2 mt-1">
          <button
            onClick={() => deleteNote(data._id)}
            className="flex-1 border border-red-500/25 text-red-400 py-1.5 rounded-lg text-xs font-medium hover:bg-red-500/15 active:scale-95 transition cursor-pointer"
          >
            Delete
          </button>
          <button
            onClick={() => editNote(data._id, data)}
            className="flex-1 border border-indigo-500/25 text-indigo-400 py-1.5 rounded-lg text-xs font-medium hover:bg-indigo-500/15 active:scale-95 transition cursor-pointer"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  )
}

export default NoteCard
