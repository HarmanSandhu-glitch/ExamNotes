import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from "motion/react"
import axios from 'axios'
import { serverUrl } from '../App'

function Pricing() {
  const navigate = useNavigate()
  const [selectedPrice, setSelectedPrice] = useState(null)
  const [paying, setPaying] = useState(false)
  const [payingAmount, setPayingAmount] = useState(null)

  const handlePaying = async (amount) => {
    try {
      setPayingAmount(amount)
      setPaying(true)
      const result = await axios.post(serverUrl + "/api/credit/order", { amount }, { withCredentials: true })
      if (result.data.url) window.location.href = result.data.url
      setPaying(false)
    } catch (error) {
      setPaying(false)
      console.log(error)
    }
  }

  return (
    <div className='min-h-screen bg-[#05050f] text-white px-6 py-10 relative'>

      {/* Ambient */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-violet-700/15 blur-[130px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-purple-700/10 blur-[120px]" />
      </div>

      <div className='relative z-10 max-w-5xl mx-auto'>
        <button
          onClick={() => navigate("/")}
          className='flex items-center gap-2 text-gray-400 hover:text-white mb-8 text-sm transition'
        >
          ← Back to Home
        </button>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className='text-xs font-semibold tracking-[0.2em] uppercase text-violet-400 mb-4'>Simple Pricing</p>
          <h1 className="text-4xl font-bold tracking-tight">Buy Credits</h1>
          <p className="text-gray-400 mt-3 text-lg">
            Choose a plan that fits your study needs
          </p>
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <PricingCard
            title="Starter" price="₹100" amount={100} credits="50 Credits"
            description="Perfect for quick revisions"
            features={["Generate AI notes", "Exam-focused answers", "Diagram & charts support", "Fast generation"]}
            selectedPrice={selectedPrice} setSelectedPrice={setSelectedPrice}
            onBuy={handlePaying} paying={paying} payingAmount={payingAmount}
          />
          <PricingCard
            popular title="Popular" price="₹200" amount={200} credits="120 Credits"
            description="Best value for students"
            features={["All Starter features", "More credits per ₹", "Revision mode access", "Priority AI response"]}
            selectedPrice={selectedPrice} setSelectedPrice={setSelectedPrice}
            onBuy={handlePaying} paying={paying} payingAmount={payingAmount}
          />
          <PricingCard
            title="Pro Learner" price="₹500" amount={500} credits="300 Credits"
            description="For serious exam preparation"
            features={["Maximum credit value", "Unlimited revisions", "Charts & diagrams", "Ideal for full syllabus"]}
            selectedPrice={selectedPrice} setSelectedPrice={setSelectedPrice}
            onBuy={handlePaying} paying={paying} payingAmount={payingAmount}
          />
        </div>
      </div>
    </div>
  )
}

function PricingCard({ title, price, amount, credits, description, features, popular, selectedPrice, setSelectedPrice, onBuy, paying, payingAmount }) {
  const isSelected = selectedPrice === amount
  const isPayingThisCard = paying && payingAmount === amount
  return (
    <motion.div
      onClick={() => setSelectedPrice(amount)}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={`relative cursor-pointer rounded-2xl p-6 border transition-all ${
        isSelected
          ? "bg-violet-600/10 border-violet-500/50 shadow-[0_0_30px_rgba(139,92,246,0.2)]"
          : popular
          ? "bg-white/[0.05] border-violet-500/30"
          : "bg-white/[0.04] border-white/[0.08] hover:border-white/20"
      }`}
    >
      {popular && !isSelected && (
        <span className='absolute top-4 right-4 text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium'>Popular</span>
      )}
      {isSelected && (
        <span className='absolute top-4 right-4 text-xs px-2.5 py-1 rounded-full bg-violet-600 text-white font-medium'>Selected</span>
      )}

      <h2 className='text-xl font-semibold text-white'>{title}</h2>
      <p className='text-sm text-gray-400 mt-1'>{description}</p>

      <div className='mt-5 mb-5'>
        <p className="text-4xl font-extrabold text-white">{price}</p>
        <p className="text-sm text-violet-400 mt-1 font-medium">{credits}</p>
      </div>

      <button
        disabled={isPayingThisCard}
        onClick={(e) => { e.stopPropagation(); onBuy(amount) }}
        className={`w-full py-2.5 rounded-xl font-semibold transition-all ${
          isPayingThisCard
            ? "bg-white/10 text-gray-500 cursor-not-allowed"
            : isSelected
            ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.35)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
            : "bg-white/[0.07] text-white hover:bg-white/[0.12]"
        }`}
      >
        {isPayingThisCard ? "Redirecting…" : "Buy Now"}
      </button>

      <ul className='mt-5 space-y-2.5 text-sm text-gray-400'>
        {features.map((f, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-violet-400">✓</span>
            {f}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

export default Pricing
