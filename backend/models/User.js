import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['home', 'work'],
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  addressLine: {
    type: String,
    required: true
  }
}, { _id: true });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['customer', 'restaurant', 'delivery', 'admin'],
    default: 'customer',
    required: true
  },
  addresses: [addressSchema],
  isBlocked: {
    type: Boolean,
    default: false
  },
  isOnline: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);

export default User;
