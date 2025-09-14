'use client'
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { voiceAgent } from '../../_components/VoiceAgentCard';
import { Circle, PhoneCall } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

type SessionDetail = {
  id: number,
  notes: string,
  sessionId: string,
  resport: JSON,
  selectedAgent: voiceAgent,
  createdOn: string,
}

function AvaVoiceAgent() {

  const {sessionId} = useParams();
  const [sessionDetails, setSessionDetails] = useState<SessionDetail>();
  useEffect(() => {
    sessionId && GetSessionDetails();
  },[sessionId])
  const GetSessionDetails = async () => {
    const result = await axios.get('/api/session-chat?sessionId='+sessionId);
    console.log(result.data);
    setSessionDetails(result.data);
  }

  return (
    <div className='p-7 border rounded-3xl bg-secondary/50'>
      <div className='flex justify-between items-center'>
        <h2 className='p-1 px-2 border rounded-md flex gap-2 items-center shadow'> <Circle className='h-5 w-5'/> Not Connected </h2>
        <h2 className='font-bold text-xl text-gray-400'>00:00</h2>
      </div>

        {sessionDetails && 
          <div className='flex items-center flex-col mt-10'>
              <Image src={sessionDetails?.selectedAgent?.image} alt={sessionDetails?.selectedAgent?.specialist}
              width={220}
              height={220}
              className='h-[200px] w-[200px] object-cover rounded-full'
              />
              <h2 className='mt-5 text-lg font-bold'>{sessionDetails?.selectedAgent?.specialist}</h2>
              <p className='text-sm text-gray-500'>AI Consultation Voice Agent</p>

              <div className='mt-32 items-center flex flex-col'>
                <h2 className='text-gray-400'>Assistance Message</h2>
                <h2 className='text-lg'>User message</h2>
              </div>

            <Button className='mt-20'> <PhoneCall/> Start Call </Button>
        </div>}
    </div>
  )
}

export default AvaVoiceAgent