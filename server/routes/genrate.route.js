import express from "express"
import isAuth from "../middleware/isAuth.js"
import { generateNotes } from "../controllers/generate.controller.js"
import { getMyNotes, getSingleNotes, deleteNote, getGraphData } from "../controllers/notes.controller.js"



const notesRouter = express.Router()


notesRouter.post("/generate-notes",isAuth,generateNotes)
notesRouter.get("/getnotes", isAuth,getMyNotes)
notesRouter.get("/graph", isAuth, getGraphData)
notesRouter.delete("/:id", isAuth, deleteNote)
notesRouter.get("/:id" , isAuth , getSingleNotes)

export default notesRouter