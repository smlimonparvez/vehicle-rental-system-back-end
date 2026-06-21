# 🚗 Vehicle Rental System

A robust backend API system for managing vehicle rentals with comprehensive authentication, authorization, and booking management capabilities.

## 🌟 Features

### Core Functionality
- **User Management** - Registration, authentication, and role-based access control (Admin & Customer)
- **Vehicle Management** - CRUD operations for vehicle inventory with availability tracking
- **Booking System** - Complete rental workflow with automatic price calculation and status management
- **Secure Authentication** - JWT-based authentication with bcrypt password hashing

### Business Logic
- Automatic price calculation based on rental duration
- Real-time vehicle availability updates
- Role-based authorization (Admin and Customer)
- Booking status management (active, cancelled, returned)
- Constraint validation (prevent deletion of resources with active bookings)

## 🛠️ Technology Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT (jsonwebtoken) + bcrypt
- **Architecture:** Modular MVC pattern with service layer

## 📁 Project Structure

```
vehicle-rental-system/
├── src/
│   ├── config/
│   │   └── database.ts          # Database connection configuration
│   ├── modules/
│   │   ├── auth/                # Authentication module
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.validation.ts
│   │   ├── users/               # User management module
│   │   ├── vehicles/            # Vehicle management module
│   │   └── bookings/            # Booking management module
│   ├── middleware/
│   │   ├── auth.middleware.ts   # JWT authentication & authorization
│   │   ├── error.middleware.ts  # Global error handling
│   │   └── validation.middleware.ts
│   ├── utils/
│   │   ├── jwt.utils.ts         # JWT token utilities
│   │   └── response.utils.ts    # Standardized API responses
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   ├── app.ts                   # Express app configuration
│   └── server.ts                # Server entry point
├── database/
│   └── schema.sql               # Database schema
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/auth/signup` | Public | Register new user |
| POST | `/api/v1/auth/signin` | Public | Login and get JWT token |

### Vehicles
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/vehicles` | Admin | Create new vehicle |
| GET | `/api/v1/vehicles` | Public | Get all vehicles |
| GET | `/api/v1/vehicles/:vehicleId` | Public | Get vehicle by ID |
| PUT | `/api/v1/vehicles/:vehicleId` | Admin | Update vehicle |
| DELETE | `/api/v1/vehicles/:vehicleId` | Admin | Delete vehicle |

### Users
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/users` | Admin | Get all users |
| PUT | `/api/v1/users/:userId` | Admin/Own | Update user |
| DELETE | `/api/v1/users/:userId` | Admin | Delete user |

### Bookings
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/bookings` | Authenticated | Create booking |
| GET | `/api/v1/bookings` | Authenticated | Get bookings (filtered by role) |
| PUT | `/api/v1/bookings/:bookingId` | Authenticated | Update booking status |

## 🗄️ Database Schema

### Users Table
- `id` - Primary key (auto-increment)
- `name` - User's full name
- `email` - Unique email address
- `password` - Hashed password
- `phone` - Contact number
- `role` - 'admin' or 'customer'
- `created_at` - Timestamp

### Vehicles Table
- `id` - Primary key
- `vehicle_name` - Vehicle model name
- `type` - 'car', 'bike', 'van', or 'SUV'
- `registration_number` - Unique registration
- `daily_rent_price` - Rental price per day
- `availability_status` - 'available' or 'booked'
- `created_at` - Timestamp

### Bookings Table
- `id` - Primary key
- `customer_id` - Foreign key to users
- `vehicle_id` - Foreign key to vehicles
- `rent_start_date` - Booking start date
- `rent_end_date` - Booking end date
- `total_price` - Calculated total cost
- `status` - 'active', 'cancelled', or 'returned'
- `created_at` - Timestamp

## 🔒 Security Features

- Password hashing using bcrypt (10 rounds)
- JWT-based stateless authentication
- Role-based authorization middleware
- Input validation on all endpoints
- Protected routes with authentication checks
- SQL injection prevention using parameterized queries

## 🎯 Business Rules

1. **Vehicle Availability**: Automatically updated when bookings are created/completed
2. **Price Calculation**: `total_price = daily_rent_price × number_of_days`
3. **Deletion Protection**: Users and vehicles with active bookings cannot be deleted
4. **Booking Cancellation**: Customers can only cancel before start date
5. **Role Permissions**: 
   - Admins: Full system access
   - Customers: Limited to own profile and bookings

## 👤 Author

GitHub Profile - https://github.com/smlimonparvez

## 🔗 Live Link - https://vehicle-rental-system-back-end.vercel.app

## 🙏 Acknowledgments

- Express.js team for the excellent framework
- PostgreSQL for robust database management
- TypeScript for type safety and better developer experience