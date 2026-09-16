-- Interview bot storage, isolated in its own `interview` schema.
--
-- Applied to the automationhub-rag-demo Supabase project (ref swbstiudmouiyvwrrlyr)
-- as migration `interview_bot_schema`. Kept here so the schema is reviewable in git.
--
-- Everything the bot needs lives in this schema, including its own rate limiter. Two
-- reasons: re-ingesting the resume can never touch another demo's data, and the shared
-- public.check_rate_limit() the other demos relied on no longer exists in this database.
--
-- The schema is not in PostgREST's exposed list, so none of this is reachable through
-- the Supabase REST API — only the n8n workflows, over a direct Postgres connection.

create schema if not exists interview;

create extension if not exists vector with schema extensions;

create table if not exists interview.chunks (
  id          bigserial primary key,
  section     text        not null,
  content     text        not null,
  embedding   extensions.vector(768) not null,   -- gemini-embedding-001 @ outputDimensionality 768
  created_at  timestamptz not null default now()
);

-- Deliberately no ivfflat/hnsw index. The corpus is a few dozen chunks at most, where a
-- sequential scan costs microseconds -- and an ivfflat index built on an empty table has
-- no centroids to probe, which silently returns zero rows until it is rebuilt. Add one
-- only if this ever grows past a few thousand chunks.

create table if not exists interview.rate_limits (
  id          bigserial primary key,
  demo_key    text        not null,
  ip_hash     text        not null,
  created_at  timestamptz not null default now()
);

create index if not exists rate_limits_lookup_idx
  on interview.rate_limits (demo_key, ip_hash, created_at desc);

-- Returns int, not bigint: the n8n Postgres node renders BIGINT as text by default, which
-- would turn the IF node's numeric comparison into a string comparison.
create or replace function interview.check_rate_limit(
  p_demo_key text,
  p_ip_hash text,
  p_window_hours int
)
returns table (current_count int)
language sql
stable
set search_path = interview, extensions, public
as $$
  select count(*)::int
  from interview.rate_limits
  where demo_key = p_demo_key
    and ip_hash = p_ip_hash
    and created_at > now() - make_interval(hours => p_window_hours);
$$;

create or replace function interview.match_chunks(
  query_embedding extensions.vector(768),
  match_count int
)
returns table (id bigint, section text, content text, similarity double precision)
language sql
stable
set search_path = interview, extensions, public
as $$
  select
    c.id,
    c.section,
    c.content,
    (1 - (c.embedding <=> query_embedding))::double precision as similarity
  from interview.chunks c
  order by c.embedding <=> query_embedding
  limit match_count;
$$;

grant usage on schema interview to postgres, service_role;
grant all on all tables in schema interview to postgres, service_role;
grant all on all sequences in schema interview to postgres, service_role;
grant execute on all functions in schema interview to postgres, service_role;
