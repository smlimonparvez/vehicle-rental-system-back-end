import { NextFunction, Response } from "express";
import { AuthRequest } from '../types';
import { verifyToken } from '../utils/jwt.utils';
import { sendError } from '../utils/response.utils';

export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
): void | Response => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith('Bearer ')) {
            return sendError(res, 401, 'Authentication token required');
        }

        const token = authHeader.substring(7);
        const decoded = verifyToken(token);
        
        req.user = decoded;
        next();
    } catch (error) {
        return sendError(res, 401, 'Invalid or expired token');
    }
};

export const authorize = (...roles: string[]) => {
return(req: AuthRequest, res: Response, next: NextFunction): void | Response => {
   if (!req.user) {
      return sendError(res, 401, 'Authentication required');
    }

    if (!roles.includes(req.user.role)) {
      return sendError(res, 403, 'Access denied. Insufficient permissions');
    }
    next();
};
};