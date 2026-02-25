import express from 'express';
import {
    updateRestaurantProfile,
    toggleRestaurantStatus,
    getAvailableRestaurants,
    getFeaturedRestaurants,
    searchRestaurants,
} from '../controllers/restaurantController.js';
import { getRestaurantMenu } from '../controllers/menuController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAvailableRestaurants);
router.get('/featured', getFeaturedRestaurants);
router.get('/search', searchRestaurants);
router.get('/:restaurantId/menu', getRestaurantMenu);

// Protected routes
router.put('/profile', protect, authorize('restaurant'), updateRestaurantProfile);
router.patch('/status', protect, authorize('restaurant'), toggleRestaurantStatus);

export default router;
