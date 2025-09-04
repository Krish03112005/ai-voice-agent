import React from 'react'
import { voiceAgent } from './VoiceAgentCard'
import Image from 'next/image'

type props = {
    voiceAgent: voiceAgent;
    setSelectedAgent: (agent: voiceAgent) => any;
    selectedAgent: voiceAgent | null;
}

function SuggestedAgentsCard({ voiceAgent, setSelectedAgent, selectedAgent }: props) {
    const isSelected = selectedAgent?.id === voiceAgent.id;

  return(
    <div
      className={`flex flex-col justify-center items-center border rounded-2xl shadow p-5 hover:border-cyan-500 cursor-pointer
      ${isSelected ? 'border-cyan-600' : 'border-gray-300'}`}
      onClick={() => setSelectedAgent(voiceAgent)}
      tabIndex={0}
      role="button"
    >
      <Image
        src={voiceAgent.image}
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