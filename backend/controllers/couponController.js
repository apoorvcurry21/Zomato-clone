import Coupon from '../models/Coupon.js';

// @desc    Validate a coupon code
// @route   POST /api/coupons/validate
// @access  Private
export const validateCoupon = async (req, res, next) => {
    try {
        const { code, amount } = req.body;
        const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

        if (!coupon) {
            res.status(404);
            throw new Error('Coupon not found or inactive');
        }

        if (new Date() > new Date(coupon.expirationDate)) {
            res.status(400);
            throw new Error('Coupon has expired');
        }

        if (amount < coupon.minOrderAmount) {
            res.status(400);
            throw new Error(`Minimum order amount of ${coupon.minOrderAmount} not met`);
        }

        const discount = Math.min(
            (amount * coupon.discountPercentage) / 100,
            coupon.maxDiscountAmount
        );

        res.json({
            code: coupon.code,
            discount,
            finalAmount: amount - discount,
        });
    } catch (error) {
        next(error);
    }
};

// Helper function for internal controller use
export const getValidatedCoupon = async (code, amount) => {
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) throw new Error('Coupon not found or inactive');
    if (new Date() > new Date(coupon.expirationDate)) throw new Error('Coupon has expired');
    if (amount < coupon.minOrderAmount) throw new Error(`Min order ${coupon.minOrderAmount} required`);

    const discount = Math.min(
        (amount * coupon.discountPercentage) / 100,
        coupon.maxDiscountAmount
    );

    return { code: coupon.code, discount };
};
