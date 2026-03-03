import React, { useState } from 'react'
import { motion, AnimatePresence } from "motion/react"
import ReactMarkdown from 'react-markdown'
import MermaidSetup from './MermaidSetup';
import RechartSetUp from './RechartSetUp';
import { downloadPdf } from '../services/api';

const markDownComponent = {
    h1: ({ children }) => (
        <h1 className="text-2xl font-bold text-violet-400 mt-6 mb-4 border-b border-white/[0.08] pb-2">
            {children}
        </h1>
    ),
    h2: ({ children }) => (
        <h2 className="text-xl font-semibold text-violet-300 mt-5 mb-3">
            {children}
        </h2>
    ),
    h3: ({ children }) => (
        <h3 className="text-lg font-semibold text-gray-200 mt-4 mb-2">
            {children}
        </h3>
    ),
    p: ({ children }) => (
        <p className="text-gray-300 leading-relaxed mb-3">
            {children}
        </p>
    ),
    ul: ({ children }) => (
        <ul className="list-disc ml-6 space-y-1 text-gray-300">
            {children}
        </ul>
    ),
    li: ({ children }) => (
        <li className="marker:text-violet-400">{children}</li>
    ),
    code: ({ children }) => (
        <code className="bg-white/[0.08] text-violet-300 px-1.5 py-0.5 rounded text-sm font-mono">
            {children}
        </code>
    ),
}

function FlashcardMode({ points, onClose }) {
    const [index, setIndex] = useState(0)
    const [revealed, setRevealed] = useState(false)
    const [known, setKnown] = useState([])
    const [review, setReview] = useState([])

    const total = points.length
    const done = known.length + review.length

    if (done === total) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center gap-6"
            >
                <div className="w-5 h-px bg-green-400/60 rounded-full mb-2" />
                <h3 className="text-2xl font-bold text-white">Session Complete!</h3>
                <div className="flex gap-8">
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-bold text-green-400">{known.length}</span>
                        <span className="text-sm text-gray-400 mt-1">Got it</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-bold text-orange-400">{review.length}</span>
                        <span className="text-sm text-gray-400 mt-1">Need review</span>
                    </div>
                </div>
                <button
                    onClick={() => { setIndex(0); setRevealed(false); setKnown([]); setReview([]) }}
                    className="px-6 py-2.5 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-700 transition"
                >
                    Restart Flashcards
                </button>
                <button onClick={onClose} className="text-sm text-gray-400 hover:text-white transition">
                    Exit Flashcard Mode
                </button>
            </motion.div>
        )
    }

    const card = points[index]

    const handleKnow = () => {
        setKnown(prev => [...prev, card])
        setRevealed(false)
        if (index + 1 < total) setIndex(i => i + 1)
    }

    const handleReview = () => {
        setReview(prev => [...prev, card])
        setRevealed(false)
        if (index + 1 < total) setIndex(i => i + 1)
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${(done / total) * 100}%` }}
                    />
                </div>
                <span className="text-xs text-gray-400 shrink-0">{done}/{total}</span>
            </div>
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="min-h-[220px] rounded-2xl bg-white/[0.04] border border-white/[0.08] p-8 flex flex-col items-center justify-center gap-6 text-center"
                >
                    <p className="text-gray-200 text-lg leading-relaxed">{card}</p>
                    {!revealed && (
                        <button
                            onClick={() => setRevealed(true)}
                            className="px-5 py-2 rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-300 text-sm font-medium hover:bg-violet-500/25 transition"
                        >
                            Mark as reviewed ✓
                        </button>
                    )}
                    {revealed && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                            <button onClick={handleKnow} className="px-5 py-2 rounded-xl bg-green-500/15 border border-green-500/30 text-green-300 text-sm font-medium hover:bg-green-500/25 transition">
                                ✓ Got it
                            </button>
                            <button onClick={handleReview} className="px-5 py-2 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-300 text-sm font-medium hover:bg-orange-500/25 transition">
                                ↺ Review again
                            </button>
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>
            <button onClick={onClose} className="text-xs text-center text-gray-500 hover:text-gray-300 transition">
                Exit Flashcard Mode
            </button>
        </div>
    )
}

function FinalResult({ result }) {
    const [quickRevision, setQuickRevision] = useState(false)
    const [flashcardMode, setFlashcardMode] = useState(false)

    if (
        !result ||
        !result.subTopics ||
        !result.questions ||
        !result.questions.short ||
        !result.questions.long ||
        !result.revisionPoints
    ) {
        return null;
    }

    if (flashcardMode) {
        return (
            <div className='mt-6 rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6'>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Flashcard Mode</h2>
                    <button onClick={() => setFlashcardMode(false)} className="text-sm text-gray-400 hover:text-white transition">✕ Close</button>
                </div>
                <FlashcardMode points={result.revisionPoints} onClose={() => setFlashcardMode(false)} />
            </div>
        )
    }

    return (
        <div className='mt-6 space-y-6'>
            {/* Action bar */}
            <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4
                rounded-2xl bg-white/[0.04] border border-white/[0.08] px-6 py-4'>
                <h2 className='text-xl font-semibold text-white'>
                    Generated Notes
                </h2>
                <div className='flex gap-3 flex-wrap'>
                    <button
                        onClick={() => setFlashcardMode(true)}
                        className='px-4 py-2 rounded-xl text-sm font-medium bg-violet-500/15 border border-violet-500/30 text-violet-300 hover:bg-violet-500/25 transition'
                    >Flashcards</button>
                    <button
                        onClick={() => setQuickRevision(!quickRevision)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition
                            ${quickRevision
                                ? "bg-green-500/20 border border-green-500/30 text-green-300"
                                : "bg-white/[0.06] border border-white/[0.1] text-gray-300 hover:bg-white/10"}`}
                    >{quickRevision ? "In Revision Mode" : "Quick Revision"}</button>
                    <button
                        onClick={() => downloadPdf(result)}
                        className='px-4 py-2 rounded-xl text-sm font-medium bg-violet-600 text-white hover:bg-violet-500 transition'
                    >Download PDF</button>
                </div>
            </div>

            {/* Quick revision points */}
            {quickRevision && (
                <motion.section
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='rounded-2xl bg-green-500/[0.08] border border-green-500/20 p-6'
                >
                    <h3 className='font-bold text-green-400 mb-4 text-base'>Exam Quick Revision Points</h3>
                    <ul className='space-y-2'>
                        {result.revisionPoints.map((p, i) => (
                            <li key={i} className='flex items-start gap-2 text-gray-300 text-sm'>
                                <span className='text-green-400 mt-0.5 shrink-0'>✓</span>
                                {p}
                            </li>
                        ))}
                    </ul>
                </motion.section>
            )}

            {/* Sub topics */}
            {!quickRevision && (
                <section>
                    <SectionHeader title="Sub Topics" color="violet" />
                    <div className='grid sm:grid-cols-2 gap-3'>
                        {Object.entries(result.subTopics).map(([star, topics]) => (
                            <div key={star} className='rounded-xl bg-white/[0.04] border border-white/[0.08] p-4'>
                                <p className='text-sm font-semibold text-yellow-400 mb-2'>{star} Priority</p>
                                <ul className='list-disc ml-4 text-sm text-gray-300 space-y-1'>
                                    {topics.map((t, i) => <li key={i}>{t}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Detailed notes */}
            {!quickRevision && (
                <section>
                    <SectionHeader title="Detailed Notes" color="purple" />
                    <div className='rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6'>
                        <ReactMarkdown components={markDownComponent}>{result.notes}</ReactMarkdown>
                    </div>
                </section>
            )}

            {/* Diagram */}
            {result.diagram?.data && (
                <section>
                    <SectionHeader title="Diagram" color="cyan" />
                    <div className='rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6'>
                        <MermaidSetup diagram={result.diagram?.data} />
                    </div>
                    <p className="mt-2 text-xs text-gray-500 italic px-1">Save this diagram by taking a screenshot.</p>
                </section>
            )}

            {/* Charts */}
            {result.charts?.length > 0 && (
                <section>
                    <SectionHeader title="Visual Charts" color="indigo" />
                    <div className='rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6'>
                        <RechartSetUp charts={result.charts} />
                    </div>
                    <p className="mt-2 text-xs text-gray-500 italic px-1">Save this chart by taking a screenshot.</p>
                </section>
            )}

            {/* Questions */}
            <section>
                <SectionHeader title="Important Questions" color="rose" />
                <div className='grid md:grid-cols-2 gap-4'>
                    <div className='rounded-xl bg-white/[0.04] border border-white/[0.08] p-4'>
                        <p className='text-sm font-semibold text-violet-300 mb-3'>Short Questions</p>
                        <ul className='space-y-2'>
                            {result.questions.short.map((q, i) => (
                                <li key={i} className='flex items-start gap-2 text-sm text-gray-300'>
                                    <span className='text-violet-500 shrink-0 mt-0.5'>{i + 1}.</span>{q}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className='rounded-xl bg-white/[0.04] border border-white/[0.08] p-4'>
                        <p className='text-sm font-semibold text-purple-300 mb-3'>Long Questions</p>
                        <ul className='space-y-2'>
                            {result.questions.long.map((q, i) => (
                                <li key={i} className='flex items-start gap-2 text-sm text-gray-300'>
                                    <span className='text-purple-500 shrink-0 mt-0.5'>{i + 1}.</span>{q}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                {result.questions.diagram && (
                    <div className='mt-4 rounded-xl bg-white/[0.04] border border-white/[0.08] p-4'>
                        <p className='text-sm font-semibold text-cyan-300 mb-2'>Diagram Question</p>
                        <p className='text-sm text-gray-300'>{result.questions.diagram}</p>
                    </div>
                )}
            </section>
        </div>
    )
}

function SectionHeader({ title, color }) {
    const dotColors = {
        violet: "bg-violet-500",
        purple: "bg-purple-500",
        indigo: "bg-indigo-500",
        cyan: "bg-cyan-500",
        rose: "bg-rose-500",
    };
    const textColors = {
        violet: "text-violet-400",
        purple: "text-purple-400",
        indigo: "text-indigo-400",
        cyan: "text-cyan-400",
        rose: "text-rose-400",
    };
    return (
        <div className={`mb-4 flex items-center gap-2.5 font-semibold text-sm ${textColors[color] || "text-white"}`}>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[color] || "bg-white"}`} />
            <span>{title}</span>
        </div>
    )
}

export default FinalResult