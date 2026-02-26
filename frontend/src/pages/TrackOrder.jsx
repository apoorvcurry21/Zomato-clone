import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingBag,
    ChefHat,
    CheckCircle2,
    Bike,
    Timer,
    ChevronLeft,
    Phone,
    MapPin,
    Star,
    MessageSquare
} from 'lucide-react';
import api from '../api/axios';
import RatingModal from '../components/RatingModal';

const TrackOrder = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showRating, setShowRating] = useState(false);
    const pollInterval = useRef(null);

    const stages = [
        { key: 'placed', label: 'Order Placed', icon: ShoppingBag },
        { key: 'accepted', label: 'Accepted', icon: ChefHat },
        { key: 'preparing', label: 'Preparing', icon: ChefHat },
        { key: 'ready', label: 'Ready for Pickup', icon: ShoppingBag },
        { key: 'out-for-delivery', label: 'Out for Delivery', icon: Bike },
        { key: 'delivered', label: 'Delivered', icon: CheckCircle2 }
    ];

    const getCurrentStageIndex = () => {
        if (!order) return 0;
        const idx = stages.findIndex(s => s.key === order.orderStatus);
        return idx === -1 ? 0 : idx;
    };

    const fetchOrderDetails = async (isPoll = false) => {
        try {
            const res = await api.get(`/orders/${orderId}`);
            setOrder(res.data);
            if (res.data.orderStatus === 'delivered' || res.data.orderStatus === 'cancelled') {
                clearInterval(pollInterval.current);
            }
        } catch (err) {
            console.error('Polling failed:', err);
            if (!isPoll) setLoading(false);
        } finally {
            if (!isPoll) setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderDetails();
        pollInterval.current = setInterval(() => fetchOrderDetails(true), 10000);
        return () => clearInterval(pollInterval.current);
    }, [orderId]);

    useEffect(() => {
        if (order?.orderStatus === 'delivered') {
            setShowRating(true);
        }
    }, [order?.orderStatus]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-12 h-12 border-4 border-zomato-red border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!order) return (
        <div className="min-h-screen pt-32 text-center px-4">
            <h2 className="text-2xl font-black text-gray-800 mb-4">Order not found</h2>
            <Link to="/myorders" className="text-zomato-red font-bold">Back to orders</Link>
        </div>
    );

    const currentIdx = getCurrentStageIndex();

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6 flex items-center justify-between">
                    <button onClick={() => navigate('/myorders')} className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
                        <ChevronLeft />
                    </button>
                    <div className="text-center">
                        <h1 className="text-lg font-black text-gray-800">Track Order</h1>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">#{order._id.slice(-6)}</p>
                    </div>
                    <div className="w-10"></div>
                </div>

                {/* Hero Status */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-6 text-center">
                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        >
                            {React.createElement(stages[currentIdx].icon, { size: 40, className: "text-zomato-red" })}
                        </motion.div>
                    </div>
                    <h2 className="text-2xl font-black text-gray-800 mb-2">
                        {order.orderStatus === 'cancelled' ? 'Order Cancelled' : stages[currentIdx].label}
                    </h2>
                    {order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled' && (
                        <div className="flex items-center justify-center gap-2 text-gray-500 font-bold">
                            <Timer size={18} className="text-zomato-red" />
                            <span>Estimated Arriving in {order.restaurant?.estimatedPrepTime || 30} mins</span>
                        </div>
                    )}
                </div>

                {/* Tracking Stepper */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-6">
                    <div className="relative">
                        <div className="absolute left-4 top-0 bottom-0 w-1 bg-gray-100"></div>
                        <div
                            className="absolute left-4 top-0 w-1 bg-zomato-red transition-all duration-1000 origin-top"
                            style={{ height: `${(currentIdx / (stages.length - 1)) * 100}%` }}
                        ></div>

                        <div className="space-y-10 relative">
                            {stages.map((stage, index) => {
                                const isCompleted = index <= currentIdx;
                                const isCurrent = index === currentIdx;
                                const Icon = stage.icon;

                                return (
                                    <div key={stage.key} className="flex items-center gap-6">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center z-10 transition-colors duration-500 border-4 border-white shadow-sm ${isCompleted ? 'bg-zomato-red text-white' : 'bg-gray-200 text-gray-400'
                                            }`}>
                                            <Icon size={16} />
                                        </div>
                                        <div className="flex-1">
                                            <p className={`font-black uppercase tracking-tighter text-sm ${isCurrent ? 'text-gray-900 border-l-4 border-zomato-red pl-3' :
                                                    isCompleted ? 'text-gray-500' : 'text-gray-300'
                                                }`}>
                                                {stage.label}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Partner Details */}
                {order.deliveryPartner && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gray-900 text-white p-6 rounded-3xl shadow-xl flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                <Bike size={24} className="text-white" />
                            </div>
                            <div>
                                <p className="text-white/50 text-xs font-black uppercase tracking-widest mb-1">Delivering Partner</p>
                                <h4 className="font-bold text-lg">{order.deliveryPartner.name}</h4>
                            </div>
                        </div>
                        <a href={`tel:${order.deliveryPartner.phone}`} className="p-4 bg-zomato-red rounded-2xl shadow-lg hover:bg-opacity-90 transition-all">
                            <Phone size={20} />
                        </a>
                    </motion.div>
                )}

                {/* Cancel Confirmation if placed */}
                {order.orderStatus === 'placed' && (
                    <button
                        onClick={async () => {
                            if (window.confirm('Cancel order?')) {
                                try {
                                    await api.patch(`/orders/${orderId}/cancel`);
                                    fetchOrderDetails();
                                } catch (err) { alert(err.response?.data?.message); }
                            }
                        }}
                        className="w-full mt-6 py-4 rounded-2xl border-2 border-dashed border-red-200 text-red-500 font-black hover:bg-red-50 transition-all"
                    >
                        Cancel Order
                    </button>
                )}
            </div>

            <RatingModal
                isOpen={showRating}
                onClose={() => setShowRating(false)}
                orderId={orderId}
                restaurantId={order.restaurant?._id}
                restaurantName={order.restaurant?.name}
            />
        </div>
    );
};

export default TrackOrder;
