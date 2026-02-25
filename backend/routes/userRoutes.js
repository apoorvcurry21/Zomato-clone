import express from 'express';
import {
    applyToBePartner,
    applyToBeRestaurant
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/apply-delivery', protect, authorize('customer'), applyToBePartner);
router.post('/apply-restaurant', protect, authorize('customer'), applyToBeRestaurant);

export default router;
