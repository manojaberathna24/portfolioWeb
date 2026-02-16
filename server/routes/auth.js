import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
    const { password } = req.body;
    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }
    if (password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ message: 'Invalid password' });
    }
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, message: 'Login successful' });
});

// GET /api/auth/verify
router.get('/verify', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ valid: false });
    }
    try {
        jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
        res.json({ valid: true });
    } catch {
        res.status(401).json({ valid: false });
    }
});

export default router;
