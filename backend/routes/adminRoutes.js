import express from 'express';
import {
    getAllUsers,
    getAllOrders,
    toggleUserBlock,
    toggleRestaurantFeatured,
    assignOrderManually,
    getSystemAnalytics
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes here are admin only
router.use(protect, authorize('admin'));

router.get('/users', getAllUsers);
router.get('/orders', getAllOrders);
router.patch('/users/:id/toggle-block', toggleUserBlock);
router.patch('/restaurants/:id/toggle-featured', toggleRestaurantFeatured);
router.patch('/orders/:id/assign', assignOrderManually);
router.get('/analytics', getSystemAnalytics);

export default router;
