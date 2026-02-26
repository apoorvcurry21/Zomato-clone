import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [restaurantId, setRestaurantId] = useState(null);

    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        const storedRestId = localStorage.getItem('cartRestaurantId');
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
        if (storedRestId) {
            setRestaurantId(storedRestId);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
        localStorage.setItem('cartRestaurantId', restaurantId || '');
    }, [cartItems, restaurantId]);

    const addItem = (item, resId) => {
        if (restaurantId && restaurantId !== resId) {
            // Option: Clear cart if adding from a different restaurant
            if (window.confirm('Adding items from a new restaurant will clear your current cart. Continue?')) {
                setCartItems([{ ...item, quantity: 1 }]);
                setRestaurantId(resId);
            }
            return;
        }

        setRestaurantId(resId);
        setCartItems(prevItems => {
            const existingItem = prevItems.find(i => i._id === item._id);
            if (existingItem) {
                return prevItems.map(i =>
                    i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prevItems, { ...item, quantity: 1 }];
        });
    };

    const removeItem = (itemId) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(i => i._id === itemId);
            if (existingItem.quantity === 1) {
                const newItems = prevItems.filter(i => i._id !== itemId);
                if (newItems.length === 0) setRestaurantId(null);
                return newItems;
            }
            return prevItems.map(i =>
                i._id === itemId ? { ...i, quantity: i.quantity - 1 } : i
            );
        });
    };

    const clearCart = () => {
        setCartItems([]);
        setRestaurantId(null);
    };

    const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            restaurantId,
            addItem,
            removeItem,
            clearCart,
            totalAmount,
            totalItems
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
