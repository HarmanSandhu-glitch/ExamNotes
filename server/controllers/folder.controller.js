import Folder from "../models/folder.model.js"
import Notes from "../models/notes.model.js"

export const getFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ user: req.userId }).sort({ createdAt: -1 })
    return res.status(200).json(folders)
  } catch (error) {
    return res.status(500).json({ message: `getFolders error ${error}` })
  }
}

export const createFolder = async (req, res) => {
  try {
    const { name, color } = req.body
    if (!name) return res.status(400).json({ message: "Folder name is required" })

    const folder = await Folder.create({ user: req.userId, name, color: color || "#7c3aed" })
    return res.status(201).json(folder)
  } catch (error) {
    return res.status(500).json({ message: `createFolder error ${error}` })
  }
}

export const updateFolder = async (req, res) => {
  try {
    const { name, color } = req.body
    const folder = await Folder.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { name, color },
      { new: true }
    )
    if (!folder) return res.status(404).json({ message: "Folder not found" })
    return res.status(200).json(folder)
  } catch (error) {
    return res.status(500).json({ message: `updateFolder error ${error}` })
  }
}

export const deleteFolder = async (req, res) => {
  try {
    const folder = await Folder.findOneAndDelete({ _id: req.params.id, user: req.userId })
    if (!folder) return res.status(404).json({ message: "Folder not found" })
    // Unassign notes from this folder
    await Notes.updateMany({ folder: req.params.id, user: req.userId }, { folder: null })
    return res.status(200).json({ message: "Folder deleted" })
  } catch (error) {
    return res.status(500).json({ message: `deleteFolder error ${error}` })
  }
}

export const moveNoteToFolder = async (req, res) => {
  try {
    const { folderId } = req.body // null to remove from folder
    const note = await Notes.findOneAndUpdate(
      { _id: req.params.noteId, user: req.userId },
      { folder: folderId || null },
      { new: true }
    )
    if (!note) return res.status(404).json({ message: "Note not found" })
    return res.status(200).json(note)
  } catch (error) {
    return res.status(500).json({ message: `moveNoteToFolder error ${error}` })
  }
}
