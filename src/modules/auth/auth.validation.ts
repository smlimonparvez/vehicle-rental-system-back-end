import { validateRequest } from '../../middleware/validation.middleware';

export const signupValidation = validateRequest({
  name: {
    required: true,
    type: 'string',
    minLength: 2,
  },
  email: {
    required: true,
    type: 'string',
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    required: true,
    type: 'string',
    minLength: 6,
  },
  phone: {
    required: true,
    type: 'string',
  },
  role: {
    required: false,
    type: 'string',
    enum: ['customer', 'admin'],
  },
});

export const signinValidation = validateRequest({
  email: {
    required: true,
    type: 'string',
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    required: true,
    type: 'string',
  },
});