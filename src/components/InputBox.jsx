import { useRef } from 'react'

const InputBox = ({ workData, setWorkData, descData, setDescData, addNotes, loading, editId, cancelEdit, attachment, setAttachment }) => {
  const fileRef = useRef()

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (file) setAttachment(file)
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
        {editId ? '✏️ Edit note' : '+ New note'}
      </h3>
      <form onSubmit={addNotes} className="flex flex-col gap-3">
        <input
          value={workData} onChange={e => setWorkData(e.target.value)}
          placeholder="Title..."
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-indigo-500/60 transition placeholder-gray-600"
        />
        <textarea
          value={descData} onChange={e => setDescData(e.target.value)}
          placeholder="What's on your mind..."
          rows={4}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-indigo-500/60 transition resize-none placeholder-gray-600"
        />

        {/* Attachment preview */}
        {attachment && (
          <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-3 py-2">
            <span className="text-indigo-400 text-xs">{attachment.type?.startsWith('audio') ? '🎵' : '🖼️'}</span>
            <span className="text-indigo-300 text-xs flex-1 truncate">{attachment.name}</span>
            <button type="button" onClick={() => setAttachment(null)} className="text-gray-500 hover:text-white text-xs">✕</button>
          </div>
        )}

        <div className="flex gap-2">
          {/* Attach file button */}
          <button type="button" onClick={() => fileRef.current.click()}
            className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-gray-400 hover:text-white px-3 py-2 rounded-xl text-xs transition hover:bg-white/10">
            📎 Attach
          </button>
          <input ref={fileRef} type="file" accept="image/*,audio/*" className="hidden" onChange={handleFile} />

          {editId && (
            <button type="button" onClick={cancelEdit}
              className="flex-1 bg-white/5 border border-white/10 text-gray-400 py-2 rounded-xl text-sm transition hover:bg-white/10">
              Cancel
            </button>
          )}

          <button type="submit" disabled={loading || !workData.trim()}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-xl text-sm font-semibold transition disabled:opacity-50">
            {loading ? 'Saving...' : editId ? 'Update' : 'Add Note'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default InputBox
