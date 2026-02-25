import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true,
    trim: true
  },
  pincodes: [{
    type: String,
    required: true
  }],
  estimatedPrepTime: {
    type: Number,
    required: true,
    min: 1
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0,
    min: 0
  },
  cuisine: {
    type: String,
    trim: true,
    default: ''
  }
}, { timestamps: true });

restaurantSchema.index({ pincodes: 1 });
restaurantSchema.index({ owner: 1 });
restaurantSchema.index({ isFeatured: 1 });
restaurantSchema.index({ isOpen: 1 });
restaurantSchema.index({ rating: -1 });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;
