import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingBag,
    Utensils,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Bike,
    BarChart3,
    CheckSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getNavLinks = () => {
        const links = {
            restaurant: [
                { name: 'Dashboard', path: '/restaurant/dashboard', icon: LayoutDashboard },
                { name: 'Orders', path: '/restaurant/orders', icon: ShoppingBag },
                { name: 'Menu Items', path: '/restaurant/menu-manage', icon: Utensils },
                { name: 'Settings', path: '/restaurant/settings', icon: Settings },
            ],
            delivery: [
                { name: 'Dashboard', path: '/delivery/dashboard', icon: LayoutDashboard },
                { name: 'My Deliveries', path: '/delivery/orders', icon: Bike },
                { name: 'Profile', path: '/delivery/profile', icon: Settings },
            ],
            admin: [
                { name: 'Overview', path: '/admin/dashboard', icon: BarChart3 },
                { name: 'Users', path: '/admin/users', icon: Users },
                { name: 'Restaurants', path: '/admin/restaurants', icon: Utensils },
                { name: 'Orders', path: '/admin/orders', icon: CheckSquare },
            ]
        };
        return links[user?.role] || [];
    };

    const navLinks = getNavLinks();

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside
                className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col z-40
                ${isSidebarOpen ? 'w-64' : 'w-20'}`}
            >
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    <Link to="/" className="text-2xl font-bold italic text-zomato-red overflow-hidden whitespace-nowrap">
                        {isSidebarOpen ? 'zomato' : 'z'}
                    </Link>
                </div>

                <nav className="flex-1 py-6 px-3 space-y-1">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center px-3 py-3 rounded-xl transition-all group ${isActive
                                        ? 'bg-red-50 text-zomato-red'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <Icon size={22} className={`${isActive ? 'text-zomato-red' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                {isSidebarOpen && (
                                    <span className="ml-3 font-semibold text-sm">{link.name}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-zomato-red transition-all group"
                    >
                        <LogOut size={22} className="text-gray-400 group-hover:text-zomato-red" />
                        {isSidebarOpen && (
                            <span className="ml-3 font-semibold text-sm">Logout</span>
                        )}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <div className="flex items-center space-x-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                            <p className="text-xs text-gray-500 capitalize">{user?.role} Portal</p>
                        </div>
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 border border-gray-200">
                            <Users size={20} />
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
