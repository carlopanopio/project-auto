import { Router } from 'express';
import { z } from 'zod';
import pool from '../db/index.js';
import { verifyJWT } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { publicLimit } from '../middleware/rateLimiter.js';

const router = Router();

const serviceSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional().default(''),
  icon: z.string().max(50).optional().default(''),
  sort_order: z.number().int().optional().default(0),
  published: z.boolean().optional().default(true),
});

// Public
router.get('/', publicLimit, async (_req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM services WHERE published = true ORDER BY sort_order ASC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin CRUD
router.get('/all', verifyJWT, async (_req, res) => {
  const { rows } = await pool.query('SELECT * FROM services ORDER BY sort_order ASC');
  res.json(rows);
});

router.post('/', verifyJWT, validate(serviceSchema), async (req, res) => {
  const { title, description, icon, sort_order, published } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO services (title, description, icon, sort_order, published)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [title, description, icon, sort_order, published]
  );
  res.status(201).json(rows[0]);
});

router.put('/:id', verifyJWT, validate(serviceSchema), async (req, res) => {
  const { title, description, icon, sort_order, published } = req.body;
  const { rows } = await pool.query(
    `UPDATE services SET title=$1, description=$2, icon=$3, sort_order=$4, published=$5
     WHERE id=$6 RETURNING *`,
    [title, description, icon, sort_order, published, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

router.delete('/:id', verifyJWT, async (req, res) => {
  await pool.query('DELETE FROM services WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

export default router;
