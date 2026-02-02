import { NextResponse } from 'next/server';
import { AGENTS } from '@/lib/agents';

export async function GET() {
    // Return all agents with their current status
    const streams = AGENTS.map((agent) => ({
        id: agent.id,
        name: agent.name,
        avatar: agent.avatar,
        personality: agent.personality,
        status: agent.status,
        color: agent.color,
    }));

    return NextResponse.json(streams);
}
