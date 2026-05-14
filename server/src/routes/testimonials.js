import { Router } from 'express';
import { z } from 'zod';
import pool from '../db/index.js';
import { verifyJWT } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { publicLimit } from '../middleware/rateLimiter.js';

const router = Router();

const testimonialSchema = z.object({
  client_name: z.string().min(1).max(100),
  client_title: z.string().max(150).optional().default(''),
  body: z.string().min(10).max(1000),
  rating: z.number().int().min(1).max(5).optional().default(5),
  published: z.boolean().optional().default(true),
});

router.get('/', publicLimit, async (_req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM testimonials WHERE published = true ORDER BY id ASC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/all', verifyJWT, async (_req, res) => {
  const { rows } = await pool.query('SELECT * FROM testimonials ORDER BY id ASC');
  res.json(rows);
});

router.post('/', verifyJWT, validate(testimonialSchema), async (req, res) => {
  const { client_name, client_title, body, rating, published } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO testimonials (client_name, client_title, body, rating, published)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [client_name, client_title, body, rating, published]
  );
  res.status(201).json(rows[0]);
});

router.put('/:id', verifyJWT, validate(testimonialSchema), async (req, res) => {
  const { client_name, client_title, body, rating, published } = req.body;
  const { rows } = await pool.query(
    `UPDATE testimonials SET client_name=$1,client_title=$2,body=$3,rating=$4,published=$5
     WHERE id=$6 RETURNING *`,
    [client_name, client_title, body, rating, published, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

router.delete('/:id', verifyJWT, async (req, res) => {
  await pool.query('DELETE FROM testimonials WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

export default router;
