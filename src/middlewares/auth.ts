import { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  cookieParser()(req, res, () => {
   const sessionId = req.cookies['connect.sid'];


    if (!sessionId) {
      res.status(401).json({ error: 'Unauthorized: Please log in' });
      return;
    }

    // Set the session ID in req.session.userId
    req.session.userId = sessionId;

    next();
  });
};