import Booking from '../models/Booking.js';
import Service from '../models/Service.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Public
export const createBooking = async (req, res) => {
  try {
    const { customerName, phone, vehicleNumber, serviceType, date, time } = req.body;

    // Find the service to get its price
    const service = await Service.findOne({ name: serviceType });
    if (!service) {
      return res.status(400).json({ message: 'Selected service not found' });
    }

    const booking = await Booking.create({
      customerName,
      phone,
      vehicleNumber,
      serviceType,
      date,
      time,
      servicePrice: service.price,
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private (Admin)
export const getBookings = async (req, res) => {
  try {
    const { status, date } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (date) query.date = date;

    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Public
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      $or: [
        { _id: req.params.id },
        { bookingId: req.params.id }
      ]
    });

    if (booking) {
      res.json(booking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private (Admin)
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findOne({ 
      $or: [
        { _id: req.params.id },
        { bookingId: req.params.id }
      ]
    });

    if (booking) {
      booking.status = status;
      const updatedBooking = await booking.save();
      res.json(updatedBooking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private (Admin)
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      $or: [
        { _id: req.params.id },
        { bookingId: req.params.id }
      ]
    });

    if (booking) {
      await booking.deleteOne();
      res.json({ message: 'Booking removed' });
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booking statistics
// @route   GET /api/bookings/stats
// @access  Private (Admin)
export const getBookingStats = async (req, res) => {
  try {
    const total = await Booking.countDocuments();
    const pending = await Booking.countDocuments({ status: 'Pending' });
    const approved = await Booking.countDocuments({ status: 'Approved' });
    const completed = await Booking.countDocuments({ status: 'Completed' });
    const rejected = await Booking.countDocuments({ status: 'Rejected' });

    // Today's bookings
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = await Booking.countDocuments({ date: today });

    res.json({
      total,
      pending,
      approved,
      completed,
      rejected,
      todayBookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
