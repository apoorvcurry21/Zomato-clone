import express from 'express';
import {
    updateRestaurantProfile,
    toggleRestaurantStatus,
    getAvailableRestaurants,
    getFeaturedRestaurants,
    searchRestaurants,
    getRestaurantById,
    getMyRestaurantProfile
} from '../controllers/restaurantController.js';
import { getRestaurantMenu } from '../controllers/menuController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Static Routes (Public)
router.get('/', getAvailableRestaurants);
router.get('/featured', getFeaturedRestaurants);
router.get('/search', searchRestaurants);

// 2. Static Routes (Protected) - MUST be before generic :id
router.get('/my-restaurant', protect, authorize('restaurant'), getMyRestaurantProfile);

// 3. Dynamic Routes
router.get('/:id', getRestaurantById);
router.get('/:restaurantId/menu', getRestaurantMenu);

// 4. Other Protected Routes
router.put('/profile', protect, authorize('restaurant'), updateRestaurantProfile);
router.patch('/status', protect, authorize('restaurant'), toggleRestaurantStatus);

export default router;
