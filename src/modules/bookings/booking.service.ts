import pool from '../../config/database';
import { Booking } from '../../types';

export class BookingService {
  async createBooking(data: Omit<Booking, 'id' | 'status' | 'total_price'>): Promise<any> {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = data;

    // Check if vehicle exists and is available
    const vehicleResult = await pool.query(
      'SELECT id, vehicle_name, daily_rent_price, availability_status FROM vehicles WHERE id = $1',
      [vehicle_id]
    );

    if (vehicleResult.rows.length === 0) {
      throw new Error('Vehicle not found');
    }

    const vehicle = vehicleResult.rows[0];

    if (vehicle.availability_status !== 'available') {
      throw new Error('Vehicle is not available for booking');
    }

    // Calculate total price
    const startDate = new Date(rent_start_date);
    const endDate = new Date(rent_end_date);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    if (days <= 0) {
      throw new Error('End date must be after start date');
    }

    const totalPrice = vehicle.daily_rent_price * days;

    // Start transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Create booking
      const bookingResult = await client.query(
        `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice, 'active']
      );

      // Update vehicle status to booked
      await client.query(
        'UPDATE vehicles SET availability_status = $1 WHERE id = $2',
        ['booked', vehicle_id]
      );

      await client.query('COMMIT');

      const booking = bookingResult.rows[0];
      return {
        ...booking,
        vehicle: {
          vehicle_name: vehicle.vehicle_name,
          daily_rent_price: vehicle.daily_rent_price,
        },
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getAllBookings(userId?: number, role?: string): Promise<any[]> {
    let query: string;
    let params: any[];

    if (role === 'admin') {
      query = `
        SELECT b.*, 
               u.name as customer_name, u.email as customer_email,
               v.vehicle_name, v.registration_number
        FROM bookings b
        JOIN users u ON b.customer_id = u.id
        JOIN vehicles v ON b.vehicle_id = v.id
        ORDER BY b.id DESC
      `;
      params = [];
    } else {
      query = `
        SELECT b.id, b.vehicle_id, b.rent_start_date, b.rent_end_date, 
               b.total_price, b.status,
               v.vehicle_name, v.registration_number, v.type
        FROM bookings b
        JOIN vehicles v ON b.vehicle_id = v.id
        WHERE b.customer_id = $1
        ORDER BY b.id DESC
      `;
      params = [userId];
    }

    const result = await pool.query(query, params);

    if (role === 'admin') {
      return result.rows.map((row) => ({
        id: row.id,
        customer_id: row.customer_id,
        vehicle_id: row.vehicle_id,
        rent_start_date: row.rent_start_date,
        rent_end_date: row.rent_end_date,
        total_price: row.total_price,
        status: row.status,
        customer: {
          name: row.customer_name,
          email: row.customer_email,
        },
        vehicle: {
          vehicle_name: row.vehicle_name,
          registration_number: row.registration_number,
        },
      }));
    } else {
      return result.rows.map((row) => ({
        id: row.id,
        vehicle_id: row.vehicle_id,
        rent_start_date: row.rent_start_date,
        rent_end_date: row.rent_end_date,
        total_price: row.total_price,
        status: row.status,
        vehicle: {
          vehicle_name: row.vehicle_name,
          registration_number: row.registration_number,
          type: row.type,
        },
      }));
    }
  }

  async updateBooking(bookingId: number, status: string, userId: number, role: string): Promise<any> {
    const bookingResult = await pool.query(
      'SELECT * FROM bookings WHERE id = $1',
      [bookingId]
    );

    if (bookingResult.rows.length === 0) {
      throw new Error('Booking not found');
    }

    const booking = bookingResult.rows[0];

    // Authorization check
    if (role === 'customer' && booking.customer_id !== userId) {
      throw new Error('Access denied. You can only update your own bookings');
    }

    // Business logic for status updates
    if (status === 'cancelled') {
      if (booking.status !== 'active') {
        throw new Error('Only active bookings can be cancelled');
      }

      if (role === 'customer') {
        const today = new Date();
        const startDate = new Date(booking.rent_start_date);
        if (startDate <= today) {
          throw new Error('Cannot cancel booking after start date');
        }
      }
    }

    if (status === 'returned' && role !== 'admin') {
      throw new Error('Only admin can mark bookings as returned');
    }

    // Start transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Update booking status
      const updateResult = await client.query(
        'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
        [status, bookingId]
      );

      // Update vehicle availability if booking is cancelled or returned
      if (status === 'cancelled' || status === 'returned') {
        await client.query(
          'UPDATE vehicles SET availability_status = $1 WHERE id = $2',
          ['available', booking.vehicle_id]
        );
      }

      await client.query('COMMIT');

      const updatedBooking = updateResult.rows[0];

      if (status === 'returned') {
        const vehicleResult = await pool.query(
          'SELECT availability_status FROM vehicles WHERE id = $1',
          [booking.vehicle_id]
        );
        return {
          ...updatedBooking,
          vehicle: { availability_status: vehicleResult.rows[0].availability_status },
        };
      }

      return updatedBooking;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}