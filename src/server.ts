import dotenv from 'dotenv';
import app from './app';
import pool from './config/database'

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

//Test database connection and start server
const startServer = async () => {
    try {
    // Test database connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection established');

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/`);
      console.log(`📍 API Base URL: http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();