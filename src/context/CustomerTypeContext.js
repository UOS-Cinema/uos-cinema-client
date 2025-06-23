import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

// Context 생성
export const CustomerTypeContext = createContext();

// 커스텀 훅 생성
export const useCustomerTypes = () => {
    return useContext(CustomerTypeContext);
};

// Provider 컴포넌트
export const CustomerTypeProvider = ({ children }) => {
    const [customerTypes, setCustomerTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 데이터 로딩 함수
    const fetchCustomerTypes = useCallback(async () => {
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
    }, []);

    // 최초 로드
    useEffect(() => {
        fetchCustomerTypes();
    }, [fetchCustomerTypes]);

    // Provider를 통해 전달할 값
    const value = {
        customerTypes,
        loading,
        error,
        refresh: fetchCustomerTypes // 새로고침 함수
    };

    return (
        <CustomerTypeContext.Provider value={value}>
            {children}
        </CustomerTypeContext.Provider>
    );
};
