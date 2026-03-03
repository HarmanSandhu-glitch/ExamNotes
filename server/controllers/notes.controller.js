import Notes from "../models/notes.model.js"


export const getMyNotes = async (req, res) => {
    try {
        const query = { user: req.userId }
        if (req.query.folder) query.folder = req.query.folder === "null" ? null : req.query.folder
        const notes = await Notes.find(query).select("topic classLevel examType revisionMode includeDiagram includeChart folder createdAt").populate("folder", "name color").sort({ createdAt: -1 })
        if (!notes) {
            return res.status(404).json({
                error: "Notes not found"
            });
        }

        return res.status(200).json(notes)
    } catch (error) {
        return res.status(500).json({ message: `getCurrentUser notes error  ${error}` })
    }
}

export const getSingleNotes = async (req, res) => {
    try {
        const notes = await Notes.findOne({
            _id: req.params.id,
            user: req.userId
        })
        if (!notes) {
            return res.status(404).json({
                error: "Notes not found"
            });
        }
        return res.json({
      content: notes.content,
      topic: notes.topic,
      createdAt: notes.createdAt
    });
    } catch (error) {
 return res.status(500).json({ message: `getSingle notes error  ${error}` })
    }
}

export const deleteNote = async (req, res) => {
    try {
        const deleted = await Notes.findOneAndDelete({ _id: req.params.id, user: req.userId })
        if (!deleted) return res.status(404).json({ message: "Note not found" })
        return res.status(200).json({ message: "Note deleted" })
    } catch (error) {
        return res.status(500).json({ message: `deleteNote error ${error}` })
    }
}

export const getGraphData = async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.userId })
            .select("topic examType folder createdAt")
            .populate("folder", "name color")
            .sort({ createdAt: -1 })

        const nodes = notes.map(n => ({
            id: n._id.toString(),
            label: n.topic,
            examType: n.examType || "General",
            folder: n.folder ? { id: n.folder._id.toString(), name: n.folder.name, color: n.folder.color } : null
        }))

        const links = []
        const seen = new Set()

        for (let i = 0; i < notes.length; i++) {
            for (let j = i + 1; j < notes.length; j++) {
                const a = notes[i]
                const b = notes[j]
                const key = [a._id, b._id].sort().join("-")
                if (seen.has(key)) continue

                const sameFolder = a.folder && b.folder && a.folder._id.toString() === b.folder._id.toString()
                const sameExamType = a.examType && b.examType && a.examType === b.examType

                if (sameFolder || sameExamType) {
                    seen.add(key)
                    links.push({
                        source: a._id.toString(),
                        target: b._id.toString(),
                        reason: sameFolder ? "folder" : "examType"
                    })
                }
            }
        }

        return res.status(200).json({ nodes, links })
    } catch (error) {
        return res.status(500).json({ message: `getGraphData error ${error}` })
    }
}