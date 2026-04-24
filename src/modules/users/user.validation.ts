import { validateRequest } from '../../middleware/validation.middleware';

export const updateUserValidation = validateRequest({
  name: {
    required: false,
    type: 'string',
    minLength: 2,
  },
  email: {
    required: false,
    type: 'string',
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  phone: {
    required: false,
    type: 'string',
  },
  role: {
    required: false,
    type: 'string',
    enum: ['customer', 'admin'],
  },
});