import pool from '../../config/database';
import { Vehicle } from '../../types';

export class VehicleService {
  async createVehicle(data: Omit<Vehicle, 'id'>): Promise<Vehicle> {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = data;

    // Check if registration number already exists
    const existing = await pool.query(
      'SELECT id FROM vehicles WHERE registration_number = $1',
      [registration_number]
    );

    if (existing.rows.length > 0) {
      throw new Error('Vehicle with this registration number already exists');
    }

    const result = await pool.query(
      `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [vehicle_name, type, registration_number, daily_rent_price, availability_status]
    );

    return result.rows[0];
  }

  async getAllVehicles(): Promise<Vehicle[]> {
    const result = await pool.query('SELECT * FROM vehicles ORDER BY id');
    return result.rows;
  }

  async getVehicleById(id: number): Promise<Vehicle | null> {
    const result = await pool.query('SELECT * FROM vehicles WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async updateVehicle(id: number, data: Partial<Omit<Vehicle, 'id'>>): Promise<Vehicle> {
    const vehicle = await this.getVehicleById(id);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    // Check registration number uniqueness if being updated
    if (data.registration_number && data.registration_number !== vehicle.registration_number) {
      const existing = await pool.query(
        'SELECT id FROM vehicles WHERE registration_number = $1 AND id != $2',
        [data.registration_number, id]
      );

      if (existing.rows.length > 0) {
        throw new Error('Vehicle with this registration number already exists');
      }
    }

    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (fields.length === 0) {
      return vehicle;
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE vehicles SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0];
  }

  async deleteVehicle(id: number): Promise<void> {
    const vehicle = await this.getVehicleById(id);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    // Check for active bookings
    const activeBookings = await pool.query(
      'SELECT id FROM bookings WHERE vehicle_id = $1 AND status = $2',
      [id, 'active']
    );

    if (activeBookings.rows.length > 0) {
      throw new Error('Cannot delete vehicle with active bookings');
    }

    await pool.query('DELETE FROM vehicles WHERE id = $1', [id]);
  }
}