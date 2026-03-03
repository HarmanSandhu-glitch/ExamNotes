import React from 'react'
import Navbar from '../components/Navbar'
import { motion } from "motion/react"
import img from "../assets/img1.png"
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()
  return (
    <div className='min-h-screen bg-[#05050f] text-white overflow-hidden'>

      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-violet-700/15 blur-[130px]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-purple-700/10 blur-[120px]" />
      </div>

      <Navbar />

      {/* Hero */}
      <section className='relative z-10 max-w-7xl mx-auto px-8 pt-28 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className='text-xs font-semibold tracking-[0.2em] uppercase text-violet-400 mb-5'>AI-Powered Exam Notes</p>
          <h1 className="text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight">
            Create smart<br />
            <span className='bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent'>AI notes</span> instantly
          </h1>
          <p className='mt-6 max-w-xl text-lg text-gray-400 leading-relaxed'>
            Generate exam-focused notes, project documentation,
            flow diagrams and revision-ready content using AI —
            faster, cleaner and smarter.
          </p>
          <div className='flex items-center gap-4 mt-10 flex-wrap'>
            <motion.button
              onClick={() => navigate("/notes")}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className='px-8 py-3.5 rounded-xl font-semibold bg-violet-600 text-white hover:bg-violet-500 transition-colors'
            >
              Get Started →
            </motion.button>
            <button onClick={() => navigate("/pricing")} className='px-8 py-3.5 rounded-xl font-medium text-gray-400 border border-white/[0.12] hover:border-white/25 hover:text-white transition-colors'>
              View Pricing
            </button>
          </div>
          <p className='mt-5 text-xs text-gray-500'>50 free credits · No card required · Instant access</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          whileHover={{ y: -8, scale: 1.02 }}
          className="relative transform-gpu"
        >
          <div className='absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-600/20 to-purple-600/10 blur-xl' />
          <div className='relative rounded-3xl overflow-hidden border border-white/[0.08] shadow-[0_40px_100px_rgba(0,0,0,0.6)]'>
            <img src={img} alt="preview" className='w-full' />
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className='relative z-10 max-w-6xl mx-auto px-8 py-20 grid grid-cols-1 md:grid-cols-4 gap-5'>
        {[
          { title: "Exam Notes", des: "High-yield exam-oriented notes with revision points." },
          { title: "Project Notes", des: "Well-structured content for assignments and projects." },
          { title: "Diagrams", des: "Auto-generated visual diagrams for clarity." },
          { title: "PDF Download", des: "Download clean, printable PDFs instantly." },
        ].map((f) => (
          <Feature key={f.title} {...f} />
        ))}
      </section>

      <Footer />
    </div>
  )
}

function Feature({ title, des }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className='relative rounded-2xl p-6
        border border-white/[0.07]
        hover:border-violet-500/20
        hover:bg-white/[0.03]
        transition-colors group'
    >
      <div className='w-5 h-px bg-violet-500 mb-5 group-hover:w-8 transition-all duration-300 rounded-full' />
      <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-500 text-xs leading-relaxed">{des}</p>
    </motion.div>
  )
}

export default Home
