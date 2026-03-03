import React, { useEffect, useState } from 'react'
import { motion } from "motion/react"
import { generateNotes } from '../services/api';
import { useDispatch } from 'react-redux';
import { updateCredits } from '../redux/userSlice';
function TopicForm({ setResult, setLoading, loading, setError }) {
  const [topic, setTopic] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [examType, setExamType] = useState("");
  const [revisionMode, setRevisionMode] = useState(false);
  const [includeDiagram, setIncludeDiagram] = useState(false);
  const [includeChart, setIncludeChart] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const dispatch = useDispatch()

  const handleSubmit = async () => {
    if (!topic.trim()) {
      setError("Please enter the topic")
      return;
    }
    setError("")
    setLoading(true)
    setResult(null)
    try {

      const result = await generateNotes({topic,
        classLevel,
        examType,
        revisionMode,
        includeDiagram,
        includeChart})
        setResult(result.data)
        setLoading(false)
        setClassLevel("")
        setTopic("")
        setExamType("")
        setIncludeChart(false)
        setRevisionMode(false)
        setIncludeDiagram(false)

        if(typeof result.creditsLeft === "number"){
          dispatch(updateCredits(result.creditsLeft));

        }


    } catch (error) {
   console.log(error)
   setError("Failed to fetch notes from server");
      setLoading(false)
    }
  }

  useEffect(()=>{
  if(!loading){
    setProgress(0);
    setProgressText("")
    return;
  }
  let value = 0;

  const interval = setInterval(()=>{
    value += Math.random() * 8

     if (value >= 95) {
      value = 95;
      setProgressText("Almost done…");
      clearInterval(interval);
    } else if (value > 70) {
      setProgressText("Finalizing notes…");
    } else if (value > 40) {
      setProgressText("Processing content…");
    } else {
      setProgressText("Generating notes…");
    }

    setProgress(Math.floor(value))

  },700)

  return () => clearInterval(interval);


  },[loading])





  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        rounded-2xl
        bg-white/[0.04]
        backdrop-blur-2xl
        border border-white/[0.08]
        shadow-[0_4px_24px_rgba(0,0,0,0.3)]
        p-8
        space-y-5
        text-white
      ">

      <input type="text" className='w-full px-4 py-3 rounded-xl
        bg-transparent
        border border-white/[0.1]
        placeholder-gray-600
        text-white text-sm
        focus:outline-none focus:border-violet-500/50 transition-colors' placeholder='Enter topic (e.g. Web Development)'
        onChange={(e) => setTopic(e.target.value)}
        value={topic}
      />
      <input type="text" className='w-full px-4 py-3 rounded-xl
        bg-transparent
        border border-white/[0.1]
        placeholder-gray-600
        text-white text-sm
        focus:outline-none focus:border-violet-500/50 transition-colors'
        placeholder='Class / Level (e.g. Class 10)'
        onChange={(e) => setClassLevel(e.target.value)}
        value={classLevel}
      />
      <input type="text" className='w-full px-4 py-3 rounded-xl
        bg-transparent
        border border-white/[0.1]
        placeholder-gray-600
        text-white text-sm
        focus:outline-none focus:border-violet-500/50 transition-colors'
        placeholder='Exam Type (e.g. CBSE, JEE, NEET)'
        onChange={(e) => setExamType(e.target.value)}
        value={examType}
      />

      <div className='flex flex-col md:flex-row gap-6'>
        <Toggle label="Exam Revision Mode" checked={revisionMode} onChange={() => setRevisionMode(!revisionMode)} />
        <Toggle
          label="Include Diagram"
          checked={includeDiagram}
          onChange={() => setIncludeDiagram(!includeDiagram)}
        />
        <Toggle
          label="Include Charts"
          checked={includeChart}
          onChange={() => setIncludeChart(!includeChart)}
        />
      </div>

      <motion.button
      onClick={handleSubmit}
        whileHover={!loading ? { scale: 1.02 } : {}}
        whileTap={!loading ? { scale: 0.95 } : {}}
        disabled={loading}
        className={`
    w-full mt-2
    py-3 rounded-xl
    font-semibold text-sm
    flex items-center justify-center gap-3
    transition-colors
    ${loading
            ? "bg-white/[0.06] text-gray-500 cursor-not-allowed"
            : "bg-violet-600 text-white hover:bg-violet-500"
          }
  `}>
        {loading ? "Generating Notes..." : "Generate Notes"}

      </motion.button>


     { loading && 
     <div className='mt-4 space-y-2'>

      <div className='w-full h-2 rounded-full bg-white/10 overflow-hidden'>
      <motion.div 
      initial={{width:0}}
      animate={{width : `${progress}%`}}
      transition={{ ease: "easeOut", duration: 0.6 }}
      className='h-full bg-gradient-to-r from-violet-500 via-purple-500 to-violet-500'>

      </motion.div>
      
      </div>

      <div className='flex justify-between text-xs text-gray-300'>
        <span>{progressText}</span>
        <span>{progress}%</span>
      </div>
      <p className='text-xs text-gray-400 text-center'>
         This may take up to 2–5 minutes. Please don’t close or refresh the page.
      </p>


      </div>}





    </motion.div>
  )
}


function Toggle({ label, checked, onChange }) {
  return (
    <div className='flex items-center gap-4 cursor-pointer select-none' onClick={onChange}>
      <motion.div
        animate={{
          backgroundColor: checked
            ? "rgba(139,92,246,0.35)"   // violet when ON
            : "rgba(255,255,255,0.08)"  // subtle gray when OFF
        }}
        transition={{ duration: 0.25 }}
        className='relative w-12 h-6 rounded-full
          border border-white/20
          backdrop-blur-lg'

      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className=' absolute top-0.5
            h-5 w-5 rounded-full
            bg-white
            shadow-[0_5px_15px_rgba(0,0,0,0.5)]'
          style={{
            left: checked ? "1.6rem" : "0.25rem",
          }}

        >


        </motion.div>
      </motion.div>

      <span className={`text-sm transition-colors ${checked ? "text-violet-300" : "text-gray-400"
        }`}>{label}</span>

    </div>
  )
}




export default TopicForm
