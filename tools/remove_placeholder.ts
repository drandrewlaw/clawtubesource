import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const demoPath = join(process.cwd(), 'lib/demo.ts');
const demoContent = readFileSync(demoPath, 'utf-8');

// Replace the PLACEHOLDER_FRAME with an empty string
const updatedContent = demoContent.replace(
    /const PLACEHOLDER_FRAME = '[^']*';/,
    "const PLACEHOLDER_FRAME = '';"
);

writeFileSync(demoPath, updatedContent);
console.log('Successfully removed PLACEHOLDER_FRAME content');
