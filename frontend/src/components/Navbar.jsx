import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User as UserIcon, LogOut, Search, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold italic text-zomato-red">
                    zomato
                </Link>

                {/* Search Bar Placeholder */}
                <div className="hidden md:flex flex-1 max-w-2xl mx-8 items-center bg-gray-100 rounded-lg px-3 py-2 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center text-zomato-red mr-2 border-r border-gray-300 pr-2">
                        <MapPin size={18} className="mr-1" />
                        <span className="text-sm text-gray-700">Pincode</span>
                    </div>
                    <Search size={18} className="text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Search for restaurant, cuisine or a dish"
                        className="bg-transparent border-none focus:outline-none text-sm w-full"
                    />
                </div>

                {/* Links */}
                <div className="flex items-center space-x-6 text-gray-600 font-medium">
                    <Link to="/apply-restaurant" className="hidden lg:block text-sm hover:text-zomato-red transition-colors">
                        Add restaurant
                    </Link>

                    {user ? (
                        <div className="flex items-center space-x-6">
                            <Link to="/orders" className="hover:text-zomato-red transition-colors flex items-center">
                                <ShoppingBag size={20} className="mr-1" />
                                <span className="hidden sm:inline">Orders</span>
                            </Link>
                            <div className="flex items-center space-x-2 border-l pl-6 border-gray-200">
                                <UserIcon size={20} />
                                <span className="hidden sm:inline text-sm">{user.name}</span>
                                <button onClick={handleLogout} className="hover:text-zomato-red transition-colors ml-4">
                                    <LogOut size={20} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-6">
                            <Link to="/login" className="hover:text-zomato-red transition-colors">Log in</Link>
                            <Link to="/signup" className="hover:text-zomato-red transition-colors">Sign up</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
