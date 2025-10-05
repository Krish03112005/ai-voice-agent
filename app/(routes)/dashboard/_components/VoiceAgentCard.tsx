import { Button } from '@/components/ui/button'
import { IconArrowRight } from '@tabler/icons-react'
import Image from 'next/image'
import React from 'react'

export type voiceAgent = {
     id: number,
     specialist: string,
     description: string,
     image: string,
     agentPrompt: string,
     voiceId?: string
}

type props = {
    voiceAgent: voiceAgent
}

function VoiceAgentCard({voiceAgent}: props) {
  return (
    <div>
        <Image src={voiceAgent.image} 
        alt={voiceAgent.specialist} 
        width={200}
        height={300}
        className='w-[300px] h-[320px] object-cover rounded-xl'
        />
        <h2 className='font-bold mt-3 text-lg'>{voiceAgent.specialist}</h2>
        <p className='line-clamp-2 mt-1 text-sm text-gray-500'>{voiceAgent.description}</p>
        <Button className='w-full mt-3 '>Start Conversation <IconArrowRight/></Button>
    </div>
    
  )
}

export default VoiceAgentCard