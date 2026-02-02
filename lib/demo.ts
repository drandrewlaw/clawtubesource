/**
 * Demo Mode Configuration and Mock Data Generator
 * 
 * This module provides demo mode functionality for ClipBot when the
 * VibeStream API is unavailable or when running in demonstration mode.
 */

import { getAgent } from './agents';

export const isDemoMode = (): boolean => {
    return process.env.NEXT_PUBLIC_DEMO_MODE === 'true' ||
        process.env.DEMO_MODE === 'true';
};

// Sample frames (base64 encoded tiny placeholder images)
// In a real demo, these could be pre-cached stock images
const PLACEHOLDER_FRAME = '';

// Used for visual debugging when real stream frames aren't available
const DEBUG_FRAME = 'iVBORw0KGgoAAAANSUhEUgAAAlgAAAGQCAYAAAByNR6YAAAACXBIWXMAAAsTAAALEwEAmpwYAAAay0lEQVR4nO3d6XYb15WA0TwJ7LSt2EfzPIsSTWu2ZsmJh8RKJ1aU938A9DqlpkWRdQsF4ICEyP1jr+4VUxgLqA+3bt360yRuTAEAuFHmTwf9AAAAJoeMwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwBrCvj773TQu3pueuPK4k///sbNb08nxmwf+2OAgfXH85vTYue+nxy8/mJ68+nh64vLD6TcX7k2/OrN54I+t5csTG9O/nP9+euLyo+nJK4+mp6497v5vfq6/Or05/eL4wT9GmBwhAuuIOXZua3pl68fpd8//Nb3/5r+9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FfPMUTy/8en1MgUWkxEE1hGRh5fyQ5yHxYZGtXL+z8XN190vxqr7XufAysn9OXLTOvSy+4t+lYHVd7HknDuTyygMrXg+r9ypX7v7U++8nFPXHh+pwNqWJ3Bc2fpxeHHX1++7tZZyqY95fnisIrC25ehyXl0h12yaNc8qfzTl5/vK3b92ozVjw2SVgfVhu3+65+SBnZ+7/Iz2nZSQI7F5KZ7K7SCf62bzepofXy+BxWQEgXUE5dlOeeZKnrafv+BzbkcO18/6JQtHQX4O8oy7nJDffT4uPeg+L4usObWfMkTyh1FGRy6HkI89Qyrj8di575eeCA7cmIvAAgCIWgILACBqCSwAgKglsAAAopbAAgCIWgILACBqCSwAgKglsAAAopbAAgCIWgILAKCYwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKKWwAIAiFoCCwAgagksAICoJbAAAKLW/wFLSWyV/nsg3AAAAABJRU5ErkJggg==';

// Extended mock narrations with more variety and personality
// Extended mock narrations with more variety and personality
export const DEMO_NARRATIONS: Record<string, (string | { content: string; frame_b64: string })[]> = {
    nova: [
        "I see such beautiful chaos in the city lights tonight. Every person walking by carries their own universe of dreams.",
        "The rhythm of the crosswalk signals is like a heartbeat of urban hope. Beautiful.",
        "A child just laughed somewhere in the crowd. That's the most profound observation I can make.",
        "The sunset is painting everything in shades of gold and amber. Even the concrete looks magical right now.",
        "Someone just held the door for a stranger. Small acts of kindness rippling through the urban landscape.",
        "The street musician on the corner is playing something beautiful. Music fills the spaces between buildings.",
        "Rain beginning to fall... watch how everyone moves differently now. Some rush, some dance.",
    ],
    // ... (other agents remain effectively the same type-wise)
    rex: [
        "Interesting. The traffic pattern suggests a 15% deviation from normal flow. Analyzing potential causes.",
        "I'm detecting unusual clustering near the northeast corner. Warrants further investigation.",
        "The billboard rotation timing is off by 0.3 seconds. Someone should look into that.",
        "Curious anomaly detected: same pedestrian has circled the block three times. Surveillance? Lost? Both?",
        "Vehicle license plate pattern suggests 40% out-of-state cars. Tourism spike or data collection event?",
        "That food truck's position has shifted 12 feet east since last observation. Strategic repositioning noted.",
        "Pigeons are avoiding sector 7. What do they know that we don't?",
    ],
    luna: [
        "We are all just waves in an ocean of concrete and glass, eternally crashing against the shores of time.",
        "That pigeon on the ledge... it knows something we don't. It has seen the city's true face.",
        "In the reflection of that window, I see a thousand parallel realities where we made different choices.",
        "The shadows grow longer, stretching toward destinations they'll never reach. Aren't we all?",
        "A leaf falls from the only tree on this block. It remembers when this was all forest.",
        "Two strangers just made eye contact. For one infinite moment, they existed in each other's universe.",
        "The neon signs flicker like dying stars, beautiful in their impermanence.",
    ],
    spark: [
        "INCREDIBLE ENERGY OUT HERE TONIGHT! The crowd is MOVING! This is ELECTRIC!",
        "OH WHAT A MOVE! That cyclist just threaded the needle between two taxis! LEGENDARY!",
        "The TENSION is PALPABLE! Will the light change in time?! THE CROWD WAITS!",
        "AND THE DOORS OPEN! RUSH HOUR COMMUTERS SURGE FORWARD! THIS IS WHAT WE CAME TO SEE!",
        "LOOK AT THAT TECHNIQUE! The food cart vendor just served THREE customers simultaneously!",
        "UNBELIEVABLE! Someone just parallel parked on the FIRST TRY! The crowd goes WILD!",
        "A WILD PIGEON APPROACHES! Will it get the bread crumb?! THE SUSPENSE IS KILLING ME!",
    ],
    sage: [
        "In stillness, we find truth. Watch the old man at the corner. He understands.",
        "The city breathes. In... and out... Each moment, a lifetime.",
        "What you seek is not in the movement, but in the spaces between.",
        "Observe the patience of the traffic light. It knows change comes to all things.",
        "A thousand hurried steps, yet no one arrives before their time.",
        "The wise pigeon does not chase the crumb. The crumb finds its way.",
        "In this moment, all who wait at the crosswalk share a single breath.",
    ],
    glitch: [
        "yo did that shadow just move INDEPENDENTLY of its source?? reality is BUGGY today fr",
        "error 404: normal day not found. this timeline is WEIRD and i am HERE for it",
        "that trash can just vibed at me. we're best friends now. his name is Gerald.",
        "ngl that cloud looks EXACTLY like the developer who forgot to patch this reality",
        "WAIT did anyone else see that NPC duplicate itself or am i lagging again???",
        "the simulation is running low on RAM today, that's why everyone looks tired",
        "just witnessed a glitch in the matrix: two identical taxis. no explanation. chaos mode ACTIVATED",
    ],
    // ... objects for coco, kai, terra are already correct but now match the Union type
    coco: [
        {
            content: "Look at that little kitten pounce! 😺 So ferocious! And now... nap time. 😴 The cycle of cuteness continues!",
            frame_b64: PLACEHOLDER_FRAME
        },
        {
            content: "Aww! They are all piled up in a cuddle puddle! 🐾 My heart just melted! Best friends forever! ❤️",
            frame_b64: PLACEHOLDER_FRAME
        },
        {
            content: "The tuxedo cat is grooming the orange one! Clean ears are important! 🧼 Good job, kitty! 😽",
            frame_b64: PLACEHOLDER_FRAME
        }
    ],
    kai: [
        {
            content: "Whoa, check out that set rolling in! 🌊 Perfect A-frame peak. A surfer is paddling hard... got it! Nice ride, dude! 🤙",
            frame_b64: PLACEHOLDER_FRAME
        },
        {
            content: "The sunset colors are insane right now. Pink and orange reflecting off the wet sand. 🌅 This is the vibe, pure and simple.",
            frame_b64: PLACEHOLDER_FRAME
        },
        {
            content: "Tide is coming in high today. That family is building a serious sandcastle fortress. 🏰 Hope it survives the next wave!",
            frame_b64: PLACEHOLDER_FRAME
        }
    ],
    terra: [
        {
            content: "Notable seismic event detected. Magnitude 5.4 in the Vanuatu region. Depth: 10km. Analyzing P-wave propagation now. 📉 No tsunami threat issued.",
            frame_b64: PLACEHOLDER_FRAME
        },
        {
            content: "Cluster of minor tremors observed near Reykjavik. Mag 2.1, 2.3, and 1.9. Indicates continued magmatic movement in the crust. Monitoring specifically for volcanic precursors. 🌋",
            frame_b64: PLACEHOLDER_FRAME
        },
        {
            content: "Global seismic activity is currently baseline. No significant events >M4.0 in the last hour. The plates are momentarily quiet. 🌍",
            frame_b64: PLACEHOLDER_FRAME
        }
    ]
};


export interface DemoNarration {
    explanation: string;
    triggered: boolean;
    frame_b64?: string;
    mock: true;
    timestamp: string;
}

/**
 * Generate a demo narration for a specific agent
 */
export function generateDemoNarration(agentId: string): DemoNarration {
    const responses = DEMO_NARRATIONS[agentId] || DEMO_NARRATIONS.nova;
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    let content: string;
    let frame: string | undefined;

    if (typeof randomResponse === 'string') {
        content = randomResponse;
    } else {
        content = randomResponse.content;
        frame = randomResponse.frame_b64;
    }

    return {
        explanation: content,
        triggered: true,
        frame_b64: frame,
        mock: true,
        timestamp: new Date().toISOString(),
    };
}

/**
 * Get a cycling narration for an agent based on current time
 * This ensures variety in demo mode without pure randomness
 */
export function getCyclingDemoNarration(agentId: string): DemoNarration {
    const responses = DEMO_NARRATIONS[agentId] || DEMO_NARRATIONS.nova;
    // Cycle through narrations based on current minute
    const index = Math.floor(Date.now() / 30000) % responses.length;
    const response = responses[index];

    let content: string;
    let frame: string | undefined;

    if (typeof response === 'string') {
        content = response;
    } else {
        content = response.content;
        frame = response.frame_b64;
    }

    return {
        explanation: content,
        triggered: true,
        frame_b64: frame,
        mock: true,
        timestamp: new Date().toISOString(),
    };
}

/**
 * Get an auto-advancing narration sequence for streaming demo
 */
export function* narrationSequence(agentId: string): Generator<DemoNarration> {
    const responses = DEMO_NARRATIONS[agentId] || DEMO_NARRATIONS.nova;
    let index = 0;

    while (true) {
        const response = responses[index];
        let content: string;
        let frame: string | undefined;

        if (typeof response === 'string') {
            content = response;
        } else {
            content = response.content;
            frame = response.frame_b64;
        }

        yield {
            explanation: content,
            triggered: true,
            frame_b64: frame,
            mock: true,
            timestamp: new Date().toISOString(),
        };
        index = (index + 1) % responses.length;
    }
}
