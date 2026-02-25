import User from '../models/User.js';

// @desc    Apply to be a delivery partner
// @route   POST /api/users/apply-delivery
// @access  Private/Customer
export const applyToBePartner = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        if (user.role !== 'customer') {
            res.status(400);
            throw new Error(`User with role ${user.role} cannot apply to be a delivery partner`);
        }

        user.role = 'delivery';
        user.isOnline = false;
        await user.save();

        res.json({ message: 'Application successful. You are now a delivery partner.', user: { name: user.name, role: user.role } });
    } catch (error) {
        next(error);
    }
};

// @desc    Apply to be a restaurant owner
// @route   POST /api/users/apply-restaurant
// @access  Private/Customer
export const applyToBeRestaurant = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        if (user.role !== 'customer') {
            res.status(400);
            throw new Error(`User with role ${user.role} cannot apply to be a restaurant owner`);
        }

        user.role = 'restaurant';
        // For security, we could keep them blocked until admin approves
        user.isBlocked = true;
        await user.save();

        res.json({ message: 'Request submitted. Your account is pending admin approval.', user: { name: user.name, role: user.role, isBlocked: user.isBlocked } });
    } catch (error) {
        next(error);
    }
};
