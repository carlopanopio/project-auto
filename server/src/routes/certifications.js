import { Router } from 'express';
import { z } from 'zod';
import pool from '../db/index.js';
import { verifyJWT } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { publicLimit } from '../middleware/rateLimiter.js';

const router = Router();

const certificationSchema = z.object({
  title: z.string().min(1).max(200),
  provider: z.string().min(1).max(100),
  issued_date: z.string().max(50).optional().nullable().default(null),
  sort_order: z.number().int().optional().default(0),
  published: z.boolean().optional().default(true),
});

router.get('/', publicLimit, async (_req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM certifications WHERE published = true ORDER BY sort_order ASC, id ASC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/all', verifyJWT, async (_req, res) => {
  const { rows } = await pool.query('SELECT * FROM certifications ORDER BY sort_order ASC, id ASC');
  res.json(rows);
});

router.post('/', verifyJWT, validate(certificationSchema), async (req, res) => {
  const { title, provider, issued_date, sort_order, published } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO certifications (title, provider, issued_date, sort_order, published)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [title, provider, issued_date, sort_order, published]
  );
  res.status(201).json(rows[0]);
});

router.put('/:id', verifyJWT, validate(certificationSchema), async (req, res) => {
  const { title, provider, issued_date, sort_order, published } = req.body;
  const { rows } = await pool.query(
    `UPDATE certifications
     SET title=$1, provider=$2, issued_date=$3, sort_order=$4, published=$5
     WHERE id=$6 RETURNING *`,
    [title, provider, issued_date, sort_order, published, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

router.delete('/:id', verifyJWT, async (req, res) => {
  await pool.query('DELETE FROM certifications WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

export default router;
