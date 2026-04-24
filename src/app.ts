import express, {Application} from 'express'; 
import cors from 'cors';  
import authRoutes from './modules/auth/auth.routes';
import vehicleRoutes from './modules/vehicles/vehicle.routes';
import userRoutes from './modules/users/user.routes';
import bookingRoutes from './modules/bookings/booking.routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Health check
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: 'Vehicle rental system is running',
        version: '1.0.0',
    });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/bookings', bookingRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;