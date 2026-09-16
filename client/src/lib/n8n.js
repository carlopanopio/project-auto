// Client for the live n8n demo webhooks (content repurposer, RAG chat, CRM sync).
// These are separate from lib/api.js, which targets this site's own authenticated
// backend — these calls go straight from the browser to n8n (CORS is wide open on
// the n8n side specifically for that) and never touch our Express server.

const N8N_BASE = import.meta.env.VITE_N8N_BASE_URL || 'https://n8n-production-e454.up.railway.app';

export class N8nError extends Error {
  constructor(kind, message) {
    super(message);
    this.kind = kind; // 'network' | 'rate_limited' | 'server'
  }
}

async function postToN8n(path, body) {
  let res;
  try {
    res = await fetch(`${N8N_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new N8nError('network', 'Could not reach the demo service. Check your connection and try again.');
  }

  const data = await res.json().catch(() => ({}));

  if (res.status === 429) {
    // The workflow already writes a ready-to-render friendly message — don't reparse it.
    throw new N8nError('rate_limited', data.message || "You've hit the demo limit — please try again later.");
  }
  if (!res.ok) {
    throw new N8nError('server', data.message || data.error || `Request failed (${res.status}).`);
  }
  return data;
}

export const repurposeContent = (body) => postToN8n('/webhook/content-repurposer', body);

// The RAG chat workflow is contractually always-200: even a rate-limited visitor gets
// { answer: <friendly pre-written limit message>, sources: [] } back, never a 429. So this
// never throws N8nError('rate_limited', ...) in practice — callers just render answer/sources
// like any other reply.
export const askChat = (question) => postToN8n('/webhook/rag-chat-demo', { question });

// The interview bot's RAG workflow. Like the demo chat above it is always-200 — a
// visitor over the limit gets a friendly message in `answer`, not a 429. Unlike the
// demo chat it carries recent turns, because interview follow-ups need the thread.
export const askInterviewBot = (question, history) =>
  postToN8n('/webhook/interview-chat', { question, history });

export const submitCrmLead = (body) => postToN8n('/webhook/crm-sync-lead', body);

export const enrichDomain = (domain) => postToN8n('/webhook/lead-enrichment', { domain });
