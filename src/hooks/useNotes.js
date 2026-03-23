import { useState, useEffect } from 'react'
import API from '../utils/api'

const useNotes = () => {
  const [notesData, setNotesData]       = useState([])
  const [deletedNotes, setDeletedNotes] = useState([])
  const [workData, setWorkData]         = useState('')
  const [descData, setDescData]         = useState('')
  const [editId, setEditId]             = useState(null)
  const [searchData, setSearchData]     = useState('')
  const [loading, setLoading]           = useState(false)
  const [attachment, setAttachment]     = useState(null) // file object

  useEffect(() => {
    fetchNotes()
    fetchDeletedNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const res = await API.get('/notes')
      setNotesData(res.data)
    } catch (err) { console.log(err) }
  }

  const fetchDeletedNotes = async () => {
    try {
      const res = await API.get('/notes/deleted')
      setDeletedNotes(res.data)
    } catch (err) { console.log(err) }
  }

  const addNotes = async (e) => {
    e.preventDefault()
    if (!workData.trim()) return
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', workData)
      formData.append('description', descData)
      if (attachment) formData.append('attachment', attachment)

      if (editId) {
        const res = await API.put(`/notes/${editId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        setNotesData(prev => prev.map(n => n._id === editId ? res.data : n))
        setEditId(null)
      } else {
        const res = await API.post('/notes', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        setNotesData(prev => [res.data, ...prev])
      }
      setWorkData('')
      setDescData('')
      setAttachment(null)
    } catch (err) { console.log(err) }
    finally { setLoading(false) }
  }

  const deleteNote = async (id) => {
    try {
      await API.delete(`/notes/${id}`)
      const moved = notesData.find(n => n._id === id)
      setNotesData(prev => prev.filter(n => n._id !== id))
      setDeletedNotes(prev => [{ ...moved, isDeleted: true }, ...prev])
    } catch (err) { console.log(err) }
  }

  const restoreNote = async (id) => {
    try {
      const res = await API.put(`/notes/${id}/restore`)
      setDeletedNotes(prev => prev.filter(n => n._id !== id))
      setNotesData(prev => [res.data.note, ...prev])
    } catch (err) { console.log(err) }
  }

  const permanentDelete = async (id) => {
    try {
      await API.delete(`/notes/${id}/permanent`)
      setDeletedNotes(prev => prev.filter(n => n._id !== id))
    } catch (err) { console.log(err) }
  }

  const editNote = (id, item) => {
    setWorkData(item.title)
    setDescData(item.description)
    setEditId(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelEdit = () => {
    setWorkData('')
    setDescData('')
    setEditId(null)
    setAttachment(null)
  }

  const filteredNotes = notesData.filter(n =>
    n.title?.toLowerCase().includes(searchData.toLowerCase()) ||
    n.description?.toLowerCase().includes(searchData.toLowerCase())
  )

  return {
    notesData, deletedNotes,
    workData, setWorkData,
    descData, setDescData,
    editId, attachment, setAttachment,
    loading, searchData, setSearchData,
    addNotes, deleteNote, restoreNote,
    permanentDelete, editNote, cancelEdit,
    filteredNotes
  }
}

export default useNotes
