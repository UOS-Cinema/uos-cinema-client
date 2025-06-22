import React, { createContext, useState, useEffect, useContext } from 'react';

export const CardCompanyContext = createContext();

export const useCardCompanies = () => {
    return useContext(CardCompanyContext);
};

export const CardCompanyProvider = ({ children }) => {
    const [cardCompanies, setCardCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCardCompanies = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/admin/card-companies'); 
                if (!response.ok) {
                    throw new Error('카드사 정보를 불러오는 데 실패했습니다.');
                }
                const responseData = await response.json();
                setCardCompanies(responseData.data || []);
            } catch (err) {
                setError(err.message);
                console.error("Failed to fetch card companies:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCardCompanies();
    }, []);

    const value = { cardCompanies, loading, error };

    return (
        <CardCompanyContext.Provider value={value}>
            {children}
        </CardCompanyContext.Provider>
    );
};