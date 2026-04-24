import { Response } from 'express';
import { AuthRequest } from '../../types';
import {BookingService} from './booking.service';
import { sendError, sendSuccess } from '../../utils/response.utils';

const bookingService = new BookingService();

export class BookingController {
    async createBooking(req: AuthRequest, res: Response): Promise<Response> {
        try {
            const booking = await bookingService.createBooking(req.body);
            return sendSuccess(res, 201, 'Booking created successfully', booking);
     } catch (error: any) {
      return sendError(res, 400, error.message);
     }    
    }

    async getAllBookings(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const user = req.user!;
      const bookings = await bookingService.getAllBookings(user.id, user.role);
      
      const message = user.role === 'admin' 
        ? 'Bookings retrieved successfully' 
        : 'Your bookings retrieved successfully';
      
      return sendSuccess(res, 200, message, bookings);
    } catch (error: any) {
      return sendError(res, 500, error.message);
    }
  }

  async updateBooking(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const bookingId = parseInt(req.params.bookingId as string, 10);
      const { status } = req.body;
      const user = req.user!;

      if (!status) {
        return sendError(res, 400, 'Status is required');
      }

      const booking = await bookingService.updateBooking(bookingId, status, user.id, user.role);
      
      let message = 'Booking updated successfully';
      if (status === 'cancelled') {
        message = 'Booking cancelled successfully';
      } else if (status === 'returned') {
        message = 'Booking marked as returned. Vehicle is now available';
      }

      return sendSuccess(res, 200, message, booking);
    } catch (error: any) {
      const statusCode = error.message === 'Booking not found' ? 404 : 
                         error.message.includes('Access denied') ? 403 : 400;
      return sendError(res, statusCode, error.message);
    }
  }
}