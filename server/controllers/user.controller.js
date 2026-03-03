import UserModel from "../models/user.model.js"
import Notes from "../models/notes.model.js"
import bcrypt from "bcryptjs"

export const getCurrentUser = async (req,res) => {
    try {
        const userId = req.userId
        const user = await UserModel.findById(userId)
        if(!user){
            return res.status(404).json({message:"Current User is not found"})
        }
        return res.status(200).json(user)
    } catch (error) {
         return res.status(500).json({message:`getCurrentUser error  ${error}`})
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { name, currentPassword, newPassword } = req.body
        const user = await UserModel.findById(req.userId)
        if (!user) return res.status(404).json({ message: "User not found" })

        if (name) user.name = name

        if (newPassword) {
            if (!currentPassword) return res.status(400).json({ message: "Current password required" })
            const match = await bcrypt.compare(currentPassword, user.password)
            if (!match) return res.status(400).json({ message: "Current password is incorrect" })
            user.password = await bcrypt.hash(newPassword, 10)
        }

        await user.save()
        const { password: _, ...safeUser } = user.toObject()
        return res.status(200).json(safeUser)
    } catch (error) {
        return res.status(500).json({ message: `updateProfile error ${error}` })
    }
}

export const getUserStats = async (req, res) => {
    try {
        const totalNotes = await Notes.countDocuments({ user: req.userId })
        const user = await UserModel.findById(req.userId).select("credits createdAt")
        return res.status(200).json({
            totalNotes,
            credits: user.credits,
            memberSince: user.createdAt
        })
    } catch (error) {
        return res.status(500).json({ message: `getUserStats error ${error}` })
    }
}