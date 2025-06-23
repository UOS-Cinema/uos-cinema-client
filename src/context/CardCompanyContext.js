import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

// Context 생성
export const CardCompanyContext = createContext();

// 커스텀 훅 생성
export const useCardCompanies = () => {
    return useContext(CardCompanyContext);
};

// Provider 컴포넌트
export const CardCompanyProvider = ({ children }) => {
    const [cardCompanies, setCardCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 데이터 로딩 함수
    const fetchCardCompanies = useCallback(async () => {
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
    }, []);

    // 최초 로드
    useEffect(() => {
        fetchCardCompanies();
    }, [fetchCardCompanies]);

    // Provider를 통해 전달할 값
    const value = {
        cardCompanies,
        loading,
        error,
        refresh: fetchCardCompanies // 새로고침 함수
    };

    return (
        <CardCompanyContext.Provider value={value}>
            {children}
        </CardCompanyContext.Provider>
    );
};
