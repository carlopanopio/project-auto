import { Router } from 'express';
import { z } from 'zod';
import pool from '../db/index.js';
import { verifyJWT } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { publicLimit } from '../middleware/rateLimiter.js';

const router = Router();

const projectSchema = z.object({
  title: z.string().min(1).max(150),
  slug: z.string().min(1).max(150),
  description: z.string().max(1000).optional().default(''),
  tags: z.array(z.string()).optional().default([]),
  results: z.string().max(500).optional().default(''),
  image_url: z.string().url().optional().nullable(),
  sort_order: z.number().int().optional().default(0),
  published: z.boolean().optional().default(true),
});

// Public
router.get('/', publicLimit, async (_req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM projects WHERE published = true ORDER BY sort_order ASC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin CRUD
router.get('/all', verifyJWT, async (_req, res) => {
  const { rows } = await pool.query('SELECT * FROM projects ORDER BY sort_order ASC');
  res.json(rows);
});

router.post('/', verifyJWT, validate(projectSchema), async (req, res) => {
  const { title, slug, description, tags, results, image_url, sort_order, published } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO projects (title, slug, description, tags, results, image_url, sort_order, published)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [title, slug, description, tags, results, image_url, sort_order, published]
  );
  res.status(201).json(rows[0]);
});

router.put('/:id', verifyJWT, validate(projectSchema), async (req, res) => {
  const { title, slug, description, tags, results, image_url, sort_order, published } = req.body;
  const { rows } = await pool.query(
    `UPDATE projects SET title=$1,slug=$2,description=$3,tags=$4,results=$5,
     image_url=$6,sort_order=$7,published=$8 WHERE id=$9 RETURNING *`,
    [title, slug, description, tags, results, image_url, sort_order, published, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

router.delete('/:id', verifyJWT, async (req, res) => {
  await pool.query('DELETE FROM projects WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

export default router;
