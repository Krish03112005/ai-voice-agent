'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { DialogClose } from '@radix-ui/react-dialog'
import { ArrowRight, Loader2 } from 'lucide-react'
import axios from 'axios'
import VoiceAgentCard, { voiceAgent } from './VoiceAgentCard'
import SuggestedAgentsCard from './SuggestedAgentsCard'
import { useRouter } from 'next/navigation'

function AddNewSessionDialog() {

    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [suggestedAgents, setSuggestedAgents] = useState<voiceAgent[]>();
    const [selectedAgent, setSelectedAgent] = useState<voiceAgent>();
    const router = useRouter();

    const OnClickNext = async () => {
        setLoading(true);
        const result = await axios.post('/api/suggest-agents', {notes: note});
        console.log(result.data);
        setSuggestedAgents(result.data);
        setLoading(false);
    }

    const onStartConsultation = async () => {
        setLoading(true);
        // Save All Info to DB
        const result = await axios.post('/api/session-chat',{
            notes: note,
            selectedAgent: selectedAgent
        });

        console.log(result.data)
        if(result.data?.sessionId){
            console.log(result.data.sessionId);
            //Route to new Conversation Screen
            router.push('/dashboard/convo-agent/'+result.data.sessionId);
        }   
        setLoading(false);

    }

  return (
    <Dialog>
        <DialogTrigger>
            <Button className='mt-3'>+ Start Conversation</Button>
        </DialogTrigger>
        <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add basic Queries</DialogTitle>
                        <DialogDescription asChild>
                            {!suggestedAgents ? <div>
                                <h2>Write down your Questions or any other queries.</h2>
                                <Textarea placeholder='Write your queries here...'
                                className='h-[130px] mt-2'
                                onChange={(e) => setNote(e.target.value)}
                                />
                            </div> : 
                            <div>
                                <h2>Select Your Agent</h2>
                                <div className='grid grid-cols-3 gap-5'>
                                    {/* //Suggested agents */}
                                    {Array.isArray(suggestedAgents) && 
                                    suggestedAgents.map((voiceAgent,index)=>(
                                        <SuggestedAgentsCard voiceAgent={voiceAgent} key={index}
                                        setSelectedAgent = {() => setSelectedAgent(voiceAgent)}
                                        //@ts-ignore
                                        selectedAgent={selectedAgent}/>
                                        
                                    ))}
                                </div>
                            </div>}
                        </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose>
                        <Button variant='outline'>Cancel</Button>   
                    </DialogClose>

                    {! suggestedAgents ? <Button disabled={!note||loading} onClick={()=>OnClickNext()}> 
                         Next {loading ? <Loader2 className='animate-spin'/>: <ArrowRight/>} </Button>
                         : <Button disabled={loading || !selectedAgent} onClick={() => onStartConsultation()}>Start Consultation
                         {loading ? <Loader2 className='animate-spin'/>: <ArrowRight/>} </Button>}
                </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default AddNewSessionDialog