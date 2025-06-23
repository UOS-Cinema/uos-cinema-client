import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

// 1. Context 객체 생성
export const GenreContext = createContext();

// 2. Context를 사용하기 쉽게 만들어주는 커스텀 훅
export const useGenres = () => {
    return useContext(GenreContext);
};

// 3. Provider 컴포넌트
export const GenreProvider = ({ children }) => {
    // --- 상태 관리 ---
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- 데이터 페칭 로직을 useCallback으로 감싸 재사용 가능하게 변경 ---
    const fetchGenres = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/genres'); 
            if (!response.ok) {
                throw new Error('장르 정보를 불러오는 데 실패했습니다.');
            }
            const responseData = await response.json();
            setGenres(responseData.data || []);
        } catch (err) {
            setError(err.message);
            console.error("Failed to fetch genres:", err);
        } finally {
            setLoading(false);
        }
    }, []); // 빈 배열을 의존성으로 전달하여 함수가 재생성되지 않도록 함

    // 컴포넌트가 처음 마운트될 때 데이터를 한 번 불러옵니다.
    useEffect(() => {
        fetchGenres();
    }, [fetchGenres]); // fetchGenres 함수가 변경될 때만 실행 (최초 1회)

    // Provider를 통해 전달할 값에 refresh 함수를 추가합니다.
    const value = {
        genres,
        loading,
        error,
        refresh: fetchGenres // 데이터를 다시 불러오는 함수
    };

    return (
        <GenreContext.Provider value={value}>
            {children}
        </GenreContext.Provider>
    );
};
