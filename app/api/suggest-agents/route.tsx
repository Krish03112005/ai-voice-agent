import { openai } from "@/config/OpenAiModel";
import { AssistiveVoiceAgents } from "@/shared/list";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    const {notes}= await req.json();
    try {
        const completion = await openai.chat.completions.create({
        model: "deepseek/deepseek-chat-v3.1:free",
        messages: [
            {role: 'system', content:JSON.stringify(AssistiveVoiceAgents)},
            { role: "user", content: "User Queries/Problems:"+notes+", Depends on user notes and queries, Please suggest list of agents, Return Object in JSON only" }
        ],
    });

    const rawResp = completion.choices[0].message;

    //@ts-ignore
    const Resp = rawResp.content.trim().replace('```json','').replace('```','');
    const JSONResp = JSON.parse(Resp);
    return NextResponse.json(JSONResp);
    } catch (e) {
        return NextResponse.json(e);
        
    }
}