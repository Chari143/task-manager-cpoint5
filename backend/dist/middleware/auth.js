"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function requireAuth(req, res, next) {
    const token = req.cookies?.token || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : undefined);
    if (!token)
        return res.status(401).json({ message: 'Unauthorized' });
    try {
        const secret = process.env.AUTH_SECRET || 'dev_secret_change_me';
        const payload = jsonwebtoken_1.default.verify(token, secret);
        const id = Number(payload.userId);
        if (!id || Number.isNaN(id))
            return res.status(401).json({ message: 'Unauthorized' });
        req.userId = id;
        next();
    }
    catch (e) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}
