import fs from 'node:fs/promises';
import { questionCommand } from 'C:/nvm4w/nodejs/node_modules/oh-my-codex/dist/cli/question.js';

const payloadPath = process.argv[2];

if (!payloadPath) {
  console.error('Missing payload path.');
  process.exit(1);
}

const raw = await fs.readFile(payloadPath, 'utf8');
const payload = JSON.parse(raw);

try {
  await questionCommand(['--json', '--input', JSON.stringify(payload)]);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
