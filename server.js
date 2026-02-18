import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import authRoutes from './server/routes/auth.js';
import dataRoutes from './server/routes/data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);

// Serve static React build files in production
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Also serve public folder assets (profile images, project images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// SPA fallback - all non-API routes serve index.html
app.get('*', (req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(200).send('Portfolio API server running. Build the frontend with: npm run build');
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Portfolio server running on http://localhost:${PORT}`);
    console.log(`📊 API available at http://localhost:${PORT}/api/data`);
    console.log(`🔐 Admin panel at http://localhost:${PORT}/admin`);
});
