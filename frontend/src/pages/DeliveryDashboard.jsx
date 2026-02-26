import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bike,
    MapPin,
    Phone,
    CheckCircle2,
    Clock,
    ShoppingBag,
    ArrowRight,
    Navigation,
    User
} from 'lucide-react';
import api from '../api/axios';
import DashboardLayout from '../components/DashboardLayout';

const DeliveryDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [isOnline, setIsOnline] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDeliveryData();
    }, []);

    const fetchDeliveryData = async () => {
        setLoading(true);
        try {
            const profileRes = await api.get('/delivery/profile');
            setIsOnline(profileRes.data.onlineStatus);

            const ordersRes = await api.get('/orders/delivery-orders');
            setOrders(ordersRes.data);
        } catch (err) {
            console.error('Error fetching delivery data:', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async () => {
        try {
            await api.patch('/delivery/toggle-availability');
            setIsOnline(!isOnline);
        } catch (err) {
            console.error('Failed to toggle status:', err);
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            await api.patch(`/orders/${orderId}/status`, { status });
            setOrders(orders.map(o => o._id === orderId ? { ...o, status } : o));
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    if (loading) return (
        <DashboardLayout>
            <div className="flex animate-pulse flex-col space-y-4">
                <div className="h-40 bg-gray-200 rounded-2xl w-full"></div>
                <div className="h-64 bg-gray-200 rounded-2xl w-full"></div>
            </div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                {/* Availability Hero */}
                <div className={`p-8 rounded-3xl shadow-xl mb-10 transition-all duration-500 border-2 ${isOnline
                        ? 'bg-gray-900 border-gray-800 text-white'
                        : 'bg-white border-gray-100 text-gray-800'
                    }`}>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-6">
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${isOnline ? 'bg-zomato-red' : 'bg-gray-100'}`}>
                                <Bike size={40} className={isOnline ? 'text-white' : 'text-gray-400'} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black mb-1">{isOnline ? 'You are Online' : 'You are Offline'}</h2>
                                <p className={`font-medium ${isOnline ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {isOnline ? 'Ready to deliver delicious meals!' : 'Switch on to start receiving orders'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={toggleStatus}
                            className={`px-10 py-4 rounded-2xl font-black text-xl transition-all shadow-lg active:scale-95 ${isOnline
                                    ? 'bg-white text-gray-900 hover:bg-gray-100'
                                    : 'bg-zomato-red text-white hover:bg-opacity-90'
                                }`}
                        >
                            {isOnline ? 'Go Offline' : 'Go Online'}
                        </button>
                    </div>
                </div>

                <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center">
                    <ShoppingBag className="text-zomato-red mr-3" />
                    Assigned Deliveries
                </h3>

                <div className="space-y-6">
                    {orders.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                            <Navigation size={48} className="mx-auto text-gray-200 mb-4" />
                            <p className="text-gray-500 font-bold">No orders assigned to you yet.</p>
                        </div>
                    ) : (
                        orders.map(order => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={order._id}
                                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
                            >
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="space-y-4 flex-1">
                                        <div className="flex items-center space-x-3">
                                            <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-black text-gray-500 uppercase">
                                                ID: {order._id.slice(-6)}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${order.status === 'delivered' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-500'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 flex-shrink-0">
                                                <Utensils size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Pick up from</p>
                                                <h4 className="font-bold text-gray-800">{order.restaurantId?.name || 'Restaurant'}</h4>
                                                <p className="text-sm text-gray-500">{order.restaurantId?.address?.addressLine || 'Address not available'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
                                                <MapPin size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Deliver to</p>
                                                <h4 className="font-bold text-gray-800">{order.customerId?.name || 'Customer'}</h4>
                                                <p className="text-sm text-gray-500">Pincode: {order.deliveryPincode}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:w-64 flex flex-col justify-center space-y-3">
                                        {order.status === 'ready' && (
                                            <button
                                                onClick={() => updateOrderStatus(order._id, 'picked')}
                                                className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-black transition-all"
                                            >
                                                Picked Up
                                            </button>
                                        )}
                                        {order.status === 'picked' && (
                                            <button
                                                onClick={() => updateOrderStatus(order._id, 'out_for_delivery')}
                                                className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-orange-600 transition-all"
                                            >
                                                Out for Delivery
                                            </button>
                                        )}
                                        {order.status === 'out_for_delivery' && (
                                            <button
                                                onClick={() => updateOrderStatus(order._id, 'delivered')}
                                                className="w-full bg-green-600 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-green-700 transition-all"
                                            >
                                                Mark Delivered
                                            </button>
                                        )}
                                        {order.status === 'delivered' && (
                                            <div className="text-center p-4 bg-green-50 text-green-600 rounded-2xl font-black flex items-center justify-center">
                                                <CheckCircle2 size={24} className="mr-2" /> Completed
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DeliveryDashboard;
