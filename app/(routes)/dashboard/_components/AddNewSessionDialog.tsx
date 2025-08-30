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

function AddNewSessionDialog() {

    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [suggestedAgents, setSuggestedAgents] = useState<voiceAgent[]>();
    const [selectedAgent, setSelectedAgent] = useState<voiceAgent>();

    const OnClickNext = async () => {
        setLoading(true);
        const result = await axios.post('/api/suggest-agents', {notes: note});
        console.log(result.data);
        setSuggestedAgents(result.data);
        setLoading(false);
    }

    const onStartConsultation = () => {
        // Save All Info to DB
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
                                    {suggestedAgents.map((voiceAgent,index)=>(
                                        <SuggestedAgentsCard voiceAgent={voiceAgent} key={index}
                                        setSelectedAgent = {() => setSelectedAgent(voiceAgent)}/>
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
                         : <Button onClick={() => onStartConsultation()}>Start Consultation</Button>}
                </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default AddNewSessionDialog