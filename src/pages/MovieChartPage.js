import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import Navbar from "../component/common/NavBar";
import FilterBar from '../component/movieChart/FilterBar';
import MovieGrid from '../component/mainpage/MovieGrid';       // 실제 경로에 맞게 수정
import Pagination from '../component/movieChart/pagination';
const MovieChartPage = () => {
    const location = useLocation(); // HomePage에서 전달받은 초기 필터 값 사용
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // 페이지네이션 상태
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // 검색 필터 상태
    const [currentFilters, setCurrentFilters] = useState(location.state?.filters || {
        query: '',
        sortBy: 'RELEASE_DATE',
        genres: [],
        screenTypes: [],
    });
    const [searchType, setSearchType] = useState(location.state?.searchType || 'movie');

    // API 호출 함수
    const fetchMovies = useCallback(async (type, filters, page) => {
        setIsLoading(true);
        setError(null);
        
        let endpoint = '';
        let requestBody = {};

        switch(type) {
            case 'movie':
                endpoint = '/movies/search';
                requestBody = { ...filters, page: page, size: 12 }; // size: 12 고정
                break;
            // 배우, 감독 검색 로직은 필요에 따라 추가
            default:
                setIsLoading(false);
                return;
        }

        try {
            const isPost = type === 'movie';
            const response = await fetch(endpoint, {
                method: isPost ? 'POST' : 'GET',
                headers: isPost ? { 'Content-Type': 'application/json' } : {},
                body: isPost ? JSON.stringify(requestBody) : null,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '데이터를 불러오는 데 실패했습니다.');
            }

            const data = await response.json();
            const movieData = data.data?.movies || { content: [], totalPages: 0 };
            
            setSearchResults(movieData.content);
            setTotalPages(movieData.totalPages);

        } catch (err) {
            setError(err.message);
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 페이지가 처음 로드될 때, 또는 location.state(다른 페이지에서 넘어온 필터)가 바뀔 때 초기 검색 실행
    useEffect(() => {
        const initialFilters = location.state?.filters || currentFilters;
        const initialType = location.state?.searchType || searchType;
        setCurrentFilters(initialFilters);
        setSearchType(initialType);
        fetchMovies(initialType, initialFilters, 0); // 항상 첫 페이지부터 검색
        setCurrentPage(0); // 페이지 상태도 0으로 초기화
    }, [location.state, fetchMovies]);
    
    // FilterBar에서 새로운 검색을 시작할 때 호출될 함수
    const handleSearch = (type, filters) => {
        setCurrentFilters(filters);
        setSearchType(type);
        setCurrentPage(0); // 새로운 검색은 항상 첫 페이지부터
        fetchMovies(type, filters, 0);
    };

    // Pagination 컴포넌트에서 페이지를 변경할 때 호출될 함수
    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchMovies(searchType, currentFilters, page);
    };

    return (
        <>
            <GlobalStyle />
            <Container>
                <Navbar underline={true} />
                <MainContent>
                    <PageTitle>무비차트</PageTitle>
                    <FilterBar onSearch={handleSearch} isLoading={isLoading} />
                    <ResultsContainer>
                        {isLoading && <StatusText>검색 중...</StatusText>}
                        {error && <StatusText error>{error}</StatusText>}
                        {!isLoading && !error && (
                            <>
                                <MovieGrid results={searchResults} />
                                <Pagination 
                                    currentPage={currentPage} 
                                    totalPages={totalPages} 
                                    onPageChange={handlePageChange}
                                />
                            </>
                        )}
                    </ResultsContainer>
                </MainContent>
            </Container>
        </>
    );
};

export default MovieChartPage;

// --- STYLED COMPONENTS ---
const GlobalStyle = createGlobalStyle`...`;
const Container = styled.div``;
const MainContent = styled.main`
  width: 85%;
  max-width: 1200px;
  margin: 0 auto;
`;
const PageTitle = styled.h1`
    font-size: 32px;
    font-weight: 900;
    margin: 60px 0 30px;
`;
const ResultsContainer = styled.div`
    padding: 20px 0;
    min-height: 500px; /* 로딩이나 에러 시 최소 높이 확보 */
`;
const StatusText = styled.p`...`;