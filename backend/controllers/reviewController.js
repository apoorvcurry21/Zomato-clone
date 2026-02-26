import Review from '../models/Review.js';
import Restaurant from '../models/Restaurant.js';
import Order from '../models/Order.js';

// @desc    Create a review for a restaurant
// @route   POST /api/reviews
// @access  Private/Customer
export const createReview = async (req, res, next) => {
    try {
        const { restaurantId, orderId, rating, comment } = req.body;

        // 1. Verify the order exists and is delivered
        const order = await Order.findById(orderId);
        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }

        if (order.orderStatus !== 'delivered') {
            res.status(400);
            throw new Error('You can only review delivered orders');
        }

        if (order.customer.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to review this order');
        }

        // 2. Create the review
        const review = await Review.create({
            customer: req.user._id,
            restaurant: restaurantId,
            rating,
            comment
        });

        // 3. Update Restaurant Average Rating
        const restaurant = await Restaurant.findById(restaurantId);
        if (restaurant) {
            const reviews = await Review.find({ restaurant: restaurantId });
            const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

            restaurant.numReviews = reviews.length;
            restaurant.rating = parseFloat(avgRating.toFixed(1));
            await restaurant.save();
        }

        res.status(201).json({
            message: 'Review submitted successfully',
            review
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get reviews for a restaurant
// @route   GET /api/reviews/restaurant/:id
// @access  Public
export const getRestaurantReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ restaurant: req.params.id })
            .populate('customer', 'name')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        next(error);
    }
};
