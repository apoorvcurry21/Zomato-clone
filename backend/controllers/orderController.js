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

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private (Restaurant/Delivery)
export const updateOrderStatus = async (req, res, next) => {
    try {
        const { status, estimatedDeliveryTime } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }

        const role = req.user.role;
        const currentStatus = order.orderStatus;

        // Status flow: placed -> accepted -> preparing -> ready -> out-for-delivery -> delivered
        const statusSequence = ['placed', 'accepted', 'preparing', 'ready', 'out-for-delivery', 'delivered'];

        const currentIndex = statusSequence.indexOf(currentStatus);
        const nextIndex = statusSequence.indexOf(status);

        if (nextIndex === -1) {
            res.status(400);
            throw new Error('Invalid status');
        }

        if (nextIndex !== currentIndex + 1) {
            res.status(400);
            throw new Error(`Invalid status transition. Cannot go from ${currentStatus} to ${status}`);
        }

        // Role-based validation
        if (role === 'restaurant') {
            // Restaurant can only update: placed -> accepted -> preparing -> ready
            if (!['accepted', 'preparing', 'ready'].includes(status)) {
                res.status(403);
                throw new Error('Restaurants can only update up to "ready" status');
            }

            // Verify ownership
            const restaurant = await Restaurant.findOne({ owner: req.user._id, _id: order.restaurant });
            if (!restaurant) {
                res.status(403);
                throw new Error('You do not have permission to update this restaurant\'s orders');
            }

            if (status === 'accepted' && estimatedDeliveryTime) {
                order.estimatedDeliveryTime = estimatedDeliveryTime;
            }
        }
        else if (role === 'delivery') {
            // Delivery Partner can only update: ready -> out-for-delivery -> delivered
            if (!['out-for-delivery', 'delivered'].includes(status)) {
                res.status(403);
                throw new Error('Delivery partners can only update "out-for-delivery" or "delivered" status');
            }

            // If marking as out-for-delivery, assign the partner
            if (status === 'out-for-delivery') {
                order.deliveryPartner = req.user._id;
            } else if (order.deliveryPartner && order.deliveryPartner.toString() !== req.user._id.toString()) {
                res.status(403);
                throw new Error('You are not assigned to this order');
            }
        }
        else {
            res.status(403);
            throw new Error('Unauthorized role for status updates');
        }

        order.orderStatus = status;
        await order.save();

        res.json({ message: `Order status updated to ${status}`, order });
    } catch (error) {
        next(error);
    }
};

// @desc    Get incoming orders for restaurant
// @route   GET /api/orders/restaurant-orders
// @access  Private/Restaurant
export const getIncomingOrders = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findOne({ owner: req.user._id });
        if (!restaurant) {
            res.status(404);
            throw new Error('Restaurant not found for this user');
        }

        const orders = await Order.find({
            restaurant: restaurant._id,
            orderStatus: { $in: ['placed', 'accepted', 'preparing', 'ready'] }
        }).populate('customer', 'name phone')
            .populate('items.menuItem', 'name')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        next(error);
    }
};

// @desc    Get assigned orders for delivery partner
// @route   GET /api/orders/delivery-orders
// @access  Private/Delivery
export const getAssignedOrders = async (req, res, next) => {
    try {
        // Find orders ready for pickup or assigned to this partner
        const orders = await Order.find({
            $or: [
                { orderStatus: 'ready' },
                { deliveryPartner: req.user._id, orderStatus: { $in: ['out-for-delivery', 'delivered'] } }
            ]
        }).populate('customer', 'name phone addresses')
            .populate('restaurant', 'name address contact')
            .populate('items.menuItem', 'name')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        next(error);
    }
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

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('restaurant', 'name address estimatedPrepTime')
            .populate('deliveryPartner', 'name phone')
            .populate('items.menuItem', 'name price');

        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }

        // Authorization check
        const isCustomer = order.customer.toString() === req.user._id.toString();
        const isRestaurant = req.user.role === 'restaurant'; // Simplified, full check would be by restaurant ID
        const isDelivery = req.user.role === 'delivery';

        if (!isCustomer && !isRestaurant && !isDelivery && req.user.role !== 'admin') {
            res.status(403);
            throw new Error('Not authorized to view this order');
        }

        res.json(order);
    } catch (error) {
        next(error);
    }
};

// @desc    Cancel order
// @route   PATCH /api/orders/:id/cancel
// @access  Private/Customer
export const cancelOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }

        if (order.customer.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to cancel this order');
        }

        if (order.orderStatus !== 'placed') {
            res.status(400);
            throw new Error('Order can only be cancelled if it is still in "placed" status');
        }

        order.orderStatus = 'cancelled';
        await order.save();

        res.json({ message: 'Order cancelled successfully', order });
    } catch (error) {
        next(error);
    }
};
