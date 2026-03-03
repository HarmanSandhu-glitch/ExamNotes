import React, { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from "motion/react"
import logo from "../assets/logo.png"
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'
import { setUserData } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'

function Navbar() {
    const { userData } = useSelector((state) => state.user)
    const credits = userData?.credits
    const [showProfile, setShowProfile] = useState(false)
    const profileRef = useRef()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        const handler = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

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
        <nav className='relative z-20 flex items-center justify-between px-6 py-3 border-b border-[#1a1a1a] bg-[#0a0a0a]'
            style={{ fontFamily: 'Inter, sans-serif' }}>

            {/* Logo */}
            <div className='flex items-center gap-3 cursor-pointer' onClick={() => navigate("/")}>
                <img src={logo} alt="examnotes" className='w-7 h-7' style={{ borderRadius: 0 }} />
                <span className='text-sm font-semibold text-white tracking-tight'>
                    ExamNotes <span className='text-[#7c3aed]'>AI</span>
                </span>
            </div>

            {/* Center links */}
            <div className='hidden md:flex items-center gap-1'>
                {[
                    { label: 'Dashboard', path: '/dashboard' },
                    { label: 'Notes', path: '/notes' },
                    { label: 'History', path: '/history' },
                    { label: 'Graph', path: '/graph' },
                    { label: 'Pricing', path: '/pricing' },
                ].map(item => (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className='px-3 py-1.5 text-xs text-[#777] hover:text-white hover:bg-[#111] transition-colors'
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {/* Right */}
            <div className='flex items-center gap-2'>
                {/* Credits chip */}
                <button
                    onClick={() => navigate("/pricing")}
                    className='flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[#1f1f1f] text-[#888] hover:border-[#7c3aed] hover:text-[#a78bfa] transition-colors'
                >
                    <span className='text-[#7c3aed]'>◆</span>
                    <span className='tabular-nums'>{credits}</span>
                </button>

                {/* Profile */}
                <div className='relative' ref={profileRef}>
                    <button
                        onClick={() => setShowProfile(!showProfile)}
                        className='w-7 h-7 flex items-center justify-center bg-[#7c3aed] text-white text-xs font-semibold hover:bg-[#6d28d9] transition-colors'
                        style={{ borderRadius: 0 }}
                    >
                        {userData?.name?.slice(0, 1).toUpperCase()}
                    </button>

                    <AnimatePresence>
                        {showProfile && (
                            <motion.div
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                transition={{ duration: 0.12 }}
                                className='absolute right-0 mt-1 w-44 bg-[#0f0f0f] border border-[#1f1f1f] overflow-hidden z-50'
                            >
                                <div className='px-4 py-3 border-b border-[#1a1a1a]'>
                                    <p className='text-xs text-white font-medium truncate'>{userData?.name}</p>
                                    <p className='text-[10px] text-[#555] mt-0.5 truncate'>{userData?.email}</p>
                                </div>
                                <NavItem text="Dashboard" onClick={() => { setShowProfile(false); navigate("/dashboard") }} />
                                <NavItem text="Profile" onClick={() => { setShowProfile(false); navigate("/profile") }} />
                                <NavItem text="Graph View" onClick={() => { setShowProfile(false); navigate("/graph") }} />
                                <div className='h-px bg-[#1a1a1a]' />
                                <NavItem text="Sign Out" red onClick={handleSignOut} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </nav>
    )
}

function NavItem({ onClick, text, red }) {
    return (
        <button
            onClick={onClick}
            className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${
                red ? "text-red-400 hover:bg-red-500/10" : "text-[#888] hover:text-white hover:bg-[#111]"
            }`}
        >
            {text}
        </button>
    )
}

export default Navbar
