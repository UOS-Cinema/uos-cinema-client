import React, { createContext, useState, useEffect, useContext } from 'react';

export const ScreenTypeContext = createContext();

export const useScreenTypes = () => {
    return useContext(ScreenTypeContext);
};

export const ScreenTypeProvider = ({ children }) => {
    const [screenTypes, setScreenTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchScreenTypes = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/admin/screen-types'); 
                if (!response.ok) {
                    throw new Error('상영 유형 정보를 불러오는 데 실패했습니다.');
                }
                const responseData = await response.json();
                console.log(responseData);
                setScreenTypes(responseData.data || []);
            } catch (err) {
                setError(err.message);
                console.error("Failed to fetch screen types:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchScreenTypes();
    }, []);

    const value = { screenTypes, loading, error };

    return (
        <ScreenTypeContext.Provider value={value}>
            {children}
        </ScreenTypeContext.Provider>
    );
};