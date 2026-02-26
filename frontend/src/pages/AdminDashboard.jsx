import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    ShoppingBag,
    DollarSign,
    Utensils,
    Activity,
    ShieldAlert,
    CheckCircle2,
    Search,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    Star
} from 'lucide-react';
import api from '../api/axios';
import DashboardLayout from '../components/DashboardLayout';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        setLoading(true);
        try {
            const [analyticsRes, usersRes, restRes] = await Promise.all([
                api.get('/admin/analytics'),
                api.get('/admin/users'),
                api.get('/restaurants') // Get all for mgmt
            ]);
            setStats(analyticsRes.data);
            setUsers(usersRes.data);
            setRestaurants(restRes.data);
        } catch (err) {
            console.error('Error fetching admin data:', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleBlock = async (userId) => {
        try {
            await api.patch(`/admin/users/${userId}/toggle-block`);
            setUsers(users.map(u => u._id === userId ? { ...u, isBlocked: !u.isBlocked } : u));
        } catch (err) {
            console.error('Failed to toggle block:', err);
        }
    };

    const toggleFeatured = async (restId) => {
        try {
            await api.patch(`/admin/restaurants/${restId}/toggle-featured`);
            setRestaurants(restaurants.map(r => r._id === restId ? { ...r, isFeatured: !r.isFeatured } : r));
        } catch (err) {
            console.error('Failed to toggle featured:', err);
        }
    };

    if (loading) return (
        <DashboardLayout>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-pulse">
                {[1, 2, 3].map(i => <div key={i} className="h-40 bg-gray-200 rounded-3xl"></div>)}
            </div>
            <div className="h-96 bg-gray-200 rounded-3xl animate-pulse"></div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-black text-gray-800 mb-8">System Overview</h2>

                {/* Analytics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-4">
                            <DollarSign size={24} />
                        </div>
                        <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Total Revenue</p>
                        <h3 className="text-2xl font-black text-gray-800">₹{stats?.totalRevenue?.toLocaleString()}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <div className="w-12 h-12 rounded-2xl bg-zomato-red/10 text-zomato-red flex items-center justify-center mb-4">
                            <ShoppingBag size={24} />
                        </div>
                        <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Orders</p>
                        <h3 className="text-2xl font-black text-gray-800">{stats?.totalOrders}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center mb-4">
                            <Users size={24} />
                        </div>
                        <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Total Users</p>
                        <h3 className="text-2xl font-black text-gray-800">{stats?.totalUsers}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mb-4">
                            <Utensils size={24} />
                        </div>
                        <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Restaurants</p>
                        <h3 className="text-2xl font-black text-gray-800">{restaurants.length}</h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* User Management */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                            <h4 className="font-black text-gray-800 uppercase tracking-widest text-sm">User Management</h4>
                            <button className="text-zomato-red text-sm font-bold flex items-center hover:underline">
                                View All <ArrowUpRight size={16} className="ml-1" />
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Role</th>
                                        <th className="px-6 py-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {users.slice(0, 5).map(user => (
                                        <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-gray-800 text-sm">{user.name}</p>
                                                <p className="text-xs text-gray-400">{user.email}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black capitalize ${user.role === 'admin' ? 'bg-purple-50 text-purple-600' :
                                                        user.role === 'restaurant' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => toggleBlock(user._id)}
                                                    className={`p-2 rounded-lg transition-all ${user.isBlocked ? 'text-red-600 bg-red-50' : 'text-gray-400 hover:bg-gray-100'}`}
                                                >
                                                    <ShieldAlert size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Restaurant Featured Toggle */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                            <h4 className="font-black text-gray-800 uppercase tracking-widest text-sm">Featured Management</h4>
                        </div>
                        <div className="p-6 grid grid-cols-1 gap-4">
                            {restaurants.slice(0, 6).map(rest => (
                                <div key={rest._id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl border border-gray-200 overflow-hidden">
                                            <img src={rest.image} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-gray-800 text-sm">{rest.name}</h5>
                                            <div className="flex items-center text-[10px] text-gray-400">
                                                <Star size={10} className="text-yellow-400 fill-current mr-1" />
                                                {rest.rating} • {rest.pincodes?.[0]}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleFeatured(rest._id)}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${rest.isFeatured
                                                ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                                : 'bg-white text-gray-400 border border-gray-200 hover:border-yellow-400 hover:text-yellow-600'
                                            }`}
                                    >
                                        {rest.isFeatured ? 'Featured' : 'Make Featured'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;
