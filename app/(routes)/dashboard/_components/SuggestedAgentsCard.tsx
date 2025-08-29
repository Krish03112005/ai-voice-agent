import React from 'react'
import { voiceAgent } from './VoiceAgentCard'
import Image from 'next/image'

type props = {
    voiceAgent: voiceAgent,
    setSelectedAgent:any
}

function SuggestedAgentsCard({voiceAgent, setSelectedAgent}: props) {
  return (
    <div className='flex flex-col items-center 
    border rounded-2xl shadow p-5
    hover:border-cyan-500 cursor-pointer' onClick={() => setSelectedAgent(voiceAgent)}>
        <Image src={voiceAgent.image} 
            alt={voiceAgent.specialist}
            width={70}
            height={70}
            className='w-[50px] h-[50px] rounded-4xl object-cover'
        />
        <h2 className='font-bold text-sm text-center'>{voiceAgent.specialist}</h2>
        <p className='text-xs text-center line-clamp-2'>{voiceAgent.description}</p>
    </div>
  )
}

export default SuggestedAgentsCard