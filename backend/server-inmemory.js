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
  reviews: [],
  bookingCounter: 0,
  reviewCounter: 0,
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

  // Create default services - comprehensive list
  db.services = [
    // Maintenance Services
    { _id: '1', name: 'Regular Maintenance', description: 'Complete vehicle check and maintenance including fluid top-ups, belt inspection, and general diagnostics', price: 99, category: 'maintenance', duration: 120, icon: 'Wrench', status: 'active', featured: true, discount: 0, bookingCount: 0, createdAt: new Date().toISOString() },
    { _id: '2', name: 'Oil Change', description: 'Premium engine oil and filter replacement with multi-point inspection', price: 49, category: 'maintenance', duration: 45, icon: 'Droplet', status: 'active', featured: false, discount: 10, bookingCount: 0, createdAt: new Date().toISOString() },
    { _id: '3', name: 'Tire Rotation & Balancing', description: 'Professional tire rotation, balancing, and pressure optimization', price: 69, category: 'maintenance', duration: 45, icon: 'Disc3', status: 'active', featured: false, discount: 0, bookingCount: 0, createdAt: new Date().toISOString() },
    { _id: '4', name: 'Fluid Top-Up Service', description: 'Check and top-up all essential fluids including coolant, brake, power steering, and windshield washer', price: 35, category: 'maintenance', duration: 30, icon: 'Droplet', status: 'active', featured: false, discount: 0, bookingCount: 0, createdAt: new Date().toISOString() },
    { _id: '5', name: 'Air Filter Replacement', description: 'Engine and cabin air filter inspection and replacement for improved air quality', price: 45, category: 'maintenance', duration: 30, icon: 'Wind', status: 'active', featured: false, discount: 0, bookingCount: 0, createdAt: new Date().toISOString() },
    { _id: '6', name: 'Spark Plug Replacement', description: 'Replace worn spark plugs for better fuel efficiency and engine performance', price: 89, category: 'maintenance', duration: 60, icon: 'Zap', status: 'active', featured: false, discount: 0, bookingCount: 0, createdAt: new Date().toISOString() },
    { _id: '7', name: 'Transmission Fluid Change', description: 'Complete transmission fluid flush and replacement for smooth gear shifting', price: 149, category: 'maintenance', duration: 90, icon: 'Wrench', status: 'active', featured: false, discount: 5, bookingCount: 0, createdAt: new Date().toISOString() },
    { _id: '8', name: 'Coolant Flush', description: 'Complete cooling system flush and refill with fresh antifreeze coolant', price: 79, category: 'maintenance', duration: 60, icon: 'Droplet', status: 'active', featured: false, discount: 0, bookingCount: 0, createdAt: new Date().toISOString() },
    
    // Repair Services
    { _id: '9', name: 'Brake Inspection & Service', description: 'Complete brake system check including pads, rotors, and brake fluid', price: 79, category: 'repair', duration: 60, icon: 'Zap', status: 'active', featured: true, discount: 0, bookingCount: 0, createdAt: new Date().toISOString() },
    { _id: '10', name: 'Brake Pad Replacement', description: 'Front or rear brake pad replacement with rotor inspection', price: 149, category: 'repair', duration: 90, icon: 'Zap', status: 'active', featured: false, discount: 0, bookingCount: 0, createdAt: new Date().toISOString() },
    { _id: '11', name: 'Battery Service', description: 'Battery health check, terminal cleaning, and replacement if needed', price: 89, category: 'repair', duration: 30, icon: 'Battery', status: 'active', featured: false, discount: 15, bookingCount: 0, createdAt: new Date().toISOString() },
    { _id: '12', name: 'Wheel Alignment', description: 'Precision wheel alignment using laser technology for optimal handling', price: 89, category: 'repair', duration: 60, icon: 'Target', status: 'active', featured: false, discount: 20, bookingCount: 0, createdAt: new Date().toISOString() },
    { _id: '13', name: 'Suspension Check & Repair', description: 'Complete suspension system inspection including shocks, struts, and bushings', price: 129, category: 'repair', duration: 90, icon: 'Car', status: 'active', featured: false, discount: 0, bookingCount: 0, createdAt: new Date().toISOString() },
    { _id: '14', name: 'Exhaust System Repair', description: 'Exhaust pipe, muffler, and catalytic converter inspection and repair', price: 179, category: 'repair', duration: 120, icon: 'Wind', status: 'active', featured: false, discount: 0, bookingCount: 0, createdAt: new Date().toISOString() },
    { _id: '15', name: 'Steering System Service', description: 'Power steering fluid change and steering component inspection', price: 99, category: 'repair', duration: 60, icon: 'Target', status: 'active', featured: false, discount: 0, bookingCount: 0, createdAt: new Date().toISOString() },
    { _id: '16', name: 'Belt Replacement', description: 'Serpentine belt and timing belt inspection and replacement', price: 199, category: 'repair', duration: 120, icon: 'Wrench', status: 'active', featured: false, discount: 10, bookingCount: 0, createdAt: new Date().toISOString() },
    { _id: '17', name: 'Radiator Service', description: 'Radiator inspection, cleaning, and repair for optimal cooling', price: 119, category: 'repair', duration: 90, icon: 'Droplet', status: 'active', featured: false, discount: 0, bookingCount: 0, createdAt: new Date().toISOString() },
    { _id: '18', name: 'Clutch Repair', description: 'Clutch inspection, adjustment, and replacement if necessary', price: 299, category: 'repair', duration: 180, icon: 'Wrench', status: 'active', featured: false, discount: 0, bookingCount: 0, createdAt: new Date().toISOString() },
    
    // Inspection Services
    { _id: '19', name: 'Full Vehicle Inspection', description: 'Comprehensive 50-point inspection covering all major systems', price: 149, category: 'inspection', duration: 120, icon: 'ClipboardCheck', status: 'active', featured: true, discount: 0, bookingCount: 0, createdAt: new Date().toISOString() },
    { _id: '20', name: 'Engine Diagnostics', description: 'Advanced computer diagnostics to identify engine issues and error codes', price: 59, category: 'inspection', duration: 45, icon: 'Search', status: 'active', featured: false, discount: 0, bookingCount: 0, createdAt: new Date().toISOString() },
    { _id: '21', name: 'Pre-Purchase Inspection', description: 'Thorough inspection before buying a used vehicle to identify potential issues', price: 129, category: 'inspection', duration: 90, icon: 'ClipboardCheck', status: 'active', featured: false, discount: 0, bookingCount: 0, createdAt: new Date().toISOString() },
    { _id: '22', name: 'Emissions Testing', description: 'Complete emissions test to ensure your vehicle meets environmental standards', price: 45, category: 'inspection', duration: 30, icon: 'Wind', status: 'active', featured: false, discount: 0, bookingCount: 0, createdAt: new Date().toISOString() },
    { _id: '23', name: 'Safety Inspection', description: 'Comprehensive safety check including lights, wipers, horn, and mirrors', price: 39, category: 'inspection', duration: 30, icon: 'Shield', status: 'active', featured: false, discount: 0, bookingCount: 0, createdAt: new Date().toISOString() },
    { _id: '24', name: 'Tire Inspection', description: 'Detailed tire tread depth, wear pattern, and pressure analysis', price: 25, category: 'inspection', duration: 20, icon: 'Disc3', status: 'active', featured: false, discount: 0, bookingCount: 0, createdAt: new Date().toISOString() },
    
    // Comfort Services
    { _id: '25', name: 'AC Service & Refill', description: 'Complete air conditioning system check, refrigerant refill, and cabin filter replacement', price: 129, category: 'comfort', duration: 90, icon: 'Wind', status: 'active', featured: true, discount: 0, bookingCount: 0, createdAt: new Date().toISOString() },
    { _id: '26', name: 'Premium Detail Package', description: 'Interior deep clean, exterior wash, wax, and tire shine', price: 199, category: 'comfort', duration: 180, icon: 'Sparkles', status: 'active', featured: true, discount: 0, bookingCount: 0, createdAt: new Date().toISOString() },
    { _id: '27', name: 'Interior Cleaning', description: 'Deep vacuum, dashboard polish, and upholstery cleaning', price: 79, category: 'comfort', duration: 60, icon: 'Sparkles', status: 'active', featured: false, discount: 0, bookingCount: 0, createdAt: new Date().toISOString() },
    { _id: '28', name: 'Exterior Wash & Wax', description: 'Hand wash, clay bar treatment, and premium wax application', price: 59, category: 'comfort', duration: 45, icon: 'Sparkles', status: 'active', featured: false, discount: 0, bookingCount: 0, createdAt: new Date().toISOString() },
    { _id: '29', name: 'Headlight Restoration', description: 'Professional headlight cleaning and UV coating restoration', price: 69, category: 'comfort', duration: 45, icon: 'Zap', status: 'active', featured: false, discount: 15, bookingCount: 0, createdAt: new Date().toISOString() },
    { _id: '30', name: 'Windshield Treatment', description: 'Water repellent treatment for improved visibility in rain', price: 35, category: 'comfort', duration: 20, icon: 'Droplet', status: 'active', featured: false, discount: 0, bookingCount: 0, createdAt: new Date().toISOString() },
    { _id: '31', name: 'Paint Protection', description: 'Ceramic coating or paint sealant for long-lasting protection', price: 299, category: 'comfort', duration: 240, icon: 'Shield', status: 'active', featured: false, discount: 10, bookingCount: 0, createdAt: new Date().toISOString() },
    { _id: '32', name: 'Odor Elimination', description: 'Professional odor removal and sanitization treatment', price: 89, category: 'comfort', duration: 60, icon: 'Wind', status: 'active', featured: false, discount: 0, bookingCount: 0, createdAt: new Date().toISOString() },
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

// Delete user (admin only)
app.delete('/api/admin/users/:id', protect, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    const userIndex = db.users.findIndex(u => u._id === req.params.id);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (db.users[userIndex].role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin user' });
    }
    db.users.splice(userIndex, 1);
    res.json({ message: 'User deleted successfully' });
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
      progress: 0,
      progressStage: 'Waiting',
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
      // Reset progress when status changes
      if (status === 'Approved') {
        db.bookings[bookingIndex].progress = 0;
        db.bookings[bookingIndex].progressStage = 'Waiting';
      } else if (status === 'Completed') {
        db.bookings[bookingIndex].progress = 100;
        db.bookings[bookingIndex].progressStage = 'Completed';
      }
      res.json(db.bookings[bookingIndex]);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update booking progress (admin only)
app.put('/api/bookings/:id/progress', protect, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    const { progress, progressStage } = req.body;
    const bookingIndex = db.bookings.findIndex(b => 
      b._id === req.params.id || b.bookingId === req.params.id
    );
    
    if (bookingIndex !== -1) {
      if (progress !== undefined) db.bookings[bookingIndex].progress = progress;
      if (progressStage) db.bookings[bookingIndex].progressStage = progressStage;
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
  const { status, category, featured } = req.query;
  let services = [...db.services];
  
  if (status) {
    services = services.filter(s => s.status === status);
  }
  if (category) {
    services = services.filter(s => s.category === category);
  }
  if (featured === 'true') {
    services = services.filter(s => s.featured);
  }
  
  res.json(services);
});

// Get service statistics
app.get('/api/services/stats', protect, (req, res) => {
  try {
    const services = db.services;
    const bookings = db.bookings;
    
    // Calculate service booking counts
    const serviceBookingCounts = {};
    const serviceRevenue = {};
    
    bookings.forEach(booking => {
      const serviceName = booking.service;
      const service = services.find(s => s.name === serviceName);
      if (service) {
        serviceBookingCounts[service._id] = (serviceBookingCounts[service._id] || 0) + 1;
        if (booking.status === 'Completed') {
          const price = typeof service.price === 'number' ? service.price : parseFloat(service.price) || 0;
          serviceRevenue[service._id] = (serviceRevenue[service._id] || 0) + price;
        }
      }
    });
    
    // Category breakdown
    const categoryStats = {};
    services.forEach(s => {
      if (!categoryStats[s.category]) {
        categoryStats[s.category] = { count: 0, active: 0, revenue: 0 };
      }
      categoryStats[s.category].count++;
      if (s.status === 'active') categoryStats[s.category].active++;
      categoryStats[s.category].revenue += serviceRevenue[s._id] || 0;
    });
    
    // Top services
    const topServices = services
      .map(s => ({
        ...s,
        bookings: serviceBookingCounts[s._id] || 0,
        revenue: serviceRevenue[s._id] || 0
      }))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 5);
    
    res.json({
      total: services.length,
      active: services.filter(s => s.status === 'active').length,
      inactive: services.filter(s => s.status === 'inactive').length,
      featured: services.filter(s => s.featured).length,
      withDiscount: services.filter(s => s.discount > 0).length,
      categories: categoryStats,
      topServices,
      totalRevenue: Object.values(serviceRevenue).reduce((a, b) => a + b, 0),
      avgPrice: services.reduce((a, s) => a + (typeof s.price === 'number' ? s.price : 0), 0) / services.length || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create service
app.post('/api/services', protect, (req, res) => {
  try {
    const { name, description, price, icon, category, duration, status, featured, discount } = req.body;
    
    const exists = db.services.find(s => s.name === name);
    if (exists) {
      return res.status(400).json({ message: 'Service already exists' });
    }
    
    const service = {
      _id: String(Date.now()),
      name,
      description,
      price: typeof price === 'number' ? price : parseFloat(price) || 0,
      icon: icon || 'Wrench',
      category: category || 'maintenance',
      duration: duration || 60,
      status: status || 'active',
      featured: featured || false,
      discount: discount || 0,
      bookingCount: 0,
      createdAt: new Date().toISOString()
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
    const { name, description, price, icon, category, duration, status, featured, discount } = req.body;
    const serviceIndex = db.services.findIndex(s => s._id === req.params.id);
    
    if (serviceIndex !== -1) {
      const service = db.services[serviceIndex];
      if (name !== undefined) service.name = name;
      if (description !== undefined) service.description = description;
      if (price !== undefined) service.price = typeof price === 'number' ? price : parseFloat(price) || 0;
      if (icon !== undefined) service.icon = icon;
      if (category !== undefined) service.category = category;
      if (duration !== undefined) service.duration = duration;
      if (status !== undefined) service.status = status;
      if (featured !== undefined) service.featured = featured;
      if (discount !== undefined) service.discount = discount;
      service.updatedAt = new Date().toISOString();
      res.json(service);
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle service status
app.patch('/api/services/:id/toggle-status', protect, (req, res) => {
  try {
    const serviceIndex = db.services.findIndex(s => s._id === req.params.id);
    if (serviceIndex !== -1) {
      const service = db.services[serviceIndex];
      service.status = service.status === 'active' ? 'inactive' : 'active';
      service.updatedAt = new Date().toISOString();
      res.json(service);
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle service featured
app.patch('/api/services/:id/toggle-featured', protect, (req, res) => {
  try {
    const serviceIndex = db.services.findIndex(s => s._id === req.params.id);
    if (serviceIndex !== -1) {
      const service = db.services[serviceIndex];
      service.featured = !service.featured;
      service.updatedAt = new Date().toISOString();
      res.json(service);
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bulk update services status
app.post('/api/services/bulk-status', protect, (req, res) => {
  try {
    const { serviceIds, status } = req.body;
    const updated = [];
    
    serviceIds.forEach(id => {
      const serviceIndex = db.services.findIndex(s => s._id === id);
      if (serviceIndex !== -1) {
        db.services[serviceIndex].status = status;
        db.services[serviceIndex].updatedAt = new Date().toISOString();
        updated.push(db.services[serviceIndex]);
      }
    });
    
    res.json({ updated: updated.length, services: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bulk delete services
app.post('/api/services/bulk-delete', protect, (req, res) => {
  try {
    const { serviceIds } = req.body;
    let deleted = 0;
    
    serviceIds.forEach(id => {
      const serviceIndex = db.services.findIndex(s => s._id === id);
      if (serviceIndex !== -1) {
        db.services.splice(serviceIndex, 1);
        deleted++;
      }
    });
    
    res.json({ deleted });
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

// ============= REVIEW ROUTES =============

// Get all reviews (public - for display)
app.get('/api/reviews', (req, res) => {
  try {
    const { status } = req.query;
    let reviews = [...db.reviews];
    
    // Filter by status (approved only for public, all for admin)
    if (status) {
      reviews = reviews.filter(r => r.status === status);
    } else {
      // Default: show only approved reviews for public
      reviews = reviews.filter(r => r.status === 'approved');
    }
    
    reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all reviews (admin - includes pending)
app.get('/api/admin/reviews', protect, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    const reviews = [...db.reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create review (user)
app.post('/api/reviews', protect, (req, res) => {
  try {
    const { rating, comment, serviceType, bookingId } = req.body;
    
    db.reviewCounter++;
    const review = {
      _id: String(db.reviewCounter),
      userId: req.user._id,
      userName: req.user.name || req.user.username,
      userEmail: req.user.email,
      rating,
      comment,
      serviceType: serviceType || 'General',
      bookingId: bookingId || null,
      status: 'pending', // pending, approved, rejected
      createdAt: new Date().toISOString(),
    };
    
    db.reviews.push(review);
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update review status (admin only)
app.put('/api/admin/reviews/:id/status', protect, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    const { status } = req.body;
    const reviewIndex = db.reviews.findIndex(r => r._id === req.params.id);
    
    if (reviewIndex !== -1) {
      db.reviews[reviewIndex].status = status;
      res.json(db.reviews[reviewIndex]);
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete review (admin only)
app.delete('/api/admin/reviews/:id', protect, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    const reviewIndex = db.reviews.findIndex(r => r._id === req.params.id);
    
    if (reviewIndex !== -1) {
      db.reviews.splice(reviewIndex, 1);
      res.json({ message: 'Review deleted' });
    } else {
      res.status(404).json({ message: 'Review not found' });
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
