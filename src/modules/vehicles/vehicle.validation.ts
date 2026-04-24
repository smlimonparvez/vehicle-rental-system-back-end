import { validateRequest } from '../../middleware/validation.middleware';

export const createVehicleValidation = validateRequest({
  vehicle_name: {
    required: true,
    type: 'string',
    minLength: 2,
  },
  type: {
    required: true,
    type: 'string',
    enum: ['car', 'bike', 'van', 'SUV'],
  },
  registration_number: {
    required: true,
    type: 'string',
  },
  daily_rent_price: {
    required: true,
    type: 'number',
    min: 0,
  },
  availability_status: {
    required: true,
    type: 'string',
    enum: ['available', 'booked'],
  },
});

export const updateVehicleValidation = validateRequest({
  vehicle_name: {
    required: false,
    type: 'string',
    minLength: 2,
  },
  type: {
    required: false,
    type: 'string',
    enum: ['car', 'bike', 'van', 'SUV'],
  },
  registration_number: {
    required: false,
    type: 'string',
  },
  daily_rent_price: {
    required: false,
    type: 'number',
    min: 0,
  },
  availability_status: {
    required: false,
    type: 'string',
    enum: ['available', 'booked'],
  },
});