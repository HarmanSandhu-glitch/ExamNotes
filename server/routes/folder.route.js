import express from "express"
import isAuth from "../middleware/isAuth.js"
import { getFolders, createFolder, updateFolder, deleteFolder, moveNoteToFolder } from "../controllers/folder.controller.js"

const folderRouter = express.Router()

folderRouter.get("/", isAuth, getFolders)
folderRouter.post("/", isAuth, createFolder)
folderRouter.put("/:id", isAuth, updateFolder)
folderRouter.delete("/:id", isAuth, deleteFolder)
folderRouter.put("/move/:noteId", isAuth, moveNoteToFolder)

export default folderRouter
