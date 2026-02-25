import express from 'express';
import {
    toggleAvailability,
    getMyProfile
} from '../controllers/deliveryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes here are delivery partner only
router.use(protect, authorize('delivery'));

router.patch('/toggle-availability', toggleAvailability);
router.get('/profile', getMyProfile);

export default router;
