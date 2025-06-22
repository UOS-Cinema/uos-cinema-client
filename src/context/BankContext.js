import React, { createContext, useState, useEffect, useContext } from 'react';

export const BankContext = createContext();

export const useBanks = () => {
    return useContext(BankContext);
};

export const BankProvider = ({ children }) => {
    const [banks, setBanks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBanks = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/admin/banks'); 
                if (!response.ok) {
                    throw new Error('은행 정보를 불러오는 데 실패했습니다.');
                }
                const responseData = await response.json();
                setBanks(responseData.data || []);
            } catch (err) {
                setError(err.message);
                console.error("Failed to fetch banks:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBanks();
    }, []);

    const value = { banks, loading, error };

    return (
        <BankContext.Provider value={value}>
            {children}
        </BankContext.Provider>
    );
};