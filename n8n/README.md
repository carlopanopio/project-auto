# Interview bot — n8n RAG

The "Ask me your interview questions" section on the site is backed entirely by n8n, the
same way the other live demos are. There is no server-side route: the browser posts
straight to the n8n webhook.

```
browser  ──POST /webhook/interview-chat──▶  n8n
                                            ├─ hash IP, check rate limit (Postgres)
                                            ├─ embed question  (gemini-embedding-001, 768d)
                                            ├─ match_interview_chunks (pgvector, top 6)
                                            ├─ generate answer (gemini-3.6-flash, grounded)
                                            └─ respond { answer, sources[] }
```

The knowledge base is `content/interview-kb.md` in this repo. Git holds the reviewable
copy; pgvector holds what the bot actually reads. **They drift the moment you edit the
file** — re-run the ingest after every change.

## Setup (once)

1. **Database.** Run `n8n/interview-rag-schema.sql` against the same Postgres/Supabase
   instance the other demos use (n8n credential `Demo - Postgres account`). It creates
   `interview_chunks` and `match_interview_chunks`, separate from the `doc_chunks` table
   behind the n8n-docs demo — re-ingesting the resume must never touch the docs corpus.

   It assumes the `rate_limits` table and `check_rate_limit()` function already exist,
   since both workflows reuse them with the demo key `interview-chat`.

2. **Import both workflows** into n8n:
   - `interview-rag-ingest.workflow.json` — KB ingestion
   - `interview-rag-query.workflow.json` — chat query

   Both reference the existing credential IDs (`Demo - Postgres account`,
   `Demo - Gemini API`), so they should bind on import. Confirm on each node anyway.

3. **Set `INTERVIEW_INGEST_TOKEN`** as an environment variable on the n8n instance, to
   any long random string. The ingest webhook is public; this header check is the only
   thing standing between it and anyone who guesses the URL. Use the same value locally
   when running the ingest.

4. **Activate both workflows.**

## Ingesting the KB

```bash
INTERVIEW_INGEST_TOKEN=... npm run kb:ingest
```

Truncates `interview_chunks` and re-inserts from scratch, so it is safe to re-run and
never leaves stale chunks behind.

Chunking splits on `##` headings rather than a fixed character window — a resume section
is already a coherent unit, and a blind window would cut a role away from its own bullets.
Lines marked `TODO` are dropped: they are questions for Carlo, not facts about him, and
embedding them would let the bot retrieve a question as though it were an answer. Sections
that are *only* TODOs are skipped entirely, so an unanswered section is simply absent from
the index rather than present and empty.

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
