import express from 'express';
import {
    createReview,
    getRestaurantReviews
} from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('customer'), createReview);
router.get('/restaurant/:id', getRestaurantReviews);

export default router;
