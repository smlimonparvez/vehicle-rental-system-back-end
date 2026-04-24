import pool from "../../config/database";
import { User } from "../../types";

export class UserService {
  async getAllUsers(): Promise<Omit<User, "password">[]> {
    const result = await pool.query(
      "SELECT id, name, email, phone, role, created_at FROM users ORDER BY id",
    );
    return result.rows;
  }

  async getUserById(id: number): Promise<Omit<User, "password"> | null> {
    const result = await pool.query(
      "SELECT id, name, email, phone, role, created_at FROM users WHERE id = $1",
      [id],
    );
    return result.rows[0] || null;
  }

  async updateUser(
    id: number,
    data: Partial<Omit<User, "id" | "password">>,
  ): Promise<Omit<User, "password">> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new Error("User not found");
    }

    // Check email uniqueness if being updated
    if (data.email && data.email !== user.email) {
      const existing = await pool.query(
        "SELECT id FROM users WHERE email = $1 AND id != $2",
        [data.email.toLowerCase(), id],
      );

      if (existing.rows.length > 0) {
        throw new Error("User with this email already exists");
      }
    }

    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(data)) {
      //   if (value !== undefined) {
      //     if (key === 'email') {
      //       fields.push(`${key} = $${paramCount}`);
      //       values.push(value.toLowerCase());
      if (key === "email") {
        if (typeof value !== "string") {
          throw new Error("Invalid email format");
        }
        fields.push(`${key} = $${paramCount}`);
        values.push(value.toLowerCase());
      } else {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
      }
      paramCount++;
    }

    if (fields.length === 0) {
      return user;
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE users SET ${fields.join(", ")} WHERE id = $${paramCount} 
       RETURNING id, name, email, phone, role, created_at`,
      values,
    );

    return result.rows[0];
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new Error("User not found");
    }

    // Check for active bookings
    const activeBookings = await pool.query(
      "SELECT id FROM bookings WHERE customer_id = $1 AND status = $2",
      [id, "active"],
    );

    if (activeBookings.rows.length > 0) {
      throw new Error("Cannot delete user with active bookings");
    }

    await pool.query("DELETE FROM users WHERE id = $1", [id]);
  }
}
