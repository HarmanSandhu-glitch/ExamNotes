import React, { useEffect, useState } from 'react'
import { motion } from "motion/react"
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getUserStats } from '../services/api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function StatCard({ value, label, accent = "bg-[#7c3aed]" }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className='p-6 border border-[#1a1a1a] hover:border-[#2a2a2a] transition-colors'
    >
      <div className={`w-6 h-px rounded-full mb-5 ${accent}`} />
      <div className='text-3xl font-bold text-white mb-1 tabular-nums'>{value}</div>
      <p className='text-sm text-[#555]'>{label}</p>
    </motion.div>
  )
}

function Dashboard() {
  const navigate = useNavigate()
  const { userData } = useSelector((state) => state.user)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUserStats()
      .then(data => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const memberSince = stats?.memberSince
    ? new Date(stats.memberSince).toLocaleDateString("en-IN", { year: "numeric", month: "long" })
    : "—"

  return (
    <div className='min-h-screen bg-[#0a0a0a] text-white overflow-hidden'>

      <Navbar />

      <div className='relative z-10 max-w-5xl mx-auto px-8 pt-16 pb-24'>
        {/* Heading */}
        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className='mb-12'>
          <p className='text-xs font-semibold tracking-[0.2em] uppercase text-[#7c3aed] mb-3'>Dashboard</p>
          <h1 className='text-4xl font-bold tracking-tight text-white'>
            Welcome back, {userData?.name?.split(" ")[0]}
          </h1>
          <p className='text-[#555] mt-2 text-sm'>Here's an overview of your study activity.</p>
        </motion.div>

        {/* Stats */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className='p-6 bg-[#0f0f0f] border border-[#1a1a1a] animate-pulse h-36' />
            ))}
          </div>
        ) : (
          <div className='grid grid-cols-2 md:grid-cols-4 gap-5 mb-12'>
            <StatCard value={stats?.totalNotes ?? 0} label="Notes Generated" accent="bg-[#7c3aed]" />
            <StatCard value={stats?.credits ?? 0} label="Credits Remaining" accent="bg-yellow-500" />
            <StatCard value={memberSince} label="Member Since" accent="bg-white" />
            <StatCard
              value={stats?.totalNotes > 0 ? `${Math.min(100, stats.totalNotes * 5)}%` : "0%"}
              label="Study Progress"
              accent="bg-[#a78bfa]"
            />
          </div>
        )}

        {/* Quick actions */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className='text-xs font-semibold text-[#444] uppercase tracking-widest mb-5'>Quick Actions</h2>
          <div className='grid grid-cols-1 sm:grid-cols-4 gap-4'>
            <ActionCard
              title="Generate Notes"
              desc="Create AI-powered notes for any topic"
              onClick={() => navigate("/notes")}
            />
            <ActionCard
              title="Note History"
              desc="Browse and organize all your past notes"
              onClick={() => navigate("/history")}
            />
            <ActionCard
              title="Graph View"
              desc="Visualize note connections like Obsidian"
              onClick={() => navigate("/graph")}
            />
            <ActionCard
              title="Buy Credits"
              desc="Top up credits to generate more notes"
              onClick={() => navigate("/pricing")}
            />
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}

function ActionCard({ title, desc, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className='text-left p-5 border border-[#1a1a1a] hover:border-[#7c3aed]/50 hover:bg-[#111] transition-colors'
    >
      <p className='font-semibold text-white text-sm mb-1'>{title}</p>
      <p className='text-xs text-[#555]'>{desc}</p>
    </motion.button>
  )
}

export default Dashboard
