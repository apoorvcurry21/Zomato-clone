import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';
import Restaurant from '../models/Restaurant.js';
import Coupon from '../models/Coupon.js';
import { getValidatedCoupon } from './couponController.js';

// @desc    Create new order & initialize Razorpay
// @route   POST /api/orders/create
// @access  Private/Customer
export const createOrder = async (req, res, next) => {
    try {
        const { restaurantId, items, couponCode, deliveryPincode } = req.body;

        if (!items || items.length === 0) {
            res.status(400);
            throw new Error('No order items');
        }

        // 1. Verify Restaurant and Pincode
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            res.status(404);
            throw new Error('Restaurant not found');
        }

        if (!restaurant.pincodes.includes(deliveryPincode)) {
            res.status(400);
            throw new Error('Restaurant does not serve this pincode');
        }

        // 2. Secure Price Calculation (fetch from DB)
        let totalAmount = 0;
        const dbItems = [];

        for (const item of items) {
            const menuItem = await MenuItem.findById(item.menuItem);
            if (!menuItem || menuItem.restaurant.toString() !== restaurantId) {
                res.status(400);
                throw new Error(`Invalid menu item: ${item.menuItem}`);
            }
            totalAmount += menuItem.price * item.quantity;
            dbItems.push({
                menuItem: menuItem._id,
                quantity: item.quantity
            });
        }

        // 3. Handle Coupon
        let discountedAmount = totalAmount;
        let discount = 0;
        let appliedCoupon = null;

        if (couponCode) {
            try {
                const validated = await getValidatedCoupon(couponCode, totalAmount);
                discount = validated.discount;
                discountedAmount = totalAmount - discount;
                appliedCoupon = validated.code;
            } catch (err) {
                // We can choose to fail or just ignore the coupon. 
                // Failing is safer for user expectation.
                res.status(400);
                throw err;
            }
        }

        // 4. Save COD Order to DB
        const order = await Order.create({
            customer: req.user._id,
            restaurant: restaurantId,
            items: dbItems,
            totalAmount,
            discountedAmount: discount,
            couponUsed: appliedCoupon,
            pincode: deliveryPincode,
            paymentMethod: 'COD',
            paymentStatus: 'pending',
            orderStatus: 'placed'
        });

        res.status(201).json({
            message: 'Order placed successfully (COD)',
            order
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Verify Payment (Stub for COD)
// @route   POST /api/orders/verify
// @access  Private/Customer
export const verifyPayment = async (req, res, next) => {
    res.json({ message: 'COD order does not require online verification.' });
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private/Customer
export const getUserOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ customer: req.user._id })
            .populate('restaurant', 'name address')
            .populate('items.menuItem', 'name price')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        next(error);
    }
};
