'use client'
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { voiceAgent } from '../../_components/VoiceAgentCard';
import { Circle, Loader2, PhoneCall, PhoneOff } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Vapi from '@vapi-ai/web';
import Provider from '@/app/provider';

type SessionDetail = {
  id: number,
  notes: string,
  sessionId: string,
  resport: JSON,
  selectedAgent: voiceAgent,
  createdOn: string,

}

type messages = {
  role: string,
  text: string
}

function AvaVoiceAgent() {
  const {sessionId} = useParams();
  const [sessionDetails, setSessionDetails] = useState<SessionDetail>();
  const [callStarted, setCallStarted] = useState(false);
  const [vapiInstance, setVapiInstance] = useState<any>();
  const [currentRole, setCurrentRole] = useState<string | null>();
  const [liveTranscript, setLiveTranscript] = useState<string>('');

  // Add loading state at the top with other state declarations
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<messages[]>([]);

  useEffect(() => {
    sessionId && GetSessionDetails();

    return () => {
        // Cleanup when component unmounts
        if (vapiInstance) {
          vapiInstance.stop();
          vapiInstance.off('call-start');
          vapiInstance.off('call-end');
          vapiInstance.off('message');
        }
      };
  }, [sessionId]);

  const GetSessionDetails = async () => {
    const result = await axios.get('/api/session-chat?sessionId=' + sessionId);
    // setVapiInstance(vapi)
    console.log(result.data);
    setSessionDetails(result.data);
  }

  const StartCall = async() => {
    if (!sessionDetails) return;
    setLoading(true);
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
    setVapiInstance(vapi);

    const VapiAgentConfig = {
      name:"AI Consultataion Voice Agent",
      firstMessage:"Hi, there i am your AI Voice Agent. How can I help you today?",
      transcriber:{
        provider: 'assembly-ai',
        language: 'en' 
      },
      voice:{
          provider: 'vapi',
          voiceId: sessionDetails?.selectedAgent?.voiceId
      },
      model:{
        provider: 'openai',
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: sessionDetails?.selectedAgent?.agentPrompt
          }
        ]
        
      }
    }

    //@ts-ignore
    vapi.start(VapiAgentConfig);
    vapi.on('call-start', () => {
      console.log('Call started')
      setCallStarted(true);
    });

    vapi.on('call-end', () => {
      setCallStarted(false);
      console.log('Call ended')
    });

    vapi.on('message', (message) => {
      if (message.type === 'transcript') {
        const {role, transcriptType, transcript} = message; 
        console.log(`${message.role}: ${message.transcript}`);
        if(transcriptType == 'partial')
        {
        setLiveTranscript(transcript);
        setCurrentRole(role);
        }
        else if(transcriptType == 'final'){ 
          //Final Transcript
          setMessages((prev:any) => [...prev,{role: role, text: transcript}]);
          setLiveTranscript("");
          setCurrentRole(null);
        }
      }
    });

     vapiInstance.on('speech-start', () => {
      console.log('Assistant started speaking');
      setCurrentRole('assistant'); 
    });
    vapiInstance.on('speech-end', () => {
      console.log('Assistant stopped speaking');
      setCurrentRole('user');
    });

  }

    const endCall = () => {
      if (!vapiInstance) return;
      console.log('Ending Call...');
      //Stop the call
      vapiInstance.stop();
      //Optionally remove the listeners
      vapiInstance.off('call-start');
      vapiInstance.off('call-end');
      vapiInstance.off('message');

      //Reset call state
      setCallStarted(false);
      setVapiInstance(null);
  };

  const GenerateReport = () => {

  };

  return (
    <div className='p-7 border rounded-3xl bg-secondary/50'>
      <div className='flex justify-between items-center'>
        <h2 className='p-1 px-2 border rounded-md flex gap-2 items-center shadow'> <Circle className={`h-5 w-5 rounded-full ${callStarted?'bg-green-500':'bg-red-500'}`}/>{callStarted?'Connected...':'Not Connected'}  </h2>
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

              <div className='mt-12 overeflow-y-auto flex flex-col items-center px-10 md:px-28 lg:px-52 xl:px-72'>
                {messages?.slice(-4).map((msg: messages,index)=> (  
                    <h2 className='text-gray-500 p-2' key={index}>{msg.role}: {msg.text}</h2>
                ))}
                {liveTranscript && liveTranscript?.length > 0 &&  <h2 className='text-lg'>{currentRole} : {liveTranscript}</h2>}
              </div>

              {!callStarted ? 
              <Button className='mt-20' onClick={StartCall}>
                <PhoneCall /> Start Call 
              </Button>:
              <Button variant={'destructive'} onClick={endCall}> 
                <PhoneOff/> Disconnect 
              </Button>
            }
        </div>} 
    </div>
  )
}

export default AvaVoiceAgent