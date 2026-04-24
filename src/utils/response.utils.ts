import { Response } from "express";
import { ApiResponse } from "../types";

export const sendSuccess = <T>(
    res: Response,
    statudCode: number,
    message: string,
    data?: T
): Response => {
    const response: ApiResponse<T> = {
        success: true,
        message,
        // ...(data !== undefined && { data }),
        data,
    }
    return res.status(statudCode).json(response);
};

export const sendError = (
    res: Response,
    statudCode: number,
    message: string,
    errors?: string,
): Response => {
     const response: ApiResponse = {
        success: true,
        message,
        errors: errors || message,
    }
    return res.status(statudCode).json(response);
}