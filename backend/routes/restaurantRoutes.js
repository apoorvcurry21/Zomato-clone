import express from 'express';
import {
    updateRestaurantProfile,
    toggleRestaurantStatus,
} from '../controllers/restaurantController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/profile', protect, authorize('restaurant'), updateRestaurantProfile);
router.patch('/status', protect, authorize('restaurant'), toggleRestaurantStatus);

export default router;
