import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

// Context 생성
export const ScreenTypeContext = createContext();

// 커스텀 훅 생성
export const useScreenTypes = () => {
    return useContext(ScreenTypeContext);
};

// Provider 컴포넌트
export const ScreenTypeProvider = ({ children }) => {
    const [screenTypes, setScreenTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 1. 데이터 로딩 함수를 useCallback으로 감싸서 재사용 가능하도록 만듭니다.
    const fetchScreenTypes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/admin/screen-types');
            if (!response.ok) {
                throw new Error('상영 유형 정보를 불러오는 데 실패했습니다.');
            }
            const responseData = await response.json();
            setScreenTypes(responseData.data || []);
        } catch (err) {
            setError(err.message);
            console.error("Failed to fetch screen types:", err);
        } finally {
            setLoading(false);
        }
    }, []); // 빈 의존성 배열: 이 함수는 재생성되지 않습니다.

    // 2. 컴포넌트가 처음 마운트될 때 데이터를 불러옵니다.
    useEffect(() => {
        fetchScreenTypes();
    }, [fetchScreenTypes]);

    // 3. Provider를 통해 전달할 값에 refresh 함수를 포함합니다.
    const value = {
        screenTypes,
        loading,
        error,
        refresh: fetchScreenTypes // 데이터 새로고침 함수
    };

    return (
        <ScreenTypeContext.Provider value={value}>
            {children}
        </ScreenTypeContext.Provider>
    );
};
