import { NextFunction, Request, Response } from "express";
import { sendError } from '../utils/response.utils';

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): Response => {
    console.error('Error:', err);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    return sendError(res, statusCode, message);
};

export const notFoundHandler = (
    req: Request,
    res: Response,
): Response => {
    return sendError(res, 404, `Route ${req.originalUrl} not found`);
}