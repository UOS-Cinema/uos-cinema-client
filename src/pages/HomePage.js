import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { FaSearch, FaCaretDown } from "react-icons/fa";
import Navbar from "../component/common/NavBar"; // 실제 경로로 수정 필요

// --- 스타일 상수 ---
const primaryBlue = '#1E6DFF';
const lightGray = '#f8f9fa';
const mediumGray = '#e9ecef';
const darkGray = '#343a40';
const white = '#fff';


// --- 커스텀 드롭다운 훅 ---
const useDropdown = (initialState = false) => {
    const [isOpen, setIsOpen] = useState(initialState);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return [isOpen, setIsOpen, ref];
};

// --- 필터링 컴포넌트 ---
const FilterBar = ({ onSearch, isLoading }) => {
    const [searchType, setSearchType] = useState('movie');
    const [sortOrder, setSortOrder] = useState('RELEASE_DATE');
    const [genres, setGenres] = useState([]);
    const [screenTypes, setScreenTypes] = useState([]);
    const [query, setQuery] = useState('');

    const [isGenreOpen, setIsGenreOpen, genreRef] = useDropdown();
    const [isScreenTypeOpen, setIsScreenTypeOpen, screenTypeRef] = useDropdown();

    const isMovieSearch = searchType === 'movie';

    useEffect(() => {
        if (!isMovieSearch) {
            setSortOrder('RELEASE_DATE');
            setGenres([]);
            setScreenTypes([]);
        }
    }, [searchType, isMovieSearch]);

    const allGenres = ['액션', '코미디', '드라마', '공포', '로맨스', '스릴러'];
    const allScreenTypes = ['2D', '3D', 'IMAX', '4DX'];

    const handleGenreToggle = (genre) => {
        setGenres(prev => prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]);
    };
    
    const handleScreenTypeToggle = (type) => {
        setScreenTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
    };

    const handleApply = () => {
        if (!query.trim()) {
            alert("검색어를 입력하세요.");
            return;
        }
        
        const filters = {
            query: query,
            sortBy: isMovieSearch ? sortOrder : null,
            genres: isMovieSearch ? genres : [],
            screenTypes: isMovieSearch ? screenTypes : [],
        };
        onSearch(searchType, filters);
    };

    const getPlaceholderText = () => {
        switch (searchType) {
            case 'movie': return "영화를 검색해보세요";
            case 'actor': return "배우를 검색해보세요";
            case 'director': return "감독을 검색해보세요";
            default: return "검색어를 입력해보세요";
        }
    };

    return (
        <FilterContainer>
            <FilterGroup>
                <Select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                    <option value="movie">영화</option>
                    <option value="actor">배우</option>
                    <option value="director">감독</option>
                </Select>
            </FilterGroup>
            <FilterGroup>
                <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} disabled={!isMovieSearch}>
                    <option value="RELEASE_DATE">최신순</option>
                    <option value="POPULARITY">인기순</option>
                </Select>
            </FilterGroup>
            <FilterGroup ref={genreRef}>
                <CustomSelectButton onClick={() => isMovieSearch && setIsGenreOpen(!isGenreOpen)} open={isGenreOpen} disabled={!isMovieSearch}>
                    {genres.length > 0 ? `${genres.join(', ')}` : '장르 선택'} <FaCaretDown />
                </CustomSelectButton>
                {isGenreOpen && isMovieSearch && (
                    <DropdownList>
                        {allGenres.map(genre => (
                            <CheckboxItem key={genre}>
                                <input type="checkbox" checked={genres.includes(genre)} onChange={() => handleGenreToggle(genre)} /> {genre}
                            </CheckboxItem>
                        ))}
                    </DropdownList>
                )}
            </FilterGroup>
            <FilterGroup ref={screenTypeRef}>
                <CustomSelectButton onClick={() => isMovieSearch && setIsScreenTypeOpen(!isScreenTypeOpen)} open={isScreenTypeOpen} disabled={!isMovieSearch}>
                    {screenTypes.length > 0 ? screenTypes.join(', ') : '상영관 타입'} <FaCaretDown />
                </CustomSelectButton>
                {isScreenTypeOpen && isMovieSearch && (
                    <DropdownList>
                        {allScreenTypes.map(type => (
                            <CheckboxItem key={type}>
                                <input type="checkbox" checked={screenTypes.includes(type)} onChange={() => handleScreenTypeToggle(type)} /> {type}
                            </CheckboxItem>
                        ))}
                    </DropdownList>
                )}
            </FilterGroup>
            <SearchGroup>
                <SearchInput 
                    type="text" 
                    placeholder={getPlaceholderText()}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleApply()}
                    disabled={isLoading}
                />
                <ApplyButton onClick={handleApply} disabled={isLoading}><FaSearch /></ApplyButton>
            </SearchGroup>
        </FilterContainer>
    );
};

// --- 검색 결과 표시 컴포넌트 ---
const SearchResults = ({ results, type }) => {
    if (!results || results.length === 0) {
        return <NoResults>검색 결과가 없습니다.</NoResults>;
    }

    const getLinkPath = (item) => {
        switch (type) {
            case 'movie': return `/movie/${item.id}`;
            case 'actor': return `/actor/${item.id}`;
            case 'director': return `/director/${item.id}`;
            default: return '/';
        }
    };

    return (
        <ResultsGrid>
            {results.map(item => (
                <ResultCard key={item.id} to={getLinkPath(item)} state={{ name: item.name || item.title, photoUrl: item.photoUrl || item.posterUrl }}>
                    <ResultImage src={item.photoUrl || item.posterUrl || 'https://placehold.co/200x300/e2e8f0/e2e8f0?text=No+Image'} alt={item.title || item.name} />
                    <ResultInfo>
                        <ResultTitle>{item.title || item.name}</ResultTitle>
                        {type === 'movie' && item.releaseDate && <ResultSubText>개봉년도: {item.releaseDate[0]}</ResultSubText>}
                    </ResultInfo>
                </ResultCard>
            ))}
        </ResultsGrid>
    );
};


// --- 메인 페이지 컴포넌트 ---
const HomePage = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [searchType, setSearchType] = useState('movie');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (type, filters) => {
        setIsLoading(true);
        setError(null);
        setSearchType(type);
        
        let endpoint = '';
        let requestBody = {};

        switch(type) {
            case 'movie':
                endpoint = '/movies/search';
                requestBody = {
                    ...filters,
                    page: 0,
                    size: 20
                };
                break;
            case 'actor':
                endpoint = `/actors/search?name=${filters.query}`; // 배우 검색은 GET 요청으로 가정
                break;
            case 'director':
                endpoint = `/directors/search?name=${filters.query}`; // 감독 검색도 GET 요청으로 가정
                break;
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
            const results = data.data?.movies || data.data?.actors || data.data?.directors || [];
            setSearchResults(results);

        } catch (err) {
            setError(err.message);
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <GlobalStyle />
            <Container>
                <Navbar underline={true} />
                <MainContent>
                    <FilterBar onSearch={handleSearch} isLoading={isLoading} />
                    <ResultsContainer>
                        {isLoading && <StatusText>검색 중...</StatusText>}
                        {error && <StatusText error>{error}</StatusText>}
                        {!isLoading && !error && 
                            <SearchResults results={searchResults} type={searchType} />
                        }
                    </ResultsContainer>
                </MainContent>
            </Container>
        </>
    );
};

export default HomePage;

// --- STYLED COMPONENTS ---
const GlobalStyle = createGlobalStyle`
  body, html {
    background-color: ${lightGray};
    margin: 0;
    font-family: 'Noto Sans KR', sans-serif;
  }
`;
const Container = styled.div``;
const MainContent = styled.main`
  width: 85%;
  max-width: 1200px;
  margin: 0 auto;
`;

// FilterBar & SearchResults 스타일
const SectionWrapper = styled.section`
  margin-top: 60px;
`;
const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 24px;
  background-color: ${white};
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.07);
  margin: 60px 0 40px 0;
`;
const FilterGroup = styled.div`
  position: relative;
`;
const Select = styled.select`
  height: 42px;
  padding: 0 16px;
  border-radius: 8px;
  border: 1px solid ${mediumGray};
  background-color: ${white};
  font-size: 15px;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23868e96' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 40px;
  &:disabled {
    background-color: ${lightGray};
    color: ${mediumGray};
    cursor: not-allowed;
    border-color: ${mediumGray};
  }
`;
const CustomSelectButton = styled.button`
    height: 42px;
    padding: 0 16px;
    border-radius: 8px;
    border: 1px solid ${mediumGray};
    background-color: ${white};
    font-size: 15px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-width: 150px;
    
    svg {
        margin-left: 8px;
        transition: transform 0.2s ease;
        transform: ${({ open }) => (open ? 'rotate(180deg)' : 'rotate(0deg)')};
    }
    &:disabled {
        background-color: ${lightGray};
        color: ${mediumGray};
        cursor: not-allowed;
        border-color: ${mediumGray};
        svg {
            color: ${mediumGray};
        }
    }
`;
const DropdownList = styled.div`
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  min-width: 100%;
  background-color: ${white};
  border: 1px solid ${mediumGray};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  z-index: 100;
  padding: 8px;
`;
const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
  white-space: nowrap;
  
  input[type="checkbox"] {
    margin-right: 10px;
    accent-color: ${primaryBlue};
  }
  &:hover {
    background-color: ${lightGray};
  }
`;
const SearchGroup = styled.div`
    margin-left: auto;
    display: flex;
    align-items: center;
    border: 1px solid ${mediumGray};
    border-radius: 8px;
    overflow: hidden;
    height: 42px;
    &:focus-within {
        border-color: ${primaryBlue};
        box-shadow: 0 0 0 2px rgba(30, 109, 255, 0.2);
    }
`;
const SearchInput = styled.input`
  border: none;
  padding: 0 16px;
  font-size: 15px;
  outline: none;
  width: 250px;
`;
const ApplyButton = styled.button`
  padding: 0 20px;
  height: 100%;
  background-color : white;
  color: ${darkGray};
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
`;
const ResultsContainer = styled.div`
    padding: 20px 0;
    min-height: 300px;
`;
const StatusText = styled.p`
    text-align: center;
    font-size: 18px;
    color: ${props => props.error ? '#e03131' : '#868e96'};
    padding: 40px;
`;
const NoResults = styled(StatusText)``;
const ResultsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 30px;
`;
const ResultCard = styled(Link)`
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    overflow: hidden;
    text-decoration: none;
    color: ${darkGray};
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    &:hover {
        transform: translateY(-8px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.12);
    }
`;
const ResultImage = styled.img`
    width: 100%;
    height: 300px;
    object-fit: cover;
    display: block;
    background-color: ${lightGray};
`;
const ResultInfo = styled.div`
    padding: 16px;
`;
const ResultTitle = styled.h3`
    margin: 0 0 4px;
    font-size: 18px;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;
const ResultSubText = styled.p`
    margin: 0;
    font-size: 14px;
    color: #868e96;
`;