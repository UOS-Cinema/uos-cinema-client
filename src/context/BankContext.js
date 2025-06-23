import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

// Context 생성
export const BankContext = createContext();

// 커스텀 훅 생성
export const useBanks = () => {
    return useContext(BankContext);
};

// Provider 컴포넌트
export const BankProvider = ({ children }) => {
    const [banks, setBanks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 데이터 로딩 함수
    const fetchBanks = useCallback(async () => {
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
    }, []);

    // 최초 로드
    useEffect(() => {
        fetchBanks();
    }, [fetchBanks]);

    // Provider를 통해 전달할 값
    const value = {
        banks,
        loading,
        error,
        refresh: fetchBanks // 새로고침 함수
    };

    return (
        <BankContext.Provider value={value}>
            {children}
        </BankContext.Provider>
    );
};
