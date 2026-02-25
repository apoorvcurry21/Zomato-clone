import express from 'express';
import {
    createOrder,
    updateOrderStatus,
    getIncomingOrders,
    getAssignedOrders,
    getUserOrders,
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', protect, authorize('customer'), createOrder);
router.patch('/:id/status', protect, authorize('restaurant', 'delivery'), updateOrderStatus);
router.get('/restaurant-orders', protect, authorize('restaurant'), getIncomingOrders);
router.get('/delivery-orders', protect, authorize('delivery'), getAssignedOrders);
router.get('/myorders', protect, authorize('customer'), getUserOrders);

export default router;
