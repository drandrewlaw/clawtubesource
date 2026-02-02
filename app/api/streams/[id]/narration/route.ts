import { NextRequest, NextResponse } from 'next/server';
import { getAgent, generateAgentCondition } from '@/lib/agents';
import vibestream from '@/lib/vibestream';
import { isDemoMode, generateDemoNarration } from '@/lib/demo';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const agent = getAgent(id);

    if (!agent) {
        return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    // Check if demo mode is enabled
    if (isDemoMode()) {
        const demoNarration = generateDemoNarration(id);
        return NextResponse.json({
            success: true,
            agentId: id,
            ...demoNarration,
            demoMode: true,
        });
    }

    try {
        // Use the VibeStream API to analyze the stream
        const condition = generateAgentCondition(agent);

        const result = await vibestream.checkOnce({
            youtube_url: agent.streamUrl,
            condition: `${agent.prompt} ${condition}`,
            model: 'gemini-2.5-flash',
            include_frame: true,
            skip_validation: true,
        });

        return NextResponse.json({
            success: true,
            agentId: id,
            explanation: result.explanation,
            triggered: result.triggered,
            frame_b64: result.frame_b64,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('VibeStream API error:', error);

        // Fallback: use demo narration if API fails
        const demoNarration = generateDemoNarration(id);
        return NextResponse.json({
            success: true,
            agentId: id,
            ...demoNarration,
            fallback: true,
        });
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
        agent: {
            name: agent.name,
            personality: agent.personality,
            status: agent.status,
        },
        message: 'Use POST to request a new observation',
    });
}
