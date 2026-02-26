import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Clock, MapPin, ChevronRight, XCircle } from 'lucide-react';
import api from '../api/axios';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders/myorders');
            setOrders(res.data);
        } catch (err) {
            console.error('Failed to fetch orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;
        try {
            await api.patch(`/orders/${orderId}/cancel`);
            setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: 'cancelled' } : o));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to cancel order.');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'placed': return 'bg-blue-50 text-blue-600';
            case 'preparing': return 'bg-orange-50 text-orange-600';
            case 'ready': return 'bg-yellow-50 text-yellow-600';
            case 'out-for-delivery': return 'bg-purple-50 text-purple-600';
            case 'delivered': return 'bg-green-50 text-green-600';
            case 'cancelled': return 'bg-red-50 text-red-600';
            default: return 'bg-gray-50 text-gray-600';
        }
    };

    if (loading) return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
                {[1, 2, 3].map(i => <div key={i} className="h-40 bg-gray-100 rounded-2xl"></div>)}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-black text-gray-800">My Orders</h1>
                <div className="bg-gray-100 p-2 rounded-xl text-gray-500">
                    <ShoppingBag size={20} />
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-200">
                    <ShoppingBag size={48} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-gray-500 font-bold mb-4">You haven't placed any orders yet.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-zomato-red text-white px-8 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all"
                    >
                        Browse Restaurants
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={order._id}
                            className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 overflow-hidden relative"
                        >
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.orderStatus)}`}>
                                            {order.orderStatus.replace(/-/g, ' ')}
                                        </span>
                                        <span className="text-gray-400 text-xs">{new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                    </div>

                                    <h3 className="text-xl font-black text-gray-800 mb-1">{order.restaurant?.name}</h3>
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-1">{order.items.map(i => `${i.menuItem.name} x ${i.quantity}`).join(', ')}</p>

                                    <div className="flex items-center gap-4 text-sm font-bold text-gray-800">
                                        <span>₹{order.totalAmount}</span>
                                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                        <span className="text-gray-400 font-medium">#{order._id.slice(-6)}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-center gap-3 md:w-48">
                                    {['placed', 'accepted', 'preparing', 'ready', 'out-for-delivery'].includes(order.orderStatus) && (
                                        <button
                                            onClick={() => navigate(`/track/${order._id}`)}
                                            className="bg-gray-900 text-white py-3 rounded-2xl font-black text-sm flex items-center justify-center hover:bg-black transition-all group"
                                        >
                                            Track Order <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    )}
                                    {order.orderStatus === 'placed' && (
                                        <button
                                            onClick={() => handleCancel(order._id)}
                                            className="text-red-500 font-bold text-sm hover:underline"
                                        >
                                            Cancel Order
                                        </button>
                                    )}
                                    {order.orderStatus === 'delivered' && (
                                        <button
                                            onClick={() => navigate(`/restaurant/${order.restaurant?._id}`)}
                                            className="bg-white border-2 border-gray-100 text-gray-800 py-3 rounded-2xl font-black text-sm hover:bg-gray-50 transition-all text-center"
                                        >
                                            Order Again
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
