import { Request } from 'express';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'admin' | 'customer';
  created_at?: Date;
}

export interface Vehicle {
  id: number;
  vehicle_name: string;
  type: 'car' | 'bike' | 'van' | 'SUV';
  registration_number: string;
  daily_rent_price: number;
  availability_status: 'available' | 'booked';
  created_at?: Date;
}

export interface Booking {
  id: number;
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
  total_price: number;
  status: 'active' | 'cancelled' | 'returned';
  created_at?: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: 'admin' | 'customer';
  };
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: 'customer' | 'admin';
}

export interface SigninRequest {
  email: string;
  password: string;
}

export interface JWTPayload {
  id: number;
  email: string;
  role: 'admin' | 'customer';
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string;
}