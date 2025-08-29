import { AssistiveVoiceAgents } from "@/shared/list"
import React from 'react'
import VoiceAgentCard from './VoiceAgentCard'

function AssistiveAgentList() {
  return (
    <div className='mt-10'>
        <h2 className='font-bold text-xl'>Your Assistive Voice Agents.</h2>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 mt-5'>
            {AssistiveVoiceAgents.map((agent,index) => (
                <div key={index} >
                    <VoiceAgentCard voiceAgent = {agent}/> 
                </div>
            ))}
        </div>
    </div>
  )
}

export default AssistiveAgentList