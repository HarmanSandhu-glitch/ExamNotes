import React from 'react'

function Sidebar({result}) {

    if(!result ||
    !result.subTopics ||
    !result.questions ||
    !result.questions.short ||
    !result.questions.long){
        return null;
    }
  return (
    <div className='border border-[#1a1a1a] bg-[#0f0f0f] p-5 space-y-6'>
        <div className='flex items-center gap-2'>
            <h3 className='text-sm font-semibold text-[#a78bfa]'>
                Quick Exam View
            </h3>
        </div>

        <section>
            <p className='text-xs font-semibold text-[#555] uppercase tracking-wider mb-3'>
                Sub Topics (Priority Wise)
            </p>
            {
                Object.entries(result.subTopics).map(([star , topics])=>(
                    <div key={star} className='mb-3 bg-[#111] border border-[#1f1f1f] p-3'>
                        <p className='text-xs font-semibold text-yellow-400 mb-1'>
                            {star} Priority
                        </p>
                        <ul className='list-disc ml-4 text-xs text-[#888] space-y-1'>
                            {topics.map((t,i)=>(
                                <li key={i}>{t}</li>
                            ))}
                        </ul>
                    </div>
                ))
            }
        </section>

        <section className='bg-[#111] border border-[#1f1f1f] p-3 space-y-4'>
            <div>
                <p className='text-xs font-semibold text-[#555] uppercase tracking-wider mb-1'>
                    Exam Importance
                </p>
                <span className='text-yellow-400 font-bold text-sm'>
                    {result.importance}
                </span>
            </div>

            <div>
                <p className='text-xs font-semibold text-[#555] uppercase tracking-wider mb-3'>
                    Important Questions
                </p>

                <div className='mb-3 bg-[#7c3aed]/[0.06] border border-[#7c3aed]/20 p-3'>
                    <p className='text-xs font-medium text-[#a78bfa] mb-2'>Short Questions</p>
                    <ul className='list-disc ml-4 text-xs text-[#888] space-y-1'>
                        {result.questions.short.map((t,i)=>(
                            <li key={i}>{t}</li>
                        ))}
                    </ul>
                </div>

                <div className='mb-3 bg-[#7c3aed]/[0.04] border border-[#7c3aed]/10 p-3'>
                    <p className='text-xs font-medium text-[#c4b5fd] mb-2'>Long Questions</p>
                    <ul className='list-disc ml-4 text-xs text-[#888] space-y-1'>
                        {result.questions.long.map((t,i)=>(
                            <li key={i}>{t}</li>
                        ))}
                    </ul>
                </div>

                {result.questions.diagram && (
                    <div className='bg-[#111] border border-[#222] p-3'>
                        <p className='text-xs font-medium text-[#888] mb-2'>Diagram Question</p>
                        <p className='text-xs text-[#777]'>{result.questions.diagram}</p>
                    </div>
                )}
            </div>
        </section>
    </div>
  )
}

export default Sidebar
