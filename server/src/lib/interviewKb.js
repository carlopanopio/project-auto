// Loads the interview knowledge base — the ONLY source of truth the interview bot
// may answer from. Read once at boot: the file ships with the deploy, so re-reading
// per request buys nothing and a cached string keeps the prompt prefix byte-stable
// (which is what makes prompt caching hit — see routes/interview.js).
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const KB_PATH = join(__dirname, '../../../content/interview-kb.md');

let kb = null;

try {
  kb = readFileSync(KB_PATH, 'utf8').trim();
} catch (err) {
  console.error(`Interview KB not readable at ${KB_PATH} — /api/interview will return 503.`, err.message);
}

export const kbAvailable = () => kb !== null && kb.length > 0;
export const getKb = () => kb;
