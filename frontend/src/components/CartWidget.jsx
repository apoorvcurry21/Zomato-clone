import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ChevronRight, X, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartWidget = () => {
    const { totalItems, totalAmount, cartItems, addItem, removeItem } = useCart();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Don't show on checkout page or if cart is empty
    if (location.pathname === '/checkout' || totalItems === 0) return null;

    return (
        <>
            {/* Floating Bubble */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 bg-gray-900 text-white w-16 h-16 rounded-full shadow-2xl z-50 flex items-center justify-center border-4 border-white group"
            >
                <ShoppingBag size={28} />
                <div className="absolute -top-1 -right-1 bg-zomato-red text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                    {totalItems}
                </div>
                {/* Tooltip */}
                <div className="absolute right-20 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity translate-x-10 group-hover:translate-x-0 pointer-events-none">
                    View Cart (₹{totalAmount})
                </div>
            </motion.button>

            {/* Sidebar Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-[70] flex flex-col"
                        >
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                    <ShoppingBag className="text-zomato-red mr-2" size={24} />
                                    Your Cart
                                </h3>
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors bg-transparent border-none">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {cartItems.map(item => (
                                    <div key={item._id} className="flex justify-between items-center">
                                        <div className="flex-1">
                                            <div className="flex items-center mb-1">
                                                <div className={`w-3 h-3 border mr-2 flex items-center justify-center ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                                                    <div className={`w-1 h-1 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                                                </div>
                                                <h4 className="font-bold text-gray-800 text-sm truncate max-w-[150px]">{item.name}</h4>
                                            </div>
                                            <p className="text-gray-500 text-xs">₹{item.price}</p>
                                        </div>
                                        <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100">
                                            <button onClick={() => removeItem(item._id)} className="p-1 hover:text-zomato-red bg-transparent border-none flex items-center justify-center"><Minus size={14} /></button>
                                            <span className="mx-3 text-sm font-black text-gray-700">{item.quantity}</span>
                                            <button onClick={() => addItem(item, item.restaurant)} className="p-1 hover:text-zomato-red bg-transparent border-none flex items-center justify-center"><Plus size={14} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 font-medium">Subtotal</span>
                                    <span className="text-xl font-black text-gray-900">₹{totalAmount}</span>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        navigate('/checkout');
                                    }}
                                    className="w-full bg-zomato-red text-white py-4 rounded-xl font-black text-lg shadow-lg hover:shadow-red-200 transition-all flex items-center justify-center"
                                >
                                    Proceed to Checkout <ChevronRight className="ml-1" size={24} />
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default CartWidget;
