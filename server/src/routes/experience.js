import { Router } from 'express';
import { z } from 'zod';
import pool from '../db/index.js';
import { verifyJWT } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { publicLimit } from '../middleware/rateLimiter.js';

const router = Router();

const experienceSchema = z.object({
  role: z.string().min(1).max(150),
  company: z.string().max(150).optional().default(''),
  period: z.string().max(50).optional().default(''),
  bullets: z.array(z.string()).optional().default([]),
  sort_order: z.number().int().optional().default(0),
});

router.get('/', publicLimit, async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM experience ORDER BY sort_order ASC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/all', verifyJWT, async (_req, res) => {
  const { rows } = await pool.query('SELECT * FROM experience ORDER BY sort_order ASC');
  res.json(rows);
});

router.post('/', verifyJWT, validate(experienceSchema), async (req, res) => {
  const { role, company, period, bullets, sort_order } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO experience (role, company, period, bullets, sort_order)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [role, company, period, bullets, sort_order]
  );
  res.status(201).json(rows[0]);
});

router.put('/:id', verifyJWT, validate(experienceSchema), async (req, res) => {
  const { role, company, period, bullets, sort_order } = req.body;
  const { rows } = await pool.query(
    `UPDATE experience SET role=$1,company=$2,period=$3,bullets=$4,sort_order=$5
     WHERE id=$6 RETURNING *`,
    [role, company, period, bullets, sort_order, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

router.delete('/:id', verifyJWT, async (req, res) => {
  await pool.query('DELETE FROM experience WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

export default router;
