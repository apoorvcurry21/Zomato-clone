import React, { createContext, useState, useContext, useEffect } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const [pincode, setPincode] = useState('');

    useEffect(() => {
        const storedPincode = localStorage.getItem('pincode');
        if (storedPincode) {
            setPincode(storedPincode);
        }
    }, []);

    const updatePincode = (newPincode) => {
        setPincode(newPincode);
        localStorage.setItem('pincode', newPincode);
    };

    return (
        <LocationContext.Provider value={{ pincode, updatePincode }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useUserLocation = () => useContext(LocationContext);
