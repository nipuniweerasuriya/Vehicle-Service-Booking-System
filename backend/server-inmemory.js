import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: join(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database
const db = {
  users: [],
  bookings: [],
  services: [],
  bookingCounter: 0,
};

// Initialize default data
const initializeData = async () => {
  // Create default admin
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('admin123', salt);
  db.users.push({
    _id: '1',
    username: 'admin',
    email: 'admin@vehiclecare.com',
    password: hashedPassword,
    role: 'admin',
  });

  // Create default services
  db.services = [
    { _id: '1', name: 'Regular Maintenance', description: 'Complete vehicle check and maintenance', price: '$99', icon: 'Wrench' },
    { _id: '2', name: 'Oil Change', description: 'Engine oil and filter replacement', price: '$49', icon: 'Droplet' },
    { _id: '3', name: 'Brake Check', description: 'Brake pad inspection and service', price: '$79', icon: 'Zap' },
    { _id: '4', name: 'Tire Rotation', description: 'Tire balancing and rotation', price: '$69', icon: 'Disc3' },
    { _id: '5', name: 'Battery Service', description: 'Battery check and replacement', price: '$89', icon: 'Battery' },
    { _id: '6', name: 'AC Service', description: 'Air conditioning refill and maintenance', price: '$129', icon: 'Wind' },
  ];

  console.log('Default admin user and services created (in-memory)');
};

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// Auth Middleware
const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = db.users.find(u => u._id === decoded.id);
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized' });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// ============= AUTH ROUTES =============

// Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    
    // Check if user already exists
    const userExists = db.users.find(u => u.email === email);
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const user = {
      _id: String(db.users.length + 1),
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date().toISOString(),
    };
    
    db.users.push(user);
    
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = db.users.find(u => u.email === email);

    if (user && await bcrypt.compare(password, user.password)) {
      res.json({
        _id: user._id,
        name: user.name || user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user
app.get('/api/auth/me', protect, (req, res) => {
  const { password, ...user } = req.user;
  res.json(user);
});

// Admin Login (specific endpoint)
app.post('/api/auth/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = db.users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin credentials required.' });
    }

    if (await bcrypt.compare(password, user.password)) {
      res.json({
        _id: user._id,
        name: user.name || user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users (admin only)
app.get('/api/admin/users', protect, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    const users = db.users.filter(u => u.role !== 'admin').map(({ password, ...u }) => u);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get admin dashboard stats
app.get('/api/admin/dashboard', protect, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Bookings stats
    const totalBookings = db.bookings.length;
    const pendingBookings = db.bookings.filter(b => b.status === 'Pending').length;
    const approvedBookings = db.bookings.filter(b => b.status === 'Approved').length;
    const completedBookings = db.bookings.filter(b => b.status === 'Completed').length;
    const rejectedBookings = db.bookings.filter(b => b.status === 'Rejected').length;
    const todayBookings = db.bookings.filter(b => b.createdAt?.split('T')[0] === today).length;
    
    // This week bookings
    const thisWeekBookings = db.bookings.filter(b => {
      const bookingDate = b.createdAt?.split('T')[0];
      return bookingDate >= weekAgo && bookingDate <= today;
    }).length;
    
    // Revenue calculation (simplified)
    const completedWithPrices = db.bookings.filter(b => b.status === 'Completed');
    const totalRevenue = completedWithPrices.reduce((sum, b) => {
      const price = parseInt(b.servicePrice?.replace(/[^0-9]/g, '') || '0');
      return sum + price;
    }, 0);
    
    // Users stats
    const totalUsers = db.users.filter(u => u.role !== 'admin').length;
    const newUsersToday = db.users.filter(u => 
      u.role !== 'admin' && u.createdAt?.split('T')[0] === today
    ).length;
    
    // Services stats
    const totalServices = db.services.length;
    
    // Popular services
    const serviceCounts = {};
    db.bookings.forEach(b => {
      serviceCounts[b.serviceType] = (serviceCounts[b.serviceType] || 0) + 1;
    });
    const popularServices = Object.entries(serviceCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
    
    // Recent activity
    const recentBookings = [...db.bookings]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    res.json({
      bookings: {
        total: totalBookings,
        pending: pendingBookings,
        approved: approvedBookings,
        completed: completedBookings,
        rejected: rejectedBookings,
        today: todayBookings,
        thisWeek: thisWeekBookings,
      },
      revenue: {
        total: totalRevenue,
        currency: '$',
      },
      users: {
        total: totalUsers,
        newToday: newUsersToday,
      },
      services: {
        total: totalServices,
        popular: popularServices,
      },
      recentBookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============= BOOKING ROUTES =============

// Create booking
app.post('/api/bookings', (req, res) => {
  try {
    const { customerName, phone, vehicleNumber, serviceType, date, time, userId } = req.body;
    
    db.bookingCounter++;
    const booking = {
      _id: String(db.bookingCounter),
      bookingId: `BK${String(db.bookingCounter).padStart(3, '0')}`,
      customerName,
      phone,
      vehicleNumber,
      serviceType,
      date,
      time,
      userId: userId || null,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    
    db.bookings.push(booking);
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's bookings
app.get('/api/bookings/my', protect, (req, res) => {
  try {
    const userBookings = db.bookings.filter(b => 
      b.userId === req.user._id || b.phone === req.user.phone
    );
    userBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(userBookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all bookings
app.get('/api/bookings', (req, res) => {
  try {
    const { status, date } = req.query;
    let bookings = [...db.bookings];
    
    if (status) bookings = bookings.filter(b => b.status === status);
    if (date) bookings = bookings.filter(b => b.date === date);
    
    // Sort by createdAt descending
    bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get booking stats
app.get('/api/bookings/stats', (req, res) => {
  try {
    const total = db.bookings.length;
    const pending = db.bookings.filter(b => b.status === 'Pending').length;
    const approved = db.bookings.filter(b => b.status === 'Approved').length;
    const completed = db.bookings.filter(b => b.status === 'Completed').length;
    const rejected = db.bookings.filter(b => b.status === 'Rejected').length;
    
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = db.bookings.filter(b => b.date === today).length;
    
    res.json({ total, pending, approved, completed, rejected, todayBookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single booking
app.get('/api/bookings/:id', (req, res) => {
  try {
    const booking = db.bookings.find(b => 
      b._id === req.params.id || b.bookingId === req.params.id
    );
    
    if (booking) {
      res.json(booking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update booking status
app.put('/api/bookings/:id/status', protect, (req, res) => {
  try {
    const { status } = req.body;
    const bookingIndex = db.bookings.findIndex(b => 
      b._id === req.params.id || b.bookingId === req.params.id
    );
    
    if (bookingIndex !== -1) {
      db.bookings[bookingIndex].status = status;
      res.json(db.bookings[bookingIndex]);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete booking
app.delete('/api/bookings/:id', protect, (req, res) => {
  try {
    const bookingIndex = db.bookings.findIndex(b => 
      b._id === req.params.id || b.bookingId === req.params.id
    );
    
    if (bookingIndex !== -1) {
      db.bookings.splice(bookingIndex, 1);
      res.json({ message: 'Booking removed' });
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============= SERVICE ROUTES =============

// Get all services
app.get('/api/services', (req, res) => {
  res.json(db.services);
});

// Create service
app.post('/api/services', protect, (req, res) => {
  try {
    const { name, description, price, icon } = req.body;
    
    const exists = db.services.find(s => s.name === name);
    if (exists) {
      return res.status(400).json({ message: 'Service already exists' });
    }
    
    const service = {
      _id: String(db.services.length + 1),
      name,
      description,
      price,
      icon: icon || 'Wrench',
    };
    
    db.services.push(service);
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update service
app.put('/api/services/:id', protect, (req, res) => {
  try {
    const { name, description, price, icon } = req.body;
    const serviceIndex = db.services.findIndex(s => s._id === req.params.id);
    
    if (serviceIndex !== -1) {
      if (name) db.services[serviceIndex].name = name;
      if (description) db.services[serviceIndex].description = description;
      if (price) db.services[serviceIndex].price = price;
      if (icon) db.services[serviceIndex].icon = icon;
      res.json(db.services[serviceIndex]);
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete service
app.delete('/api/services/:id', protect, (req, res) => {
  try {
    const serviceIndex = db.services.findIndex(s => s._id === req.params.id);
    
    if (serviceIndex !== -1) {
      db.services.splice(serviceIndex, 1);
      res.json({ message: 'Service removed' });
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running (in-memory mode)' });
});

const PORT = process.env.PORT || 5001;

// Initialize data and start server
initializeData().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (in-memory database mode)`);
  });
});
