import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, MessageSquare, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';

const RatingModal = ({ isOpen, onClose, orderId, restaurantId, restaurantName }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hover, setHover] = useState(0);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) return;
        setLoading(true);
        try {
            await api.post('/reviews', {
                orderId,
                restaurantId,
                rating,
                comment
            });
            setSubmitted(true);
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            console.error('Review submission failed:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-white rounded-[40px] w-full max-w-md overflow-hidden relative"
                >
                    <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full text-gray-400">
                        <X size={20} />
                    </button>

                    <div className="p-10 text-center">
                        {!submitted ? (
                            <>
                                <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-green-500">
                                    <ShoppingBag size={40} />
                                </div>
                                <h3 className="text-2xl font-black text-gray-800 mb-2">Rate your meal!</h3>
                                <p className="text-gray-500 font-medium mb-8">How was your experience with {restaurantName}?</p>

                                <div className="flex justify-center gap-3 mb-10">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button
                                            key={s}
                                            onMouseEnter={() => setHover(s)}
                                            onMouseLeave={() => setHover(0)}
                                            onClick={() => setRating(s)}
                                            className="transition-transform active:scale-90"
                                        >
                                            <Star
                                                size={44}
                                                className={`transition-colors ${s <= (hover || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>

                                <div className="relative mb-8">
                                    <MessageSquare className="absolute left-4 top-4 text-gray-300" size={20} />
                                    <textarea
                                        placeholder="Add a comment (optional)"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-gray-200 outline-none rounded-2xl p-4 pl-12 h-32 text-gray-700 font-medium transition-all"
                                    />
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={rating === 0 || loading}
                                    className={`w-full py-5 rounded-2xl font-black text-xl shadow-xl transition-all ${rating > 0 && !loading ? 'bg-zomato-red text-white hover:bg-opacity-90' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    {loading ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-10"
                            >
                                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg shadow-green-100">
                                    <CheckCircle2 size={48} />
                                </div>
                                <h3 className="text-3xl font-black text-gray-800 mb-2">Thank you!</h3>
                                <p className="text-gray-500 font-bold">Your feedback helps us improve.</p>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default RatingModal;
