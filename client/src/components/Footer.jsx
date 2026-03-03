import React from 'react'
import { motion } from "motion/react"
import logo from "../assets/logo.png"
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'
import { setUserData } from '../redux/userSlice'

function Footer() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const handleSignOut = async () => {
        try {
            await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true })
            dispatch(setUserData(null))
            navigate("/auth")
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className='relative z-10 mx-6 mb-6 mt-16
                border-t border-white/[0.06]
                px-2 py-8'
        >
            <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
                <div className="flex items-center gap-3">
                    <img src={logo} alt="logo" className='h-6 w-6 object-contain opacity-80' />
                    <span className="text-sm text-gray-400">
                        ExamNotes <span className="text-violet-400">AI</span>
                    </span>
                </div>

                <div className='flex items-center gap-6 text-xs text-gray-500'>
                    <span onClick={() => navigate("/notes")} className='hover:text-white transition cursor-pointer'>Notes</span>
                    <span onClick={() => navigate("/history")} className='hover:text-white transition cursor-pointer'>History</span>
                    <span onClick={() => navigate("/pricing")} className='hover:text-white transition cursor-pointer'>Pricing</span>
                    <span onClick={handleSignOut} className='text-red-400/70 hover:text-red-300 transition cursor-pointer'>Sign Out</span>
                </div>

                <p className='text-xs text-gray-600'>
                    © {new Date().getFullYear()} ExamNotes AI
                </p>
            </div>
        </motion.footer>
    )
}

export default Footer
