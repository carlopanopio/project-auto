import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

import authRoutes from './routes/auth.js';
import contactRoutes from './routes/contact.js';
import servicesRoutes from './routes/services.js';
import projectsRoutes from './routes/projects.js';
import experienceRoutes from './routes/experience.js';
import testimonialsRoutes from './routes/testimonials.js';
import certificationsRoutes from './routes/certifications.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === 'production';

// Security headers
app.use(helmet({
  contentSecurityPolicy: isProd ? undefined : false,
}));

// CORS
app.use(cors({
  origin: isProd ? process.env.CLIENT_URL : ['http://localhost:5173', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '16kb' }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/certifications', certificationsRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// Serve React build in production
if (isProd) {
  const clientBuild = join(__dirname, '../../client/dist');
  if (existsSync(clientBuild)) {
    app.use(express.static(clientBuild));
    app.get('*', (_req, res) => {
      res.sendFile(join(clientBuild, 'index.html'));
    });
  }
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});
