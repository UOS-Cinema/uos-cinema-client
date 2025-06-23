import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import Navbar from "../component/common/NavBar";
import FilterBar from '../component/movieChart/FilterBar';
import MovieGrid from '../component/mainpage/MovieGrid'; // 실제 경로에 맞게 수정
import Pagination from '../component/movieChart/pagination';

const MovieChartPage = () => {
    // useLocation을 사용하지 않습니다. 초기 필터값은 더 이상 외부에서 전달받지 않습니다.
    // const location = useLocation(); 

    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // 페이지네이션 상태
    const [currentPage, setCurrentPage] = useState(0); // 페이지는 0부터 시작
    const [totalPages, setTotalPages] = useState(0);

    // 필터 상태는 유지하되, 초기값은 고정
    // FilterBar는 이 상태를 사용하여 필터 UI를 렌더링하고, 변경 시 fetchMovies를 트리거합니다.
    const [currentFilters, setCurrentFilters] = useState({
        // query: '', // 검색 기능 제거로 query는 더 이상 필요 없습니다.
        sortBy: 'RELEASE_DATE', // 초기 정렬 기준
        genres: [], // 초기 장르 필터
        screenTypes: [], // 초기 상영 타입 필터
    });

    // searchType도 'movie'로 고정됩니다.
    // const [searchType, setSearchType] = useState('movie'); // searchType은 이제 고정값이므로 상태로 관리할 필요가 줄어듭니다.

    // API 호출 함수
    const fetchMovies = useCallback(async (filters, page) => { // searchType 파라미터 제거
        setIsLoading(true);
        setError(null);

        // movies/rank 엔드포인트로 GET 요청을 보냅니다.
        // 정렬 기준, 장르, 상영 타입 필터는 쿼리 파라미터로 전달될 수 있습니다.
        // 백엔드 API 명세에 따라 적절히 URL을 구성해야 합니다.
        // 여기서는 예시로 필터가 쿼리 파라미터로 전달된다고 가정합니다.

        const params = new URLSearchParams({
            page: page,
            size: 12, // size: 12 고정
            // sortBy: filters.sortBy,
        });

        // 장르 필터가 있을 경우 추가
        // filters.genres.forEach(genre => params.append('genres', genre));
        // 상영 타입 필터가 있을 경우 추가
        // filters.screenTypes.forEach(screenType => params.append('screenTypes', screenType));

        const endpoint = `http://localhost:8080/movies/ranking?${params.toString()}`; // 백엔드 URL 포함
        try {
            const response = await fetch(endpoint, {
                method: 'GET', // GET 요청
                headers: {
                    'Content-Type': 'application/json', // GET 요청이라도 Content-Type을 명시하는 것이 일반적입니다.
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '영화 랭킹을 불러오는 데 실패했습니다.');
            }

            const data = await response.json();
            // 백엔드 응답 형식에 따라 데이터 구조를 조정합니다.
            // data.data.content와 data.data.totalPages로 예상됩니다.
            const movieData = data.data || { content: [], totalPages: 0 }; 
            
            setSearchResults(movieData.content);
            setTotalPages(movieData.totalPages);

        } catch (err) {
            setError(err.message);
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    }, []); // 의존성 배열에서 searchType 제거

    // 페이지가 처음 로드될 때 초기 랭킹 조회 실행
    useEffect(() => {
        // location.state를 더 이상 사용하지 않습니다.
        fetchMovies(currentFilters, 0); // 항상 첫 페이지부터 랭킹 조회
        setCurrentPage(0); // 페이지 상태도 0으로 초기화
    }, [fetchMovies]); // currentFilters는 fetchMovies의 의존성이므로, 여기서는 fetchMovies만 있으면 됩니다.

    // FilterBar에서 필터가 변경될 때 호출될 함수
    // searchType은 더 이상 필요 없습니다.
    const handleFilterChange = (newFilters) => { // 함수명 변경: handleSearch -> handleFilterChange
        setCurrentFilters(newFilters);
        setCurrentPage(0); // 새로운 필터 적용 시 항상 첫 페이지부터
        fetchMovies(newFilters, 0); // 변경된 필터로 다시 조회
    };

    // Pagination 컴포넌트에서 페이지를 변경할 때 호출될 함수
    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchMovies(currentFilters, page); // 현재 필터와 변경된 페이지로 조회
    };

    return (
        <>
            <GlobalStyle />
            <Container>
                <Navbar underline={true} />
                <MainContent>
                    <PageTitle>무비차트</PageTitle>
                    {/* FilterBar에 현재 필터 상태와 변경 핸들러를 전달합니다. */}
                    <FilterBar 
                        onFilterChange={handleFilterChange} // prop 이름 변경: onSearch -> onFilterChange
                        isLoading={isLoading} 
                        initialFilters={currentFilters} // FilterBar가 초기 필터값을 받도록 추가
                    />
                    <ResultsContainer>
                        {isLoading && <StatusText>영화 랭킹을 불러오는 중...</StatusText>}
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
const GlobalStyle = createGlobalStyle`
    body, html {
        background-color: #f8f9fa; /* lightGray 색상 */
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
`;

const MainContent = styled.main`
    width: 85%;
    max-width: 1200px;
    margin: 0 auto;
    flex-grow: 1; /* 콘텐츠가 적어도 페이지 하단까지 확장되도록 */
`;

const PageTitle = styled.h1`
    text-align: center; /* 제목 중앙 정렬 */
    font-size: 32px;
    font-weight: 900;
    margin: 60px 0 30px;
    color: #343a40; /* darkGray 색상 */
`;

const ResultsContainer = styled.div`
    padding: 20px 0;
    min-height: 500px; /* 로딩이나 에러 시 최소 높이 확보 */
    display: flex;
    flex-direction: column;
    align-items: center; /* 내부 요소들을 중앙 정렬 */
`;

const StatusText = styled.p`
    font-size: 18px;
    color: ${props => (props.error ? 'red' : '#6c757d')}; /* mediumGray 색상 */
    text-align: center;
    margin-top: 50px;
`;