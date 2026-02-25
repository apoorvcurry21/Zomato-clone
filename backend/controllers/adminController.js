import User from '../models/User.js';
import Order from '../models/Order.js';
import Restaurant from '../models/Restaurant.js';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({})
            .populate('customer', 'name email')
            .populate('restaurant', 'name')
            .populate('deliveryPartner', 'name phone')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle user block status
// @route   PATCH /api/admin/users/:id/toggle-block
// @access  Private/Admin
export const toggleUserBlock = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        if (user.role === 'admin') {
            res.status(400);
            throw new Error('Cannot block an admin user');
        }

        user.isBlocked = !user.isBlocked;
        await user.save();

        res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, user });
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle restaurant featured status
// @route   PATCH /api/admin/restaurants/:id/toggle-featured
// @access  Private/Admin
export const toggleRestaurantFeatured = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            res.status(404);
            throw new Error('Restaurant not found');
        }

        restaurant.isFeatured = !restaurant.isFeatured;
        await restaurant.save();

        res.json({ message: `Restaurant ${restaurant.isFeatured ? 'featured' : 'removed from featured'}`, restaurant });
    } catch (error) {
        next(error);
    }
};

// @desc    Manually assign delivery partner to order
// @route   PATCH /api/admin/orders/:id/assign
// @access  Private/Admin
export const assignOrderManually = async (req, res, next) => {
    try {
        const { deliveryPartnerId } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }

        const deliveryPartner = await User.findOne({ _id: deliveryPartnerId, role: 'delivery' });
        if (!deliveryPartner) {
            res.status(404);
            throw new Error('Delivery partner not found or invalid role');
        }

        order.deliveryPartner = deliveryPartnerId;
        // If the order was ready, it might now move to out-for-delivery or stay ready
        // Let's assume manual assignment just sets the partner.
        await order.save();

        res.json({ message: 'Delivery partner assigned successfully', order });
    } catch (error) {
        next(error);
    }
};

// @desc    Get system analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getSystemAnalytics = async (req, res, next) => {
    try {
        const analytics = await Order.aggregate([
            {
                $facet: {
                    totalStats: [
                        {
                            $group: {
                                _id: null,
                                totalOrders: { $sum: 1 },
                                totalRevenue: { $sum: '$discountedAmount' },
                                deliveredOrders: {
                                    $sum: { $cond: [{ $eq: ['$orderStatus', 'delivered'] }, 1, 0] }
                                },
                                cancelledOrders: {
                                    $sum: { $cond: [{ $eq: ['$orderStatus', 'cancelled'] }, 1, 0] }
                                }
                            }
                        }
                    ]
                }
            }
        ]);

        const result = analytics[0].totalStats[0] || {
            totalOrders: 0,
            totalRevenue: 0,
            deliveredOrders: 0,
            cancelledOrders: 0
        };

        res.json(result);
    } catch (error) {
        next(error);
    }
};
