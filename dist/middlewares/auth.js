"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const requireAuth = (req, res, next) => {
    (0, cookie_parser_1.default)()(req, res, () => {
        const sessionId = req.cookies['connect.sid'];
        console.log(sessionId, "fffff");
        if (!sessionId) {
            res.status(401).json({ error: 'Unauthorized: Please log in' });
            return;
        }
        // Set the session ID in req.session.userId
        req.session.userId = sessionId;
        next();
    });
};
exports.requireAuth = requireAuth;
