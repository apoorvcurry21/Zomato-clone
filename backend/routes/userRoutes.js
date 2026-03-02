import express from 'express';
import {
    applyToBePartner,
    applyToBeRestaurant,
    addAddress,
    deleteAddress
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/apply-delivery', protect, authorize('customer'), applyToBePartner);
router.post('/apply-restaurant', protect, authorize('customer'), applyToBeRestaurant);
router.post('/address', protect, addAddress);
router.delete('/address/:id', protect, deleteAddress);

export default router;
