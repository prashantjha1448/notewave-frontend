import Navbar from '../components/Navbar'
import InputBox from '../components/InputBox'
import NoteCard from '../components/NoteCard'
import useNotes from '../hooks/useNotes'

const Home = () => {
  const {
    notesData, workData, setWorkData, descData, setDescData,
    editId, attachment, setAttachment,
    loading, searchData, setSearchData,
    addNotes, deleteNote, editNote, cancelEdit, filteredNotes
  } = useNotes()

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar searchData={searchData} setSearchData={setSearchData} notesCount={notesData.length} />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8 flex flex-col gap-8">

        {/* Input */}
        <div className="w-full max-w-lg">
          <InputBox
            workData={workData} setWorkData={setWorkData}
            descData={descData} setDescData={setDescData}
            addNotes={addNotes} loading={loading}
            editId={editId} cancelEdit={cancelEdit}
            attachment={attachment} setAttachment={setAttachment}
          />
        </div>

        {/* Notes section */}
        {filteredNotes.length > 0 ? (
          <>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                {searchData ? `Results for "${searchData}"` : 'Your notes'}
              </span>
              <div className="flex-1 h-px bg-white/5"></div>
              <span className="text-xs text-gray-600">{filteredNotes.length} notes</span>
            </div>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredNotes.map(item => (
                <NoteCard key={item._id} data={item} deleteNote={deleteNote} editNote={editNote} />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <span className="text-5xl">📝</span>
            <p className="text-gray-500 text-base">
              {searchData ? 'No notes match your search' : 'No notes yet — write your first one!'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
