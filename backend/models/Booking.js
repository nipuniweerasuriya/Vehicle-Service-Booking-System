import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  vehicleNumber: {
    type: String,
    required: true,
  },
  serviceType: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Completed', 'Rejected'],
    default: 'Pending',
  },
}, {
  timestamps: true,
});

// Auto-generate booking ID before saving
bookingSchema.pre('save', async function(next) {
  if (!this.bookingId) {
    const count = await mongoose.model('Booking').countDocuments();
    this.bookingId = `BK${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
