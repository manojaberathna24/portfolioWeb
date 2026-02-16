import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import authMiddleware from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const DATA_PATH = path.join(__dirname, '..', 'data', 'portfolioData.json');
const UPLOADS_DIR = path.join(__dirname, '..', '..', 'public', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer config for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
        cb(null, uniqueName);
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp|svg|pdf/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        if (ext && mime) return cb(null, true);
        cb(new Error('Only image and PDF files are allowed'));
    }
});

// Helper: read data
const readData = () => {
    const raw = fs.readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(raw);
};

// Helper: write data
const writeData = (data) => {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
};

// GET /api/data — public, returns all portfolio data
router.get('/', (req, res) => {
    try {
        const data = readData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error reading data', error: error.message });
    }
});

// GET /api/data/:section — public, returns specific section
router.get('/:section', (req, res) => {
    try {
        const data = readData();
        const section = req.params.section;
        if (data[section] === undefined) {
            return res.status(404).json({ message: `Section "${section}" not found` });
        }
        res.json(data[section]);
    } catch (error) {
        res.status(500).json({ message: 'Error reading data', error: error.message });
    }
});

// PUT /api/data/:section — admin only, update a section
router.put('/:section', authMiddleware, (req, res) => {
    try {
        const data = readData();
        const section = req.params.section;
        if (data[section] === undefined) {
            return res.status(404).json({ message: `Section "${section}" not found` });
        }
        data[section] = req.body;
        writeData(data);
        res.json({ message: `Section "${section}" updated successfully`, data: data[section] });
    } catch (error) {
        res.status(500).json({ message: 'Error updating data', error: error.message });
    }
});

// POST /api/upload — admin only, upload image
router.post('/upload', authMiddleware, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const filePath = `/uploads/${req.file.filename}`;
    res.json({ message: 'File uploaded successfully', filePath, filename: req.file.filename });
});

// POST /api/upload/multiple — admin only, upload multiple images
router.post('/upload/multiple', authMiddleware, upload.array('images', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
    }
    const files = req.files.map(f => ({
        filePath: `/uploads/${f.filename}`,
        filename: f.filename
    }));
    res.json({ message: 'Files uploaded successfully', files });
});

// DELETE /api/upload/:filename — admin only, delete uploaded file
router.delete('/upload/:filename', authMiddleware, (req, res) => {
    const filePath = path.join(UPLOADS_DIR, req.params.filename);
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.json({ message: 'File deleted successfully' });
        } else {
            res.status(404).json({ message: 'File not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting file', error: error.message });
    }
});

export default router;
