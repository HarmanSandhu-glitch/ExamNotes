import React, { useState } from 'react'
import { motion } from "motion/react"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { updateProfile } from '../services/api'
import { setUserData } from '../redux/userSlice'

function Profile() {
  const { userData } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [name, setName] = useState(userData?.name || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (newPassword && newPassword !== confirmPassword) {
      return setError("New passwords do not match")
    }
    if (newPassword && newPassword.length < 6) {
      return setError("New password must be at least 6 characters")
    }

    setLoading(true)
    try {
      const payload = { name }
      if (newPassword) { payload.currentPassword = currentPassword; payload.newPassword = newPassword }
      const updated = await updateProfile(payload)
      dispatch(setUserData(updated))
      setSuccess("Profile updated successfully!")
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("")
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-[#05050f] text-white px-6 py-10'>
      {/* Ambient */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-violet-700/15 blur-[130px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-purple-700/10 blur-[120px]" />
      </div>

      <div className='relative z-10 max-w-xl mx-auto'>
        <button
          onClick={() => navigate("/")}
          className='flex items-center gap-2 text-gray-400 hover:text-white mb-8 text-sm transition'
        >
          ← Back to Home
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='rounded-2xl bg-white/[0.04] border border-white/[0.08] p-8'
        >
          {/* Avatar */}
          <div className='flex items-center gap-4 mb-8'>
            <div className='w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-2xl font-bold shadow-[0_0_24px_rgba(139,92,246,0.4)]'>
              {userData?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <h1 className='text-xl font-bold text-white'>{userData?.name}</h1>
              <p className='text-sm text-gray-400'>{userData?.email}</p>
            </div>
          </div>

          <h2 className='text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6'>Profile Settings</h2>

          <form onSubmit={handleSubmit} className='space-y-5'>
            {/* Name */}
            <div>
              <label className='block text-xs font-medium text-gray-400 mb-1.5'>Display Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className='w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500/60 transition'
                placeholder="Your name"
              />
            </div>

            <div className='h-px bg-white/[0.08]' />
            <p className='text-xs font-medium text-gray-400 uppercase tracking-wider'>Change Password</p>
            <p className='text-xs text-gray-500 -mt-3'>Leave blank to keep current password</p>

            {/* Current password */}
            <div>
              <label className='block text-xs font-medium text-gray-400 mb-1.5'>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className='w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500/60 transition'
                placeholder="Enter current password"
              />
            </div>

            {/* New password */}
            <div>
              <label className='block text-xs font-medium text-gray-400 mb-1.5'>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className='w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500/60 transition'
                placeholder="New password (min 6 chars)"
              />
            </div>

            {/* Confirm password */}
            <div>
              <label className='block text-xs font-medium text-gray-400 mb-1.5'>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className='w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500/60 transition'
                placeholder="Confirm new password"
              />
            </div>

            {error && (
              <div className='px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm'>
                {error}
              </div>
            )}

            {success && (
              <div className='px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm'>
                ✓ {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className='w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:opacity-90 transition disabled:opacity-50'
            >
              {loading ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default Profile
