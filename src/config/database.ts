import { Pool, Client } from "pg";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

// Dtabase connection URL
const dbConfige = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
};

// Create the main connection pool for the application
const pool = new Pool(dbConfige);

// Flag to track if setup has been run
let setupCompleted = false;

pool.on("connect", () => {
  console.log("✅ Connected to Neon Database successfully");

  // Auto-run setup only once when first connected
  if (!setupCompleted) {
    setupDatabase().catch(console.error);
  }
});

pool.on("error", (err) => {
  console.error("❌ Neon Database connection error:", err);
});

// Database setup function
const setupDatabase = async (): Promise<void> => {
  const client = new Client(dbConfige);

  try {
    console.log("🔄 Checking database setup...");
    await client.connect();

    // Check if users table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);

    const tableExist = tableCheck.rows[0].exists;

    if (!tableExist) {
      console.log("🔄 Setting up database tables...");

      // Drop existing tables if they exist (order matters due to foreign keys)
      await client.query(`
        DROP TABLE IF EXISTS bookings CASCADE;
        DROP TABLE IF EXISTS vehicles CASCADE;
        DROP TABLE IF EXISTS users CASCADE;
        `);

      // Create Users table
      await client.query(`
          CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          phone VARCHAR(50) NOT NULL,
          role VARCHAR(20) CHECK (role IN ('admin', 'customer')) NOT NULL DEFAULT 'customer',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
          `);
      console.log("✅ Users table created");

      // Create Vehicles table
      await client.query(`
        CREATE TABLE vehicles (
          id SERIAL PRIMARY KEY,
          vehicle_name VARCHAR(255) NOT NULL,
          type VARCHAR(50) CHECK (type IN ('car', 'bike', 'van', 'SUV')) NOT NULL,
          registration_number VARCHAR(100) UNIQUE NOT NULL,
          daily_rent_price DECIMAL(10, 2) CHECK (daily_rent_price > 0) NOT NULL,
          availability_status VARCHAR(20) CHECK (availability_status IN ('available', 'booked')) NOT NULL DEFAULT 'available',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log("✅ Vehicles table created");

      // Create Bookings table
      await client.query(`
        CREATE TABLE bookings (
          id SERIAL PRIMARY KEY,
          customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
          vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
          rent_start_date DATE NOT NULL,
          rent_end_date DATE NOT NULL CHECK (rent_end_date > rent_start_date),
          total_price DECIMAL(10, 2) CHECK (total_price > 0) NOT NULL,
          status VARCHAR(20) CHECK (status IN ('active', 'cancelled', 'returned')) NOT NULL DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log("✅ Bookings table created");

      // Create indexes
      await client.query(`
        CREATE INDEX idx_users_email ON users(email);
        CREATE INDEX idx_vehicles_registration ON vehicles(registration_number);
        CREATE INDEX idx_bookings_customer ON bookings(customer_id);
        CREATE INDEX idx_bookings_vehicle ON bookings(vehicle_id);
        CREATE INDEX idx_bookings_status ON bookings(status);
      `);
      console.log("✅ Indexes created");

      // Insert default admin user
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await client.query(
        `
        INSERT INTO users (name, email, password, phone, role) 
        VALUES ($1, $2, $3, $4, $5)
      `,
        [
          "Admin User",
          "admin@vehiclerental.com",
          hashedPassword,
          "+8801712345678",
          "admin",
        ],
      );
      console.log("✅ Default admin user created");
      // console.log("   📧 Email: admin@vehiclerental.com");
      // console.log("   🔑 Password: admin123");
      console.log("Database setup completed");
      setupCompleted = true;
    } else {
      console.log('✅ Database already set up, skipping initialization');
    }

  } catch (error) {
    console.error("❌ Database setup error:", error);
  } finally {
    await client.end();
  }
};

export default pool;

// Optional
export const manualSetup = setupDatabase;
