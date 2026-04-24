import { validateRequest } from '../../middleware/validation.middleware';

export const createBookingValidation = validateRequest({
  customer_id: {
    required: true,
    type: 'number',
  },
  vehicle_id: {
    required: true,
    type: 'number',
  },
  rent_start_date: {
    required: true,
    type: 'string',
  },
  rent_end_date: {
    required: true,
    type: 'string',
  },
});

export const updateBookingValidation = validateRequest({
  status: {
    required: true,
    type: 'string',
    enum: ['active', 'cancelled', 'returned'],
  },
});