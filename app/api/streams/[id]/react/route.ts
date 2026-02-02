import { NextRequest, NextResponse } from 'next/server';
import { getAgent } from '@/lib/agents';

// In-memory reaction store (would use a database in production)
const reactionStore: Record<string, Record<string, { fire: number; hmm: number; lobster: number }>> = {};

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const agent = getAgent(id);

    if (!agent) {
        return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    try {
        const body = await request.json();
        const { type } = body;

        if (!['fire', 'hmm', 'lobster'].includes(type)) {
            return NextResponse.json({ error: 'Invalid reaction type' }, { status: 400 });
        }

        // Initialize store for this agent if needed
        if (!reactionStore[id]) {
            reactionStore[id] = {
                current: { fire: 0, hmm: 0, lobster: 0 },
            };
        }

        // Increment reaction count
        reactionStore[id].current[type as 'fire' | 'hmm' | 'lobster']++;

        return NextResponse.json({
            success: true,
            agentId: id,
            reactions: reactionStore[id].current,
        });
    } catch (error) {
        console.error('Error processing reaction:', error);
        return NextResponse.json({ error: 'Failed to process reaction' }, { status: 500 });
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const agent = getAgent(id);

    if (!agent) {
        return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    return NextResponse.json({
        agentId: id,
        reactions: reactionStore[id]?.current || { fire: 0, hmm: 0, lobster: 0 },
    });
}
