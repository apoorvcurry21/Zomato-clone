import Restaurant from '../models/Restaurant.js';

// @desc    Update restaurant profile
// @route   PUT /api/restaurants/profile
// @access  Private/Restaurant
export const updateRestaurantProfile = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findOne({ owner: req.user._id });

        if (restaurant) {
            restaurant.name = req.body.name || restaurant.name;
            restaurant.address = req.body.address || restaurant.address;
            restaurant.contact = req.body.contact || restaurant.contact;
            restaurant.pincodes = req.body.pincodes || restaurant.pincodes;
            restaurant.estimatedPrepTime = req.body.estimatedPrepTime || restaurant.estimatedPrepTime;

            const updatedRestaurant = await restaurant.save();
            res.json(updatedRestaurant);
        } else {
            res.status(404);
            throw new Error('Restaurant not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle restaurant open/closed status
// @route   PATCH /api/restaurants/status
// @access  Private/Restaurant
export const toggleRestaurantStatus = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findOne({ owner: req.user._id });

        if (restaurant) {
            restaurant.isOpen = !restaurant.isOpen;
            const updatedRestaurant = await restaurant.save();
            res.json({
                message: `Restaurant is now ${updatedRestaurant.isOpen ? 'Open' : 'Closed'}`,
                isOpen: updatedRestaurant.isOpen
            });
        } else {
            res.status(404);
            throw new Error('Restaurant not found');
        }
    } catch (error) {
        next(error);
    }
};
