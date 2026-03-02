import React from 'react';

const Loading = ({ fullPage = false }) => {
    const spinner = (
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-zomato-red border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium animate-pulse">Loading amazing food...</p>
        </div>
    );

    if (fullPage) {
        return (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[9999] flex items-center justify-center">
                {spinner}
            </div>
        );
    }

    return spinner;
};

export default Loading;
