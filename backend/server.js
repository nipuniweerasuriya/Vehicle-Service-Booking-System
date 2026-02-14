import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import bookingRoutes from './routes/bookings.js';
import serviceRoutes from './routes/services.js';
import User from './models/User.js';
import Service from './models/Service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/services', serviceRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

const initializeData = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@vehiclecare.com' });
    if (!adminExists) {
      await User.create({
        username: 'admin',
        email: 'admin@vehiclecare.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('Default admin user created');
    }

    const servicesCount = await Service.countDocuments();
    if (servicesCount === 0) {
      const defaultServices = [
        { name: 'Regular Maintenance', description: 'Complete vehicle check and maintenance', price: '$99', icon: 'Wrench' },
        { name: 'Oil Change', description: 'Engine oil and filter replacement', price: '$49', icon: 'Droplet' },
        { name: 'Brake Check', description: 'Brake pad inspection and service', price: '$79', icon: 'Zap' },
        { name: 'Tire Rotation', description: 'Tire balancing and rotation', price: '$69', icon: 'Disc3' },
        { name: 'Battery Service', description: 'Battery check and replacement', price: '$89', icon: 'Battery' },
        { name: 'AC Service', description: 'Air conditioning refill and maintenance', price: '$129', icon: 'Wind' },
      ];
      await Service.insertMany(defaultServices);
      console.log('Default services created');
    }
  } catch (error) {
    console.error('Error initializing data:', error.message);
  }
};

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initializeData();
});
