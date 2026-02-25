import User from '../models/User.js';
import Order from '../models/Order.js';

// @desc    Toggle delivery partner availability
// @route   PATCH /api/delivery/toggle-availability
// @access  Private/Delivery
export const toggleAvailability = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        user.isOnline = !user.isOnline;
        await user.save();

        res.json({ message: `You are now ${user.isOnline ? 'Online' : 'Offline'}`, isOnline: user.isOnline });
    } catch (error) {
        next(error);
    }
};

// @desc    Get delivery partner profile & stats
// @route   GET /api/delivery/profile
// @access  Private/Delivery
export const getMyProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('name phone role isOnline');

        // Calculate basic stats (e.g., total delivered orders)
        const totalDelivered = await Order.countDocuments({
            deliveryPartner: req.user._id,
            orderStatus: 'delivered'
        });

        res.json({
            profile: user,
            stats: {
                totalDelivered
            }
        });
    } catch (error) {
        next(error);
    }
};
