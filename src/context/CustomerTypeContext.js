import React, { createContext, useState, useEffect, useContext } from 'react';

export const CustomerTypeContext = createContext();

export const useCustomerTypes = () => {
    return useContext(CustomerTypeContext);
};

export const CustomerTypeProvider = ({ children }) => {
    const [customerTypes, setCustomerTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCustomerTypes = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/admin/customer-types'); 
                if (!response.ok) {
                    throw new Error('고객 유형 정보를 불러오는 데 실패했습니다.');
                }
                const responseData = await response.json();
                setCustomerTypes(responseData.data || []);
            } catch (err) {
                setError(err.message);
                console.error("Failed to fetch customer types:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomerTypes();
    }, []);

    const value = { customerTypes, loading, error };

    return (
        <CustomerTypeContext.Provider value={value}>
            {children}
        </CustomerTypeContext.Provider>
    );
};