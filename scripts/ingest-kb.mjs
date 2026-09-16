#!/usr/bin/env node
// Push content/interview-kb.md into the interview bot's vector store.
//
// The KB lives in git (reviewable, diffable) but the bot reads it from pgvector, so the
// two drift apart the moment you edit the file. Run this after every KB change:
//
//   INTERVIEW_INGEST_TOKEN=... npm run kb:ingest
//
// Chunking and embedding happen inside the n8n workflow — this just hands over the file.
// The token goes in the x-ingest-token header, which must match the Header Auth
// credential on the KB Ingest Webhook node (see n8n/README.md step 2).
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const N8N_BASE = process.env.N8N_BASE_URL || 'https://n8n-production-e454.up.railway.app';
const token = process.env.INTERVIEW_INGEST_TOKEN;

if (!token) {
  console.error('INTERVIEW_INGEST_TOKEN is not set — it must match the value configured in n8n.');
  process.exit(1);
}

const markdown = readFileSync(join(root, 'content/interview-kb.md'), 'utf8');

const todos = (markdown.match(/^\s*-?\s*\*\*TODO/gm) || []).length;
if (todos) {
  console.warn(`Heads up: ${todos} TODO placeholder(s) still in the KB — those are skipped, not ingested.`);
}

const res = await fetch(`${N8N_BASE}/webhook/interview-kb-ingest`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'x-ingest-token': token },
  body: JSON.stringify({ markdown }),
});

const data = await res.json().catch(() => ({}));

if (!res.ok || data.ok === false) {
  if (res.status === 403) {
    console.error('Ingest rejected (403). The x-ingest-token header does not match the');
    console.error('Header Auth credential on the KB Ingest Webhook node — see n8n/README.md step 2.');
    process.exit(1);
  }
  console.error(`Ingest failed (${res.status}):`, data.error || data);
  process.exit(1);
}

console.log(`Ingested ${data.chunks} chunk(s) from content/interview-kb.md`);
