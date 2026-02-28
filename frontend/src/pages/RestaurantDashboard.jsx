import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingBag,
    Utensils,
    Clock,
    CheckCircle2,
    XCircle,
    Plus,
    Edit2,
    Trash2,
    ArrowRight,
    Search,
    Filter,
    Store
} from 'lucide-react';
import api from '../api/axios';
import DashboardLayout from '../components/DashboardLayout';

const RestaurantDashboard = () => {
    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toggling, setToggling] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);
        try {
            const resProfile = await api.get('/restaurants/my-restaurant');
            if (resProfile.data) {
                setRestaurant(resProfile.data);

                const ordersRes = await api.get('/orders/restaurant-orders');
                setOrders(ordersRes.data);

                const menuRes = await api.get(`/restaurants/${resProfile.data._id}/menu`);
                setMenuItems(menuRes.data);
            } else {
                setError('No restaurant found for this account.');
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError(err.response?.data?.message || 'Failed to load dashboard data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            await api.patch(`/orders/${orderId}/status`, { status });
            // Update local state
            setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: status } : o));
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    const toggleStoreStatus = async () => {
        if (toggling) return;
        setToggling(true);
        try {
            const res = await api.patch('/restaurants/status');
            setRestaurant({ ...restaurant, isOpen: res.data.isOpen });
        } catch (err) {
            console.error('Failed to toggle status:', err);
            alert('Failed to update store status. Please try again.');
        } finally {
            setToggling(false);
        }
    };

    if (loading) return (
        <DashboardLayout>
            <div className="flex animate-pulse flex-col space-y-4">
                <div className="h-32 bg-gray-200 rounded-2xl w-full"></div>
                <div className="h-64 bg-gray-200 rounded-2xl w-full"></div>
            </div>
        </DashboardLayout>
    );

    if (error) return (
        <DashboardLayout>
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-red-200">
                <XCircle size={48} className="text-red-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Dashboard</h3>
                <p className="text-gray-500 mb-6">{error}</p>
                <button
                    onClick={fetchDashboardData}
                    className="bg-zomato-red text-white px-8 py-3 rounded-xl font-bold hover:bg-red-600 transition-all"
                >
                    Try Again
                </button>
            </div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto">
                {/* Header Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">New Orders</p>
                        <h3 className="text-3xl font-black text-gray-800">{orders.filter(o => o.orderStatus === 'placed').length}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">In Preparation</p>
                        <h3 className="text-3xl font-black text-orange-500">
                            {orders.filter(o => ['accepted', 'preparing'].includes(o.orderStatus)).length}
                        </h3>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Ready</p>
                        <h3 className="text-3xl font-black text-green-500">{orders.filter(o => o.orderStatus === 'ready').length}</h3>
                    </div>
                    <div className="bg-zomato-red p-6 rounded-2xl shadow-lg border-2 border-white flex justify-between items-center text-white">
                        <div>
                            <p className="text-white/80 text-sm font-bold uppercase tracking-wider mb-1">Store Status</p>
                            <h3 className="text-2xl font-black">{restaurant?.isOpen ? 'Online' : 'Offline'}</h3>
                        </div>
                        <button
                            onClick={toggleStoreStatus}
                            disabled={toggling}
                            className={`w-12 h-6 rounded-full relative transition-colors ${toggling ? 'opacity-50 cursor-not-allowed' : ''} ${restaurant?.isOpen ? 'bg-white' : 'bg-gray-400/30'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${restaurant?.isOpen ? 'right-1 bg-zomato-red' : 'left-1 bg-white'}`}></div>
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-8 border-b border-gray-200 mb-8">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`pb-4 px-2 font-bold transition-all relative ${activeTab === 'orders' ? 'text-gray-900' : 'text-gray-400'}`}
                    >
                        Active Orders
                        {activeTab === 'orders' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-zomato-red rounded-t-full" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('menu')}
                        className={`pb-4 px-2 font-bold transition-all relative ${activeTab === 'menu' ? 'text-gray-900' : 'text-gray-400'}`}
                    >
                        Menu Management
                        {activeTab === 'menu' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-zomato-red rounded-t-full" />}
                    </button>
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'orders' ? (
                        <motion.div
                            key="orders"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            {orders.length === 0 ? (
                                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                                    <ShoppingBag size={48} className="mx-auto text-gray-200 mb-4" />
                                    <p className="text-gray-500 font-bold">No incoming orders yet.</p>
                                </div>
                            ) : (
                                orders.map(order => (
                                    <div key={order._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-black text-gray-500 uppercase tracking-widest">
                                                    #{order._id.slice(-6)}
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tighter ${order.orderStatus === 'placed' ? 'bg-gray-100 text-gray-500' :
                                                        order.orderStatus === 'accepted' ? 'bg-blue-50 text-blue-500' :
                                                            order.orderStatus === 'preparing' ? 'bg-orange-50 text-orange-500' :
                                                                'bg-green-50 text-green-500'
                                                    }`}>
                                                    {order.orderStatus}
                                                </span>
                                            </div>
                                            <div className="text-sm font-bold text-gray-800 mb-1">
                                                {order.items.map(i => `${i.menuItem.name} x ${i.quantity}`).join(', ')}
                                            </div>
                                            <p className="text-gray-400 text-xs">Total Amount: ₹{order.totalAmount}</p>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            {order.orderStatus === 'placed' && (
                                                <button
                                                    onClick={() => updateOrderStatus(order._id, 'accepted')}
                                                    className="bg-gray-900 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-black transition-all"
                                                >
                                                    Accept Order
                                                </button>
                                            )}
                                            {order.orderStatus === 'accepted' && (
                                                <button
                                                    onClick={() => updateOrderStatus(order._id, 'preparing')}
                                                    className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all"
                                                >
                                                    Start Preparing
                                                </button>
                                            )}
                                            {order.orderStatus === 'preparing' && (
                                                <button
                                                    onClick={() => updateOrderStatus(order._id, 'ready')}
                                                    className="bg-orange-500 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-orange-600 transition-all"
                                                >
                                                    Mark as Ready
                                                </button>
                                            )}
                                            {order.orderStatus === 'ready' && (
                                                <div className="flex items-center text-green-600 text-sm font-bold bg-green-50 px-6 py-2 rounded-xl">
                                                    <CheckCircle2 size={18} className="mr-2" />
                                                    Waiting for Pickup
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="menu"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                    <h4 className="font-bold text-gray-800">Menu Items ({menuItems.length})</h4>
                                    <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-black transition-all">
                                        <Plus size={18} className="mr-2" /> Add Item
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 text-gray-400 text-xs font-black uppercase tracking-widest">
                                            <tr>
                                                <th className="px-6 py-4">Item</th>
                                                <th className="px-6 py-4">Category</th>
                                                <th className="px-6 py-4">Price</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {menuItems.map(item => (
                                                <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center">
                                                            <div className={`w-3 h-3 border-2 mr-3 flex items-center justify-center ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                                                                <div className={`w-1 h-1 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                                                            </div>
                                                            <span className="font-bold text-gray-800">{item.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">{item.category}</td>
                                                    <td className="px-6 py-4 font-bold text-gray-800">₹{item.price}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.isAvailable ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                                            {item.isAvailable ? 'Available' : 'Sold Out'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end space-x-2">
                                                            <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-white rounded-lg transition-all shadow-sm"><Edit2 size={16} /></button>
                                                            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-all shadow-sm"><Trash2 size={16} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
};

export default RestaurantDashboard;
