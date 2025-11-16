"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
const cookieOptionsBase = {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
};
function getCookieOptions() {
    const secure = (process.env.COOKIE_SECURE || 'false') === 'true';
    return { ...cookieOptionsBase, secure };
}
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body || {};
        if (!name || !email || !password)
            return res.status(400).json({ message: 'Missing fields' });
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing)
            return res.status(409).json({ message: 'Email already registered' });
        const hashed = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, password: hashed },
            select: { id: true, name: true, email: true, createdAt: true },
        });
        return res.status(201).json({ user });
    }
    catch (e) {
        console.log('Signup error', e);
        return res.status(500).json({ message: 'Server error' });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body || {};
        // console.log(email,password)
        if (!email || !password)
            return res.status(400).json({ message: 'Email and password are required' });
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user)
            return res.status(401).json({ message: 'Invalid credentials' });
        const ok = await bcryptjs_1.default.compare(password, user.password);
        if (!ok)
            return res.status(401).json({ message: 'Invalid credentials' });
        const secret = process.env.AUTH_SECRET || 'secret';
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, secret, { expiresIn: '7d' });
        console.log(token);
        res.cookie('token', token, getCookieOptions());
        return res.status(200).json({
            user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt },
            token,
        });
    }
    catch (e) {
        console.error('Login error', e);
        return res.status(500).json({ message: 'Server error' });
    }
});
router.post('/logout', async (_req, res) => {
    res.cookie('token', '', { ...getCookieOptions(), maxAge: 0 });
    return res.status(200).json({ ok: true });
});
exports.default = router;
