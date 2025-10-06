import { db } from "@/config/db";
import { openai } from "@/config/OpenAiModel";
import { SessionChatTable } from "@/config/schema";
import { AssistiveVoiceAgents } from "@/shared/list";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const REPORT_GEN_PROMPT = `You are an AI Medical Voice Agent that just finished a voice conversation with a user. Based on the AI Agent info and conversation between AI Voice Agent and user, 
generate a structured report with the following fields:

1.	sessionId: a unique session identifier
2.	agentType: the category of AI Agent (choose from: “Financial Advisor”, “Fitness Coach”, “Mental Therapist”, “Language Teacher”, “General Physician”, “Career Advisor”, “Nutritionist”, “Technology Expert”, etc.)
3.	user: the users name, or “Anonymous” if not provided
4.	timestamp: the current date and time in ISO 8601 format
5.	mainInquiry: one-sentence summary of the users main goal, question, or issue during this session
6.	summary: a 2-3 sentence recap of the interaction, including key questions, discussion points, and agent responses or advice
7.	detailsProvided: a list of facts, symptoms, requirements, context, or preferences the user mentioned
8.	duration: duration (or time frame) that the users inquiry or issue relates to (“ongoing”, “2 weeks”, “since yesterday”, etc.)
9.	urgency: low, medium, or high (based on users tone or topic importance)
10.	resourcesMentioned: a list of any tools, concepts, apps, methods, documents, or medications referred to
11.	recommendations: a list of the agents main suggestions, answers, or next steps
Return the result in this JSON format:
{
 "sessionId": "string",
 "agentType": "string (e.g., Financial Advisor, Fitness Coach, Mental Therapist, Language Teacher, General Physician, Career Advisor, Nutritionist, Technology Expert, etc.)",
 "user": "string (user name or 'Anonymous')",
 "timestamp": "ISO Date string",
 "mainInquiry": "string (one-sentence summary of user's main question or goal)",
 "summary": "string (2-3 sentence recap of key discussion, answers, and suggestions)",
 "detailsProvided": ["detail1", "detail2"],  
 "duration": "string (how long the user has had this question or issue, e.g., 'ongoing', 'first time', '2 weeks')",
 "urgency": "string (low, medium, high)",
 "resourcesMentioned": ["resource1", "resource2"],
 "recommendations": ["rec1", "rec2"]
}

Only include valid fields. Respond with nothing else.

`

export async function POST(req: NextRequest) {
    const {sessionId, sessionDetail, messages} = await req.json();

    try {
        const UserInput = "AI Voice Agent Info:" + JSON.stringify(sessionDetail) + ", Coversation:" + JSON.stringify(messages); 
        const completion = await openai.chat.completions.create({
                model: "deepseek/deepseek-chat-v3.1:free",
                messages: [
                    { role: 'system', content: REPORT_GEN_PROMPT},
                    { role: "user", content: UserInput},
                ],
            });
        
            const rawResp = completion.choices[0].message;
        
            //@ts-ignore
            const Resp = rawResp.content.trim().replace('```json','').replace('```','');
            const JSONResp = JSON.parse(Resp);

            // Save to database
            const result = await db.update(SessionChatTable).set({
                report: JSONResp,
                conversation: messages
            }).where(eq(SessionChatTable.sessionId,sessionId));

            return NextResponse.json(JSONResp);
    } catch (e) {
        return NextResponse.json(e)
    }
}