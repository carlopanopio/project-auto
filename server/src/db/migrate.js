import 'dotenv/config';
import pool from './index.js';

const sql = `
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INT DEFAULT 0,
  published BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  results TEXT,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS experience (
  id SERIAL PRIMARY KEY,
  role TEXT NOT NULL,
  company TEXT,
  period TEXT,
  bullets TEXT[] DEFAULT '{}',
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_title TEXT,
  body TEXT NOT NULL,
  rating INT DEFAULT 5,
  published BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  message TEXT NOT NULL,
  ghl_synced BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS certifications (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  provider TEXT NOT NULL,
  issued_date TEXT,
  sort_order INT DEFAULT 0,
  published BOOLEAN DEFAULT true
);
`;

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query(sql);
    console.log('Migration complete.');
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
