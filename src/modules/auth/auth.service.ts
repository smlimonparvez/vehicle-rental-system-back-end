import bcrypt from 'bcrypt';
import pool from '../../config/database';
import { SignupRequest, SigninRequest, User } from '../../types';
import { generateToken } from '../../utils/jwt.utils';

export class AuthService {
  async signup(data: SignupRequest): Promise<Omit<User, 'password'>> {
    const { name, email, password, phone, role = 'customer' } = data;

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await pool.query(
      `INSERT INTO users (name, email, password, phone, role) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, name, email, phone, role`,
      [name, email.toLowerCase(), hashedPassword, phone, role]
    );

    return result.rows[0];
  }

  async signin(data: SigninRequest): Promise<{ token: string; user: Omit<User, 'password'> }> {
    const { email, password } = data;

    // Find user by email
    const result = await pool.query(
      'SELECT id, name, email, password, phone, role FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      throw new Error('Invalid email or password');
    }

    const user = result.rows[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Return token and user info (without password)
    const { password: _, ...userWithoutPassword } = user;

    return {
      token,
      user: userWithoutPassword,
    };
  }
}