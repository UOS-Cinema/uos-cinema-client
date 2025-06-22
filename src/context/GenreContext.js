import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Context 객체 생성
// 이 객체를 통해 Provider와 Consumer가 데이터를 공유합니다.
export const GenreContext = createContext();

// 2. Context를 사용하기 쉽게 만들어주는 커스텀 훅 (선택사항이지만 권장)
// const { genres, loading } = useGenres(); 와 같이 편하게 사용할 수 있습니다.
export const useGenres = () => {
    return useContext(GenreContext);
};

// 3. Provider 컴포넌트 생성
// 이 컴포넌트가 실질적으로 데이터를 불러오고, 하위 컴포넌트들에게 데이터를 제공(provide)합니다.
export const GenreProvider = ({ children }) => {
    // --- 상태 관리 ---
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- 데이터 페칭 ---
    // 컴포넌트가 처음 마운트될 때, 장르 데이터를 API로부터 한 번만 불러옵니다.
    useEffect(() => {
        const fetchGenres = async () => {
            setLoading(true);
            setError(null);
            try {
                // API 엔드포인트는 실제 프로젝트에 맞게 '/genres' 등으로 설정
                const response = await fetch('/genres'); 
                if (!response.ok) {
                    throw new Error('장르 정보를 불러오는 데 실패했습니다.');
                }
                const responseData = await response.json();
                console.log(responseData);
                // API 응답 데이터로 genres 상태 업데이트
                setGenres(responseData.data || []);

            } catch (err) {
                setError(err.message);
                console.error("Failed to fetch genres:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchGenres();
    }, []); // 빈 배열을 전달하여 최초 1회만 실행되도록 함

    // Provider를 통해 전달할 값들을 객체로 묶음
    const value = {
        genres,
        loading,
        error,
    };

    // GenreContext.Provider로 하위 컴포넌트들을 감싸고, value를 전달
    return (
        <GenreContext.Provider value={value}>
            {children}
        </GenreContext.Provider>
    );
};