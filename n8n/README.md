# Interview bot — n8n RAG

The "Ask me your interview questions" section on the site is backed entirely by n8n, the
same way the other live demos are. There is no server-side route: the browser posts
straight to the n8n webhook.

```
browser  ──POST /webhook/interview-chat──▶  n8n
                                            ├─ hash IP, check rate limit (Postgres)
                                            ├─ embed question  (gemini-embedding-001, 768d)
                                            ├─ match_interview_chunks (pgvector, top 6)
                                            ├─ build grounding prompt (Code node)
                                            ├─ generate answer (gemini-3.6-flash)
                                            └─ respond { answer, sources[] }
```

Both workflows already exist in the n8n instance — they were created from the `.ts`
sources in this directory via the n8n MCP SDK, not imported by hand:

| Workflow | ID | Webhook path |
|---|---|---|
| Interview Bot - Chat Query Workflow | `us5aJyCZoPWbvsYR` | `/webhook/interview-chat` |
| Interview Bot - KB Ingestion | `Uy37D85QEfkKCjub` | `/webhook/interview-kb-ingest` |

Both are **inactive** until the steps below are done, but both have been run end to end
against the live database and work (see *Verified* below). n8n is the source of truth once
you start editing in the UI; the `.ts` files are the build sources and will go stale if
you change a node and don't update them.

The knowledge base is `content/interview-kb.md` in this repo. Git holds the reviewable
copy; pgvector holds what the bot actually reads. **They drift the moment you edit the
file** — re-run the ingest after every change.

## Database

Everything lives in a dedicated **`interview` schema** on the `automationhub-rag-demo`
Supabase project (ref `swbstiudmouiyvwrrlyr`) — the same database the `Demo - Postgres
account` n8n credential connects to. Already applied as migration `interview_bot_schema`;
`interview-schema.sql` is the reviewable copy.

| Object | Purpose |
|---|---|
| `interview.chunks` | Embedded KB chunks (`extensions.vector(768)`) |
| `interview.match_chunks(embedding, count)` | Cosine similarity retrieval |
| `interview.rate_limits` | Per-IP-hash request log |
| `interview.check_rate_limit(key, hash, hours)` | Rolling-window counter |

The schema owns its own rate limiter rather than sharing one. Two reasons: re-ingesting
the resume can never touch another demo's data, and the shared `public.check_rate_limit()`
the other demos used **no longer exists in this database** (see the warning below).

The schema is not in PostgREST's exposed list, so none of it is reachable through the
Supabase REST API — only n8n, over a direct Postgres connection.

## ⚠️ The rest of this database is empty

As of 2026-09-16 the `public` schema on this project has **zero tables and zero
functions**, and the `vector` extension was not installed. The Supabase migration ledger
still lists `enable_pgvector_and_rag_schema`, `rag_helper_functions`, and
`create_email_triage_feed` — so these objects existed once and are now gone.

That means `doc_chunks`, `match_doc_chunks`, `rate_limits`, `check_rate_limit`, and
`email_triage_feed` are all missing, which almost certainly means **the n8n-docs RAG chat
demo and the Email Triage live feed are both broken on the public site.** Rebuilding them
is separate work: the docs corpus needs a fresh ingestion run, and `email_triage_feed`
needs recreating with its RLS policy.

## Remaining setup

1. **Fix the ingest credential.** ⚠️ n8n auto-assigned `Demo - Supabase REST (rate limit)`
   to the KB Ingest Webhook's header auth — an unrelated credential it picked because it
   was the only `httpHeaderAuth` on the instance. Create a **new** Header Auth credential
   instead:

   - Name: `Interview KB Ingest Token`
   - Header name: `x-ingest-token`
   - Header value: any long random string

   Then select it on the KB Ingest Webhook node. Until you do, the ingest endpoint is
   gated by the Supabase key and `npm run kb:ingest` will get a 403.

2. **Activate both workflows.**

## Ingesting the KB

```bash
INTERVIEW_INGEST_TOKEN=<the header value from step 2> npm run kb:ingest
```

Truncates `interview.chunks` and re-inserts from scratch, so it is safe to re-run and
never leaves stale chunks behind. The truncate runs *before* chunking, not after — a
`DELETE` with `executeOnce` in the middle of the chain would collapse the per-chunk item
stream down to one item and only the first chunk would ever get embedded.

Chunking splits on `##` headings rather than a fixed character window — a resume section
is already a coherent unit, and a blind window would cut a role away from its own bullets.
`TODO` prompts are dropped (they are questions for you, not facts about you; embedding one
would let the bot retrieve a question as though it were an answer) while any answer typed
into the `>` quote beneath them is kept. The file preamble and the out-of-scope rules are
skipped, and a section that is still entirely TODOs is left out of the index rather than
indexed empty.

## Verified

Both workflows were executed against the live database on 2026-09-16:

- **Ingestion** turned a KB sample into 3 chunks, all with embeddings, in
  `interview.chunks` — sections `Positioning`, `Career timeline`, `Project deep-dives`.
  The all-TODO sections, the file preamble, and the out-of-scope rules were correctly
  excluded, matching the local chunker test exactly.
- **Query** ran the whole chain — rate check, embed, retrieve, prompt, Gemini, respond —
  confirmed by the row it wrote to `interview.rate_limits`.

`interview.chunks` currently holds 3 chunks from that partial test ingest. The first real
`npm run kb:ingest` truncates and replaces them.

## Known trade-offs

- **Retrieval is per-question, so follow-ups can miss.** Recent turns are passed to the
  model as conversation context, but only the current question is embedded. "What about
  the other one?" retrieves against those words alone. Fix if it bites: rewrite the
  question into a standalone query before embedding (one extra Gemini call).
- **Vector search over a short document is worse than sending all of it.** The KB is a
  few thousand words — small enough to fit in a prompt whole. Top-6 retrieval will
  occasionally miss on cross-cutting questions ("how has your approach changed over 15
  years?") that touch every section at once. This is the cost of doing real RAG here; it
  buys a working end-to-end pipeline that demonstrates the pattern on the site.
- **Two systems of record.** Edit the markdown, forget the ingest, and the bot answers
  from the old version with no error anywhere. `npm run kb:ingest` is not optional.
