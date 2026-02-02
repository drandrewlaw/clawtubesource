import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const demoPath = join(process.cwd(), 'lib/demo.ts');
const imagePath = join(process.cwd(), 'tools/image_b64.txt');

const demoContent = readFileSync(demoPath, 'utf-8');
const imageB64 = readFileSync(imagePath, 'utf-8').trim();

// Regex to replace the PLACEHOLDER_FRAME constant
// We look for const PLACEHOLDER_FRAME = '...';
const updatedContent = demoContent.replace(
    /const PLACEHOLDER_FRAME =\s*'[^']*';/,
    `const PLACEHOLDER_FRAME = '${imageB64}';`
);

writeFileSync(demoPath, updatedContent);
console.log('Updated PLACEHOLDER_FRAME in lib/demo.ts');
