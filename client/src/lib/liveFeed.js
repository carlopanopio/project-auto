// Read-only client for the public email-triage live feed (PROJ-57). Polls Supabase's
// PostgREST endpoint directly from the browser using the anon key — that key is scoped
// by Row Level Security to SELECT-only on this one table, so shipping it client-side is
// as safe as the other public demo endpoints in this folder (n8n.js, AirtableEmbed).

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://swbstiudmouiyvwrrlyr.supabase.co';
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3YnN0aXVkbW91aXl2d3JybHlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5ODQzMDAsImV4cCI6MjEwMjU2MDMwMH0.0XYYH2YOKC0mnbhfClRwTcIlS6BEnAQFWyC_4ygjRs0';

export async function fetchEmailTriageFeed(limit = 8) {
  const url = `${SUPABASE_URL}/rest/v1/email_triage_feed?select=category,priority,summary,created_at&order=created_at.desc&limit=${limit}`;
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`Failed to load live feed (${res.status}).`);
  return res.json();
}
