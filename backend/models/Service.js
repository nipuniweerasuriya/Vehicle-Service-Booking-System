import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: 'Wrench',
  },
}, {
  timestamps: true,
});

const Service = mongoose.model('Service', serviceSchema);

export default Service;
