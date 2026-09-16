-- Interview bot RAG storage. Run once against the same Postgres/Supabase instance the
-- other demos use (n8n credential: "Demo - Postgres account").
--
-- Deliberately separate from the doc_chunks table behind the n8n-docs demo: different
-- corpus, different lifecycle, and re-ingesting the resume must never touch the docs.

create extension if not exists vector;

create table if not exists interview_chunks (
  id          bigserial primary key,
  section     text        not null,          -- KB heading the chunk came from, shown as the source pill
  content     text        not null,
  embedding   vector(768) not null,          -- gemini-embedding-001 at outputDimensionality 768
  created_at  timestamptz not null default now()
);

-- Ingestion truncates and re-inserts, so the index is rebuilt rarely and read constantly.
create index if not exists interview_chunks_embedding_idx
  on interview_chunks using ivfflat (embedding vector_cosine_ops) with (lists = 8);

-- Mirrors match_doc_chunks, minus the source_url column (the KB has no per-chunk URL).
create or replace function match_interview_chunks(query_embedding vector(768), match_count int)
returns table (id bigint, section text, content text, similarity float)
language sql stable
as $$
  select
    c.id,
    c.section,
    c.content,
    1 - (c.embedding <=> query_embedding) as similarity
  from interview_chunks c
  order by c.embedding <=> query_embedding
  limit match_count;
$$;
