import UserModel from "../models/user.model.js"
import { getToken } from "../utils/token.js"
import bcrypt from "bcryptjs"

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const existing = await UserModel.findOne({ email })
        if (existing) {
            return res.status(400).json({ message: "Email already registered" })
        }
        const hashed = await bcrypt.hash(password, 10)
        const user = await UserModel.create({ name, email, password: hashed })
        const token = await getToken(user._id)
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        const { password: _, ...safeUser } = user.toObject()
        return res.status(201).json(safeUser)
    } catch (error) {
        return res.status(500).json({ message: `Register Error: ${error}` })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" })
        }
        const user = await UserModel.findOne({ email })
        if (!user || !user.password) {
            return res.status(400).json({ message: "Invalid email or password" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" })
        }
        const token = await getToken(user._id)
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        const { password: _, ...safeUser } = user.toObject()
        return res.status(200).json(safeUser)
    } catch (error) {
        return res.status(500).json({ message: `Login Error: ${error}` })
    }
}

export const logOut = async (req, res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({ message: "LogOut Successfully" })
    } catch (error) {
        return res.status(500).json({ message: `Logout Error: ${error}` })
    }
}