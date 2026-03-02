import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ChevronLeft, MapPin, Ticket, CreditCard, ChevronRight, CheckCircle2, AlertCircle, Home as HomeIcon, Briefcase, Plus, Info, XCircle } from 'lucide-react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
    const navigate = useNavigate();
    const { user, fetchProfile } = useAuth();
    const { cartItems, restaurantId, totalAmount, clearCart } = useCart();

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [newAddress, setNewAddress] = useState({
        type: 'home',
        pincode: '',
        addressLine: ''
    });
    const [addingAddress, setAddingAddress] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [applyingCoupon, setApplyingCoupon] = useState(false);

    const handleAddAddress = async (e) => {
        e.preventDefault();
        setAddingAddress(true);
        setError('');
        try {
            const { data } = await api.post('/users/address', newAddress);
            await fetchProfile(); // Refresh user data to get the new address (with its ID)
            setShowAddressModal(false);
            setNewAddress({ type: 'home', pincode: '', addressLine: '' });

            // The new address should be the last one in the refreshed user.addresses
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add address');
        } finally {
            setAddingAddress(false);
        }
    };

    // Auto-select newly added address
    useEffect(() => {
        if (user && user.addresses && user.addresses.length > 0) {
            // Find the most recently added address
            const mostRecent = user.addresses[user.addresses.length - 1];
            // If no address selected OR we just added a new one, select it
            if (!selectedAddress) {
                setSelectedAddress(mostRecent);
            }
        }
    }, [user?.addresses]);

    useEffect(() => {
        if (!user) {
            navigate('/login?redirect=checkout');
        }
        if (cartItems.length === 0 && !success) {
            navigate('/');
        }
        if (user && user.addresses && user.addresses.length > 0) {
            setSelectedAddress(user.addresses[0]);
        }
    }, [user, cartItems, navigate, success]);

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setApplyingCoupon(true);
        setError('');
        try {
            const { data } = await api.post('/coupons/validate', {
                code: couponCode,
                amount: totalAmount
            });
            setDiscount(data.discount);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid coupon code');
            setDiscount(0);
        } finally {
            setApplyingCoupon(false);
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            setError('Please select a delivery address');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const orderData = {
                restaurantId,
                items: cartItems.map(item => ({
                    menuItem: item._id,
                    quantity: item.quantity
                })),
                couponCode: discount > 0 ? couponCode : null,
                deliveryPincode: selectedAddress.pincode
            };

            await api.post('/orders/create', orderData);
            setSuccess(true);
            setTimeout(() => {
                clearCart();
                navigate('/'); // Redirect to orders in real app
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white px-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                >
                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={64} />
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 mb-2">Order Placed!</h2>
                    <p className="text-xl text-gray-500 mb-8">Your delicious food is being prepared.</p>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden max-w-xs mx-auto">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 3 }}
                            className="h-full bg-zomato-red"
                        ></motion.div>
                    </div>
                    <p className="text-sm text-gray-400 mt-4 italic text-sm">Redirecting to your orders...</p>
                </motion.div>
            </div>
        );
    }

    const finalAmount = totalAmount - discount;

    return (
        <div className="min-h-screen pt-24 pb-20 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* Left Section: Details */}
                <div className="lg:col-span-2 space-y-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-500 hover:text-gray-800 transition-colors mb-4"
                    >
                        <ChevronLeft size={20} className="mr-1" />
                        Back to Menu
                    </button>

                    {/* Address Selection */}
                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                            <MapPin className="text-zomato-red mr-2" size={24} />
                            Delivery Address
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {user?.addresses?.map((addr) => (
                                <div
                                    key={addr._id}
                                    onClick={() => setSelectedAddress(addr)}
                                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative ${selectedAddress?._id === addr._id
                                        ? 'border-zomato-red bg-red-50'
                                        : 'border-gray-100 hover:border-gray-200 bg-white'
                                        }`}
                                >
                                    <div className="flex items-center mb-2">
                                        {addr.type === 'home' ? <HomeIcon size={18} className="text-gray-400 mr-2" /> : <Briefcase size={18} className="text-gray-400 mr-2" />}
                                        <span className="font-bold uppercase tracking-widest text-xs text-gray-400">{addr.type}</span>
                                    </div>
                                    <p className="text-gray-800 font-medium mb-1">{addr.addressLine}</p>
                                    <p className="text-gray-500 text-sm">Pincode: {addr.pincode}</p>

                                    {selectedAddress?._id === addr._id && (
                                        <div className="absolute top-3 right-3 text-zomato-red">
                                            <CheckCircle2 size={20} />
                                        </div>
                                    )}
                                </div>
                            ))}

                            <button
                                onClick={() => setShowAddressModal(true)}
                                className="p-4 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-zomato-red hover:text-zomato-red hover:bg-red-50/30 transition-all"
                            >
                                <Plus size={24} className="mb-2" />
                                <span className="font-bold text-sm">Add New Address</span>
                            </button>
                        </div>
                    </section>

                    {/* Payment Selection (Only COD for now) */}
                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                            <CreditCard className="text-zomato-red mr-2" size={24} />
                            Payment Method
                        </h3>
                        <div className="flex items-center p-4 rounded-xl border-2 border-zomato-red bg-red-50">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-zomato-red mr-4 shadow-sm">
                                <span className="font-black">₹</span>
                            </div>
                            <div>
                                <p className="font-bold text-gray-800">Cash on Delivery (COD)</p>
                                <p className="text-sm text-gray-500">Pay when your food arrives</p>
                            </div>
                            <div className="ml-auto text-zomato-red">
                                <CheckCircle2 size={20} />
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Section: Summary */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-6">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            <div className="p-6 bg-gray-50 border-b border-gray-100">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                    <ShoppingBag className="text-zomato-red mr-2" size={20} />
                                    Order Summary
                                </h3>
                            </div>

                            <div className="p-6">
                                {/* Items List */}
                                <div className="space-y-4 mb-8">
                                    {cartItems.map(item => (
                                        <div key={item._id} className="flex justify-between items-start text-sm">
                                            <div className="flex-1">
                                                <div className="flex items-center mb-0.5">
                                                    <div className={`w-3 h-3 border-2 mr-2 flex items-center justify-center ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                                                        <div className={`w-1 h-1 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                                                    </div>
                                                    <span className="font-medium text-gray-800 truncate block max-w-[150px]">
                                                        {item.name} x {item.quantity}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="font-bold text-gray-700">₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Coupon Section */}
                                <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Ticket className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                            <input
                                                type="text"
                                                placeholder="Enter coupon"
                                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-zomato-red outline-none uppercase font-bold"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            />
                                        </div>
                                        <button
                                            onClick={handleApplyCoupon}
                                            disabled={applyingCoupon || !couponCode}
                                            className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-900 disabled:opacity-50 transition-all"
                                        >
                                            {applyingCoupon ? '...' : 'Apply'}
                                        </button>
                                    </div>
                                    {error && <p className="text-xs text-red-500 mt-2 flex items-center font-medium"><AlertCircle size={12} className="mr-1" /> {error}</p>}
                                    {discount > 0 && <p className="text-xs text-green-600 mt-2 font-bold flex items-center"><CheckCircle2 size={12} className="mr-1" /> Coupon Applied! Save ₹{discount}</p>}
                                </div>

                                {/* Totals */}
                                <div className="space-y-3 pt-4 border-t border-gray-100 mb-8">
                                    <div className="flex justify-between text-gray-500 text-sm">
                                        <span>Total Amount</span>
                                        <span>₹{totalAmount}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-green-600 text-sm font-bold">
                                            <span>Coupon Discount</span>
                                            <span>-₹{discount}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-gray-500 text-sm">
                                        <span>Delivery Charge</span>
                                        <span className="text-green-600 font-bold uppercase text-[10px] mt-1">Free</span>
                                    </div>
                                    <div className="flex justify-between text-gray-800 text-lg font-black pt-3 border-t border-gray-100">
                                        <span>To Pay</span>
                                        <span>₹{finalAmount}</span>
                                    </div>
                                </div>

                                {/* Feedback Info */}
                                <div className="bg-orange-50 p-4 rounded-xl flex items-start mb-6">
                                    <Info className="text-orange-500 mt-0.5 mr-2" size={16} />
                                    <p className="text-[11px] text-orange-700 leading-tight">
                                        Food once ordered cannot be cancelled as it is freshly prepared for you.
                                    </p>
                                </div>

                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={loading}
                                    className="w-full bg-zomato-red text-white py-4 rounded-xl font-black text-xl hover:bg-opacity-90 transform active:scale-95 transition-all shadow-lg flex justify-center items-center"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>Place Order <ChevronRight className="ml-1" size={24} /></>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Address Modal */}
            <AnimatePresence>
                {showAddressModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAddressModal(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-[110] overflow-hidden"
                        >
                            <div className="p-6 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-gray-800">Add New Address</h3>
                                <button onClick={() => setShowAddressModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <XCircle size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleAddAddress} className="p-6 space-y-4">
                                <div className="flex gap-4 p-1 bg-gray-100 rounded-xl">
                                    {['home', 'work'].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setNewAddress({ ...newAddress, type })}
                                            className={`flex-1 py-2 rounded-lg font-bold text-sm capitalize transition-all ${newAddress.type === type ? 'bg-white text-zomato-red shadow-sm' : 'text-gray-500'}`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Pincode</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. 110001"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-zomato-red outline-none transition-all font-medium"
                                        value={newAddress.pincode}
                                        onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Address Line</label>
                                    <textarea
                                        required
                                        rows="3"
                                        placeholder="Flat no, Building, Street name..."
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-zomato-red outline-none transition-all font-medium"
                                        value={newAddress.addressLine}
                                        onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={addingAddress}
                                    className="w-full bg-zomato-red text-white py-4 rounded-xl font-black text-lg hover:bg-red-600 transition-all shadow-lg flex justify-center items-center"
                                >
                                    {addingAddress ? (
                                        <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        'Save & Use Address'
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Checkout;
