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
            restaurant.cuisine = req.body.cuisine || restaurant.cuisine;

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

// @desc    Get restaurants available in a pincode
// @route   GET /api/restaurants
// @access  Public
export const getAvailableRestaurants = async (req, res, next) => {
    try {
        const { pincode } = req.query;

        if (!pincode) {
            res.status(400);
            throw new Error('Pincode is mandatory');
        }

        const restaurants = await Restaurant.find({
            pincodes: pincode,
            isOpen: true
        });

        res.json(restaurants);
    } catch (error) {
        next(error);
    }
};

// @desc    Get featured restaurants
// @route   GET /api/restaurants/featured
// @access  Public
export const getFeaturedRestaurants = async (req, res, next) => {
    try {
        const restaurants = await Restaurant.find({ isFeatured: true, isOpen: true }).limit(10);
        res.json(restaurants);
    } catch (error) {
        next(error);
    }
};

// @desc    Search restaurants by name or cuisine
// @route   GET /api/restaurants/search
// @access  Public
export const searchRestaurants = async (req, res, next) => {
    try {
        const { query } = req.query;

        if (!query) {
            res.status(400);
            throw new Error('Search query is required');
        }

        const restaurants = await Restaurant.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { cuisine: { $regex: query, $options: 'i' } }
            ],
            isOpen: true
        });

        res.json(restaurants);
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
// @desc    Get restaurant by ID
// @route   GET /api/restaurants/:id
// @access  Public
export const getRestaurantById = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            res.status(404);
            throw new Error('Restaurant not found');
        }

        res.json(restaurant);
    } catch (error) {
        next(error);
    }
};
// @desc    Get current user's restaurant profile
// @route   GET /api/restaurants/my-restaurant
// @access  Private/Restaurant
export const getMyRestaurantProfile = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findOne({ owner: req.user._id });
        if (!restaurant) {
            res.status(404);
            throw new Error('Restaurant not found');
        }
        res.json(restaurant);
    } catch (error) {
        next(error);
    }
};
