import { Response } from "express";
import { ApiResponse } from "../types";

export const sendSuccess = <T>(
    res: Response,
    statusCode: number,
    message: string,
    data?: T
): Response => {
    const response: ApiResponse<T> = {
        success: true,
        message,
    };

    if (data !== undefined) {
        response.data = data;
    }

    return res.status(statusCode).json(response);
};

export const sendError = (
    res: Response,
    statusCode: number,
    message: string,
    errors?: string,
): Response => {
     const response: ApiResponse = {
        success: false,
        message,
        errors: errors || message,
    }
    return res.status(statusCode).json(response);
}