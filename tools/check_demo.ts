import { generateDemoNarration, isDemoMode } from '../lib/demo';
import { AGENTS, getAgent } from '../lib/agents';

console.log('Checking lib/demo.ts...');
try {
    console.log('Is demo mode:', isDemoMode());
    console.log('Terra Demo Narration:', JSON.stringify(generateDemoNarration('terra'), null, 2));
} catch (error) {
    console.error('Error in lib/demo.ts:', error);
}

console.log('Checking lib/agents.ts...');
try {
    const terra = getAgent('terra');
    console.log('Terra Agent:', terra ? terra.name : 'Not Found');
    if (!terra) throw new Error('Terra not found in AGENTS');
} catch (error) {
    console.error('Error in lib/agents.ts:', error);
}
