import { Router } from 'express';
import { BookingController } from './booking.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { createBookingValidation, updateBookingValidation } from './booking.validation';

const router = Router();
const bookingController = new BookingController();

router.post(
  '/',
  authenticate,
  createBookingValidation,
  (req, res) => bookingController.createBooking(req, res)
);

router.get(
  '/',
  authenticate,
  (req, res) => bookingController.getAllBookings(req, res)
);

router.put(
  '/:bookingId',
  authenticate,
  updateBookingValidation,
  (req, res) => bookingController.updateBooking(req, res)
);

export default router;