import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import { serverUrl } from '../App'
import { AnimatePresence, motion } from "motion/react"
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import FinalResult from '../components/FinalResult'
import {
  deleteNote, getFolders, createFolder, deleteFolder, moveNoteToFolder, updateFolder
} from '../services/api'

const FOLDER_COLORS = ['#7c3aed', '#2563eb', '#059669', '#dc2626', '#d97706', '#db2777']

function History() {
  const [topics, setTopics] = useState([])
  const [search, setSearch] = useState("")
  const [deleting, setDeleting] = useState(null)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { userData } = useSelector((state) => state.user)
  const credits = userData?.credits

  // Folders
  const [folders, setFolders] = useState([])
  const [selectedFolder, setSelectedFolder] = useState(null)
  const [creatingFolder, setCreatingFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [newFolderColor, setNewFolderColor] = useState(FOLDER_COLORS[0])
  const folderInputRef = useRef()

  // Note detail
  const [activeNoteId, setActiveNoteId] = useState(null)
  const [selectedNote, setSelectedNote] = useState(null)
  const [loadingNote, setLoadingNote] = useState(false)

  // Move note
  const [movingNoteId, setMovingNoteId] = useState(null)

  // Rename folder
  const [renamingFolder, setRenamingFolder] = useState(null)
  const [renameValue, setRenameValue] = useState("")

  useEffect(() => {
    const noteId = searchParams.get('note')
    if (noteId) openNoteById(noteId)
  }, [searchParams])

  useEffect(() => {
    const load = async () => {
      try {
        const [notesRes, foldersRes] = await Promise.all([
          axios.get(serverUrl + "/api/notes/getnotes", { withCredentials: true }),
          getFolders()
        ])
        setTopics(Array.isArray(notesRes.data) ? notesRes.data : [])
        setFolders(Array.isArray(foldersRes) ? foldersRes : [])
      } catch (error) {
        console.log(error)
      }
    }
    load()
  }, [])

  const openNoteById = async (noteId) => {
    setLoadingNote(true)
    setActiveNoteId(noteId)
    try {
      const res = await axios.get(serverUrl + `/api/notes/${noteId}`, { withCredentials: true })
      setSelectedNote(res.data.content)
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingNote(false)
    }
  }

  const handleDelete = async (e, noteId) => {
    e.stopPropagation()
    if (!window.confirm("Delete this note?")) return
    setDeleting(noteId)
    try {
      await deleteNote(noteId)
      setTopics(prev => prev.filter(t => t._id !== noteId))
      if (activeNoteId === noteId) { setSelectedNote(null); setActiveNoteId(null) }
    } catch (err) {
      console.log(err)
    } finally {
      setDeleting(null)
    }
  }

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return
    try {
      const folder = await createFolder(newFolderName.trim(), newFolderColor)
      setFolders(prev => [folder, ...prev])
      setNewFolderName("")
      setCreatingFolder(false)
    } catch (err) {
      console.log(err)
    }
  }

  const handleDeleteFolder = async (e, folderId) => {
    e.stopPropagation()
    if (!window.confirm("Delete this folder? Notes inside will become unfoldered.")) return
    try {
      await deleteFolder(folderId)
      setFolders(prev => prev.filter(f => f._id !== folderId))
      setTopics(prev => prev.map(n => n.folder?._id === folderId ? { ...n, folder: null } : n))
      if (selectedFolder === folderId) setSelectedFolder(null)
    } catch (err) {
      console.log(err)
    }
  }

  const handleMoveNote = async (noteId, folderId) => {
    try {
      await moveNoteToFolder(noteId, folderId)
      const folder = folderId ? folders.find(f => f._id === folderId) : null
      setTopics(prev => prev.map(n =>
        n._id === noteId ? { ...n, folder: folder ? { _id: folder._id, name: folder.name, color: folder.color } : null } : n
      ))
    } catch (err) {
      console.log(err)
    } finally {
      setMovingNoteId(null)
    }
  }

  const handleRenameFolder = async (folderId) => {
    if (!renameValue.trim()) return
    try {
      const updated = await updateFolder(folderId, { name: renameValue.trim() })
      setFolders(prev => prev.map(f => f._id === folderId ? { ...f, name: updated.name } : f))
      setTopics(prev => prev.map(n => n.folder?._id === folderId ? { ...n, folder: { ...n.folder, name: updated.name } } : n))
    } catch (err) {
      console.log(err)
    } finally {
      setRenamingFolder(null)
    }
  }

  const filteredTopics = topics.filter(t => {
    const matchSearch = t.topic.toLowerCase().includes(search.toLowerCase())
    if (selectedFolder === null) return matchSearch
    if (selectedFolder === 'unfoldered') return matchSearch && !t.folder
    return matchSearch && t.folder?._id === selectedFolder
  })

  const notesInFolder = (folderId) => topics.filter(t => t.folder?._id === folderId).length
  const unFolderedCount = topics.filter(t => !t.folder).length

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* Top bar */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-[#1a1a1a] bg-[#0a0a0a] z-20 flex-shrink-0">
        <div className="flex items-center gap-4">
          <span onClick={() => navigate("/")} className="text-white font-semibold text-sm cursor-pointer">
            ExamNotes <span className="text-[#7c3aed]">AI</span>
          </span>
          <div className="w-px h-4 bg-[#1f1f1f]" />
          <span className="text-[#555] text-sm">Note History</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/graph')} className="px-3 py-1.5 text-xs border border-[#1f1f1f] text-[#888] hover:border-[#7c3aed] hover:text-[#a78bfa] transition-colors">
            Graph View
          </button>
          <button onClick={() => navigate('/notes')} className="px-3 py-1.5 text-xs border border-[#7c3aed] text-[#a78bfa] hover:bg-[#7c3aed]/10 transition-colors">
            + New Note
          </button>
          <div className="px-3 py-1.5 text-xs border border-[#1f1f1f] text-[#888] flex items-center gap-1">
            <span className="text-[#7c3aed]">◆</span> {credits}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 49px)' }}>

        {/* Left: Folders */}
        <aside className="w-52 flex-shrink-0 border-r border-[#1a1a1a] flex flex-col bg-[#0a0a0a] overflow-y-auto">
          <div className="px-4 pt-5 pb-3 flex items-center justify-between">
            <span className="text-[#444] text-[10px] uppercase tracking-widest font-semibold">Folders</span>
            <button
              onClick={() => { setCreatingFolder(true); setTimeout(() => folderInputRef.current?.focus(), 50) }}
              className="text-[#666] hover:text-[#a78bfa] text-lg leading-none transition-colors"
            >+</button>
          </div>

          <AnimatePresence>
            {creatingFolder && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-b border-[#1a1a1a]">
                <div className="px-4 pb-3">
                  <input
                    ref={folderInputRef}
                    value={newFolderName}
                    onChange={e => setNewFolderName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleCreateFolder(); if (e.key === 'Escape') setCreatingFolder(false) }}
                    placeholder="Folder name…"
                    className="w-full bg-[#111] border border-[#2a2a2a] text-white text-xs px-2 py-1.5 mb-2 outline-none focus:border-[#7c3aed] placeholder-[#444]"
                  />
                  <div className="flex gap-1 mb-2">
                    {FOLDER_COLORS.map(c => (
                      <button key={c} onClick={() => setNewFolderColor(c)}
                        className={`w-4 h-4 flex-shrink-0 transition-transform ${newFolderColor === c ? 'scale-125 ring-1 ring-white/50' : ''}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={handleCreateFolder} className="flex-1 py-1 text-[10px] bg-[#7c3aed] text-white hover:bg-[#6d28d9] transition-colors">Create</button>
                    <button onClick={() => setCreatingFolder(false)} className="flex-1 py-1 text-[10px] border border-[#2a2a2a] text-[#666] hover:text-white transition-colors">Cancel</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setSelectedFolder(null)}
            className={`flex items-center justify-between px-4 py-2 text-xs transition-colors ${selectedFolder === null ? 'bg-[#111] text-white border-r-2 border-[#7c3aed]' : 'text-[#777] hover:text-white hover:bg-[#0f0f0f]'}`}
          >
            <span>All Notes</span>
            <span className={`text-[10px] ${selectedFolder === null ? 'text-[#7c3aed]' : 'text-[#444]'}`}>{topics.length}</span>
          </button>

          <button
            onClick={() => setSelectedFolder('unfoldered')}
            className={`flex items-center justify-between px-4 py-2 text-xs transition-colors ${selectedFolder === 'unfoldered' ? 'bg-[#111] text-white border-r-2 border-[#7c3aed]' : 'text-[#777] hover:text-white hover:bg-[#0f0f0f]'}`}
          >
            <span>Unfoldered</span>
            <span className={`text-[10px] ${selectedFolder === 'unfoldered' ? 'text-[#7c3aed]' : 'text-[#444]'}`}>{unFolderedCount}</span>
          </button>

          <div className="w-full h-px bg-[#1a1a1a] my-1" />

          {folders.map(folder => (
            <div key={folder._id} className="group relative">
              {renamingFolder === folder._id ? (
                <div className="px-4 py-2 flex items-center gap-1">
                  <div className="w-2 h-2 flex-shrink-0" style={{ backgroundColor: folder.color }} />
                  <input
                    autoFocus
                    value={renameValue}
                    onChange={e => setRenameValue(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleRenameFolder(folder._id); if (e.key === 'Escape') setRenamingFolder(null) }}
                    onBlur={() => handleRenameFolder(folder._id)}
                    className="flex-1 bg-transparent border-b border-[#7c3aed] text-white text-xs outline-none pb-0.5"
                  />
                </div>
              ) : (
                <button
                  onClick={() => setSelectedFolder(folder._id)}
                  onDoubleClick={() => { setRenamingFolder(folder._id); setRenameValue(folder.name) }}
                  className={`w-full flex items-center justify-between px-4 py-2 text-xs transition-colors ${selectedFolder === folder._id ? 'bg-[#111] text-white border-r-2' : 'text-[#777] hover:text-white hover:bg-[#0f0f0f]'}`}
                  style={selectedFolder === folder._id ? { borderRightColor: folder.color } : {}}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-2 h-2 flex-shrink-0" style={{ backgroundColor: folder.color }} />
                    <span className="truncate">{folder.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] ${selectedFolder === folder._id ? 'text-[#a78bfa]' : 'text-[#444]'}`}>{notesInFolder(folder._id)}</span>
                    <button onClick={(e) => handleDeleteFolder(e, folder._id)} className="opacity-0 group-hover:opacity-100 text-[#555] hover:text-red-400 transition-all text-xs">✕</button>
                  </div>
                </button>
              )}
            </div>
          ))}
        </aside>

        {/* Middle: Notes list */}
        <div className="w-72 flex-shrink-0 border-r border-[#1a1a1a] flex flex-col bg-[#0a0a0a] overflow-hidden">
          <div className="px-4 pt-4 pb-3 border-b border-[#1a1a1a]">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search notes…"
              className="w-full bg-[#111] border border-[#222] text-white text-xs px-3 py-2 outline-none focus:border-[#7c3aed] placeholder-[#444] transition-colors"
            />
          </div>

          <div className="px-4 py-2 flex items-center justify-between border-b border-[#111]">
            <span className="text-[#444] text-[10px] uppercase tracking-widest">{filteredTopics.length} notes</span>
            {selectedFolder && selectedFolder !== 'unfoldered' && (
              <div className="w-2 h-2" style={{ backgroundColor: folders.find(f => f._id === selectedFolder)?.color }} />
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredTopics.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-[#333] text-xs">
                <div className="w-8 h-px bg-[#1a1a1a] mb-3" />
                <p>No notes found</p>
              </div>
            ) : (
              filteredTopics.map(note => (
                <div
                  key={note._id}
                  onClick={() => openNoteById(note._id)}
                  className={`group relative border-b border-[#111] px-4 py-3 cursor-pointer transition-colors ${activeNoteId === note._id ? 'bg-[#111] border-r-2 border-r-[#7c3aed]' : 'hover:bg-[#0f0f0f]'}`}
                >
                  {note.folder && (
                    <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ backgroundColor: note.folder.color }} />
                  )}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-medium truncate ${activeNoteId === note._id ? 'text-white' : 'text-[#ccc]'}`}>{note.topic}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {note.examType && <span className="text-[#555] text-[10px]">{note.examType}</span>}
                        {note.folder && <span className="text-[10px]" style={{ color: note.folder.color }}>{note.folder.name}</span>}
                      </div>
                      <p className="text-[#383838] text-[10px] mt-1">
                        {new Date(note.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="relative">
                        <button
                          onClick={e => { e.stopPropagation(); setMovingNoteId(movingNoteId === note._id ? null : note._id) }}
                          className="text-[#555] hover:text-[#a78bfa] text-xs transition-colors px-1"
                          title="Move to folder"
                        >⊞</button>
                        {movingNoteId === note._id && (
                          <div className="absolute right-0 top-5 z-30 bg-[#111] border border-[#222] min-w-[140px]">
                            <button onClick={e => { e.stopPropagation(); handleMoveNote(note._id, null) }}
                              className="block w-full text-left px-3 py-1.5 text-[11px] text-[#888] hover:bg-[#1a1a1a] hover:text-white transition-colors">
                              Remove from folder
                            </button>
                            {folders.map(f => (
                              <button key={f._id} onClick={e => { e.stopPropagation(); handleMoveNote(note._id, f._id) }}
                                className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-[11px] text-[#888] hover:bg-[#1a1a1a] hover:text-white transition-colors">
                                <div className="w-2 h-2 flex-shrink-0" style={{ backgroundColor: f.color }} />
                                {f.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <button onClick={e => handleDelete(e, note._id)} disabled={deleting === note._id}
                        className="text-[#555] hover:text-red-400 text-xs transition-colors">
                        {deleting === note._id ? '…' : '✕'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Note detail */}
        <div className="flex-1 overflow-y-auto bg-[#0a0a0a]">
          {loadingNote ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3">
                <div className="w-5 h-5 border border-[#7c3aed] border-t-transparent animate-spin" />
                <p className="text-[#555] text-xs">Loading note…</p>
              </div>
            </div>
          ) : selectedNote ? (
            <div className="p-8 max-w-4xl">
              <FinalResult result={selectedNote} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-[#2a2a2a]">
              <div className="w-12 h-px bg-[#1a1a1a] mb-4" />
              <p className="text-sm">Select a note to view</p>
              <button onClick={() => navigate('/graph')} className="mt-4 px-4 py-2 text-xs border border-[#1f1f1f] text-[#555] hover:border-[#7c3aed] hover:text-[#a78bfa] transition-colors">
                Open Graph View
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default History
