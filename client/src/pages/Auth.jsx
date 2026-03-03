import React, { useState } from 'react'
import { motion, AnimatePresence } from "motion/react"
import axios from "axios"
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function Auth() {
  const dispatch = useDispatch()
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register"
      const payload = isLogin ? { email, password } : { name, email, password }
      const result = await axios.post(serverUrl + endpoint, payload, { withCredentials: true })
      dispatch(setUserData(result.data))
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-[#05050f] text-white flex overflow-hidden'>

      {/* Ambient glow blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-purple-700/15 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-[100px]" />
      </div>

      {/* LEFT — Branding */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className='hidden lg:flex flex-col justify-between w-1/2 px-16 py-14 relative z-10'
      >
        <div>
          <div className='flex items-center gap-3 mb-16'>
            <div className='w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-[0_0_20px_rgba(139,92,246,0.5)]'>E</div>
            <span className='text-xl font-semibold tracking-tight'>ExamNotes <span className='text-violet-400'>AI</span></span>
          </div>

          <h1 className='text-4xl font-bold leading-tight mb-4 text-white'>
            Smart notes,<br />powered by AI
          </h1>
          <p className='text-gray-500 text-base leading-relaxed max-w-md'>
            Generate exam-focused notes, revision material, diagrams,
            and printable PDFs — instantly.
          </p>

          <ul className='mt-10 space-y-3.5'>
            {["50 free credits on signup", "Exam-focused AI notes instantly", "Auto-generated diagrams & charts", "Download clean PDFs"].map(item => (
              <li key={item} className='flex items-center gap-3 text-sm text-gray-400'>
                <span className='w-1 h-1 rounded-full bg-violet-400 shrink-0' />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className='text-xs text-gray-600'>© {new Date().getFullYear()} ExamNotes AI · All rights reserved</p>
      </motion.div>

      {/* RIGHT — Auth Form */}
      <div className='w-full lg:w-1/2 flex items-center justify-center px-6 py-12 relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='w-full max-w-md'
        >
          {/* Mobile logo */}
          <div className='flex lg:hidden items-center gap-3 mb-10 justify-center'>
            <div className='w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-[0_0_20px_rgba(139,92,246,0.5)]'>E</div>
            <span className='text-xl font-semibold tracking-tight'>ExamNotes <span className='text-violet-400'>AI</span></span>
          </div>

          {/* Tabs */}
          <div className='flex gap-6 mb-8 border-b border-white/[0.08]'>
            {["Sign In", "Sign Up"].map((tab, i) => (
              <button
                key={tab}
                onClick={() => { setIsLogin(i === 0); setError("") }}
                className={`pb-3 text-sm font-medium transition-all duration-150 border-b-2 -mb-px ${
                  isLogin === (i === 0)
                    ? 'border-violet-500 text-white'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className='block text-sm text-gray-400 mb-1.5'>Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required={!isLogin}
                    className='w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition'
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className='block text-sm text-gray-400 mb-1.5'>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className='w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition'
              />
            </div>

            <div>
              <label className='block text-sm text-gray-400 mb-1.5'>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className='w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition'
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className='text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5'
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-sm text-white transition-colors ${
                loading
                  ? 'bg-violet-600/40 cursor-not-allowed'
                  : 'bg-violet-600 hover:bg-violet-500'
              }`}
            >
              {loading ? "Please wait…" : isLogin ? "Sign In" : "Create Account"}
            </motion.button>
          </form>

          <p className='text-center text-xs text-gray-500 mt-6'>
            {isLogin ? "New here? " : "Already have an account? "}
            <button onClick={() => { setIsLogin(!isLogin); setError("") }} className='text-violet-400 hover:text-violet-300 transition'>
              {isLogin ? "Create an account" : "Sign in"}
            </button>
          </p>

          <p className='text-center text-xs text-gray-600 mt-4'>
            Start with <span className='text-violet-400 font-medium'>50 free credits</span> — no card required
          </p>
        </motion.div>
      </div>

    </div>
  )
}

export default Auth
