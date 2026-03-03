import React, { useState } from 'react'
import { motion } from "motion/react"
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import TopicForm from '../components/TopicForm'
import Sidebar from '../components/Sidebar'
import FinalResult from '../components/FinalResult'

function Notes() {
  const navigate = useNavigate()
  const { userData } = useSelector((state) => state.user)
  const credits = userData.credits
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")

  return (
    <div className='min-h-screen bg-[#0a0a0a] text-white px-6 py-8'>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mb-8
          bg-[#0f0f0f] border border-[#1a1a1a]
          px-6 py-4
          flex md:items-center justify-between gap-4 flex-col md:flex-row"
      >
        <div onClick={() => navigate("/")} className='cursor-pointer'>
          <h1 className='text-lg font-semibold text-white'>ExamNotes <span className='text-violet-400'>AI</span></h1>
          <p className='text-xs text-gray-500 mt-0.5'>AI-powered exam-oriented notes & revision</p>
        </div>

        <div className='flex items-center gap-3 flex-wrap'>
          <button
            onClick={() => navigate("/pricing")}
            className='flex items-center gap-1.5 px-3 py-1.5
              bg-[#111] border border-[#1f1f1f] text-white text-sm hover:border-[#7c3aed] hover:text-[#a78bfa] transition'
          >
            <span className='text-violet-400 text-xs'>◆</span>
            <span className='tabular-nums'>{credits}</span>
          </button>
          <button
            onClick={() => navigate("/history")}
            className='px-4 py-2 text-sm font-medium
              bg-[#111] border border-[#1f1f1f] text-[#888] hover:border-[#7c3aed] hover:text-white transition'
          >
            Your Notes
          </button>
        </div>
      </motion.header>

      {/* Form */}
      <div className='relative z-10 mb-8'>
        <TopicForm loading={loading} setResult={setResult} setLoading={setLoading} setError={setError} />
      </div>

      {/* Status */}
      {loading && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="relative z-10 text-center text-violet-400 font-medium mb-6 text-sm"
        >
          Generating exam-focused notes…
        </motion.div>
      )}

      {error && (
        <div className="relative z-10 mb-6 text-center text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* Placeholder */}
      {!result && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 h-60 flex flex-col items-center justify-center
            border border-dashed border-[#1f1f1f] text-[#333]"
        >
          <div className='w-8 h-px bg-white/20 mb-4 rounded-full' />
          <p className="text-xs">Generated notes will appear here</p>
        </motion.div>
      )}

      {/* Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className='relative z-10 flex flex-col lg:grid lg:grid-cols-4 gap-6'
        >
          <div className='lg:col-span-1'>
            <Sidebar result={result} />
          </div>
          <div className='lg:col-span-3 bg-[#0f0f0f] border border-[#1a1a1a] p-6'>
            <FinalResult result={result} />
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Notes

