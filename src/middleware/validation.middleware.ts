import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.utils';

type ValidationSchema = {
  [key: string]: {
    required?: boolean;
    type?: string;
    minLength?: number;
    pattern?: RegExp;
    enum?: string[];
    min?: number;
  };
};

export const validateRequest = (schema: ValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction): void | Response => {
    const errors: string[] = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = req.body[field];

      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`${field} is required`);
        continue;
      }

      if (value !== undefined && value !== null && value !== '') {
        if (rules.type && typeof value !== rules.type) {
          errors.push(`${field} must be of type ${rules.type}`);
        }

        if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
          errors.push(`${field} must be at least ${rules.minLength} characters`);
        }

        if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
          errors.push(`${field} format is invalid`);
        }

        if (rules.enum && !rules.enum.includes(value)) {
          errors.push(`${field} must be one of: ${rules.enum.join(', ')}`);
        }

        if (rules.min !== undefined && typeof value === 'number' && value < rules.min) {
          errors.push(`${field} must be at least ${rules.min}`);
        }
      }
    }

    if (errors.length > 0) {
      return sendError(res, 400, 'Validation failed', errors.join('; '));
    }

    next();
  };
};