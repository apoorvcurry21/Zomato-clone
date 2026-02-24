import express from 'express';
import {
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    getRestaurantMenu,
} from '../controllers/menuController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route to view menu
router.get('/:restaurantId', getRestaurantMenu);

// Protected routes for restaurant owners
router.post('/:restaurantId', protect, authorize('restaurant'), addMenuItem);
router.put('/:id', protect, authorize('restaurant'), updateMenuItem);
router.delete('/:id', protect, authorize('restaurant'), deleteMenuItem);

export default router;
