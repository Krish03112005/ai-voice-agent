import { db } from "@/config/db";
import { SessionChatTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
    const { notes, selectedAgent } = await req.json();
    const user = await currentUser();
    try {
        const sessionId = uuidv4();
        const result = await db.insert(SessionChatTable).values({
            sessionId: sessionId,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            notes: notes,
            selectedAgent: selectedAgent,
            createdOn: (new Date()).toString()
            //@ts-ignore
        }).returning({ SessionChatTable });

        return NextResponse.json(result[0]?.SessionChatTable);
    } catch (e) {
        return NextResponse.json(e);
    }
}