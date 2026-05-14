import { Router } from 'express';
import { z } from 'zod';
import pool from '../db/index.js';
import { validate } from '../middleware/validate.js';
import { contactLimit } from '../middleware/rateLimiter.js';

const router = Router();

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  company: z.string().max(100).optional().default(''),
  message: z.string().min(10).max(2000),
});

async function syncToGHL(data) {
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!apiKey || !locationId) return false;

  const nameParts = data.name.trim().split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ') || '';

  const res = await fetch('https://services.leadconnectorhq.com/contacts/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      Version: '2021-07-28',
    },
    body: JSON.stringify({
      firstName,
      lastName,
      email: data.email,
      companyName: data.company || undefined,
      locationId,
      tags: ['website-inquiry'],
      customFields: [{ key: 'message', field_value: data.message }],
    }),
  });

  return res.ok;
}

router.post('/', contactLimit, validate(contactSchema), async (req, res) => {
  const { name, email, company, message } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO contacts (name, email, company, message) VALUES ($1, $2, $3, $4) RETURNING id`,
      [name, email, company, message]
    );
    const contactId = rows[0].id;

    let ghlSynced = false;
    try {
      ghlSynced = await syncToGHL({ name, email, company, message });
    } catch (ghlErr) {
      console.error('GHL sync failed (non-fatal):', ghlErr);
    }

    if (ghlSynced) {
      await pool.query('UPDATE contacts SET ghl_synced = true WHERE id = $1', [contactId]);
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Contact error:', err);
    res.status(500).json({ error: 'Failed to submit inquiry' });
  }
});

export default router;
