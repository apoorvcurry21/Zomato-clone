import express from 'express';
import {
    createOrder,
    verifyPayment,
    getUserOrders,
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/myorders', protect, getUserOrders);

export default router;
