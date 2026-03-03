import express from "express"
import isAuth from "../middleware/isAuth.js"
import { getCurrentUser, updateProfile, getUserStats } from "../controllers/user.controller.js"


const userRouter = express.Router()

userRouter.get("/currentuser",isAuth,getCurrentUser)
userRouter.put("/profile",isAuth,updateProfile)
userRouter.get("/stats",isAuth,getUserStats)

export default userRouter