import MenuItem from '../models/MenuItem.js';
import Restaurant from '../models/Restaurant.js';

// @desc    Add a menu item
// @route   POST /api/menu/:restaurantId
// @access  Private/Restaurant
export const addMenuItem = async (req, res, next) => {
    try {
        const { name, description, price, category, isVeg, image } = req.body;
        const { restaurantId } = req.params;

        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant) {
            res.status(404);
            throw new Error('Restaurant not found');
        }

        // Check if the user is the owner
        if (restaurant.owner.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to add menu items to this restaurant');
        }

        const menuItem = await MenuItem.create({
            restaurant: restaurantId,
            name,
            description,
            price,
            category,
            isVeg,
            image
        });

        res.status(201).json(menuItem);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a menu item
// @route   PUT /api/menu/:id
// @access  Private/Restaurant
export const updateMenuItem = async (req, res, next) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id).populate('restaurant');

        if (!menuItem) {
            res.status(404);
            throw new Error('Menu item not found');
        }

        // Check ownership
        if (menuItem.restaurant.owner.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to update this menu item');
        }

        const { name, description, price, category, isVeg, isAvailable, image } = req.body;

        menuItem.name = name || menuItem.name;
        menuItem.description = description || menuItem.description;
        menuItem.price = price !== undefined ? price : menuItem.price;
        menuItem.category = category || menuItem.category;
        menuItem.isVeg = isVeg !== undefined ? isVeg : menuItem.isVeg;
        menuItem.isAvailable = isAvailable !== undefined ? isAvailable : menuItem.isAvailable;
        menuItem.image = image || menuItem.image;

        const updatedMenuItem = await menuItem.save();
        res.json(updatedMenuItem);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a menu item
// @route   DELETE /api/menu/:id
// @access  Private/Restaurant
export const deleteMenuItem = async (req, res, next) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id).populate('restaurant');

        if (!menuItem) {
            res.status(404);
            throw new Error('Menu item not found');
        }

        // Check ownership
        if (menuItem.restaurant.owner.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to delete this menu item');
        }

        await menuItem.deleteOne();
        res.json({ message: 'Menu item removed' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all menu items for a restaurant
// @route   GET /api/menu/:restaurantId
// @access  Public
export const getRestaurantMenu = async (req, res, next) => {
    try {
        const menuItems = await MenuItem.find({ restaurant: req.params.restaurantId });
        res.json(menuItems);
    } catch (error) {
        next(error);
    }
};
