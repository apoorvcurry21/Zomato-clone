import React from 'react';
import { motion } from 'framer-motion';
import { Star, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
    const navigate = useNavigate();

    return (
        <motion.div
            whileHover={{ y: -5 }}
            onClick={() => navigate(`/restaurant/${restaurant._id}`)}
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 cursor-pointer group"
        >
            <div className="relative h-48 overflow-hidden">
                <img
                    src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop'}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-md shadow-md flex items-center text-sm font-bold text-gray-800">
                    <Star size={14} className="text-yellow-400 fill-current mr-1" />
                    {restaurant.rating || 'New'}
                </div>
                {!restaurant.isOpen && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center font-bold text-white text-xl uppercase tracking-widest backdrop-blur-[2px]">
                        Closed
                    </div>
                )}
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800 truncate">{restaurant.name}</h3>
                </div>

                <p className="text-gray-500 text-sm mb-3 truncate">
                    {restaurant.cuisines?.join(', ') || 'Multi-cuisine'}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <div className="flex items-center text-gray-600 text-sm">
                        <Clock size={16} className="mr-1" />
                        <span>{restaurant.estimatedPrepTime || 25} min</span>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${restaurant.isOpen ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {restaurant.isOpen ? 'Open Now' : 'Closed'}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default RestaurantCard;
