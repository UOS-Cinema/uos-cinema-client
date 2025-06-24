import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { FaSearch, FaCaretDown } from "react-icons/fa";
import Navbar from "../component/common/NavBar";
import { useGenres } from '../context/GenreContext';
import { useScreenTypes } from '../context/ScreenTypeContext';

// --- 스타일 상수 ---
const primaryBlue = '#1E6DFF';
const lightGray = '#f1f3f5';
const mediumGray = '#e9ecef';
const darkGray = '#343a40';
const white = '#fff';
const textGray = '#868e96';
const red = '#e03131';


// --- 커스텀 드롭다운 훅 ---
const useDropdown = (initialState = false) => {
    const [isOpen, setIsOpen] = useState(initialState);
    const ref = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    return [isOpen, setIsOpen, ref];
};

// --- 필터링 컴포넌트 ---
const FilterBar = ({ onSearch, isLoading, initialFilters }) => {
    const { genres: allGenres, loading: genresLoading } = useGenres();
    const { screenTypes: allScreenTypes, loading: screenTypesLoading } = useScreenTypes();

    const [searchType, setSearchType] = useState('movie');
    const [sortOrder, setSortOrder] = useState(initialFilters?.sortBy || 'RELEASE_DATE');
    const [genres, setGenres] = useState(initialFilters?.genres || []);
    const [screenTypes, setScreenTypes] = useState(initialFilters?.screenTypes || []);
    const [query, setQuery] = useState(initialFilters?.query || '');

    const [isGenreOpen, setIsGenreOpen, genreRef] = useDropdown();
    const [isScreenTypeOpen, setIsScreenTypeOpen, screenTypeRef] = useDropdown();
    const isMovieSearch = searchType === 'movie';

    useEffect(() => {
        if (!isMovieSearch) {
            setSortOrder('RELEASE_DATE');
            setGenres([]);
            setScreenTypes([]);
        }
    }, [searchType]);

    const handleGenreToggle = (genre) => setGenres(prev => prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]);
    const handleScreenTypeToggle = (type) => setScreenTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);

    const handleApply = () => {
        if (!query.trim() && searchType !== 'movie') { // 영화 검색이 아닐 땐 검색어 필수
            alert("검색어를 입력하세요.");
            return;
        }
        const filters = {
            query,
            sortBy: isMovieSearch ? sortOrder : 'RELEASE_DATE',
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
                        {genresLoading ? <DropdownStatus>로딩 중...</DropdownStatus> : 
                        (allGenres || []).map(genre => (
                            <CheckboxItem key={genre.name}><input type="checkbox" checked={genres.includes(genre.name)} onChange={() => handleGenreToggle(genre.name)} /> {genre.name}</CheckboxItem>
                        ))}
                    </DropdownList>
                )}
            </FilterGroup>
            <FilterGroup ref={screenTypeRef}>
                <CustomSelectButton onClick={() => isMovieSearch && setIsScreenTypeOpen(!isScreenTypeOpen)} open={isScreenTypeOpen} disabled={!isMovieSearch}>
                    {screenTypes.length > 0 ? screenTypes.join(', ') : '상영 타입'} <FaCaretDown />
                </CustomSelectButton>
                {isScreenTypeOpen && isMovieSearch && (
                    <DropdownList>
                         {screenTypesLoading ? <DropdownStatus>로딩 중...</DropdownStatus> :
                         (allScreenTypes || []).map(type => (
                            <CheckboxItem key={type.type}><input type="checkbox" checked={screenTypes.includes(type.type)} onChange={() => handleScreenTypeToggle(type.type)} /> {type.type}</CheckboxItem>
                        ))}
                    </DropdownList>
                )}
            </FilterGroup>
            <SearchGroup>
                <SearchInput type="text" placeholder={getPlaceholderText()} value={query} onChange={(e) => setQuery(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleApply()} disabled={isLoading}/>
                <ApplyButton onClick={handleApply} disabled={isLoading}><FaSearch /></ApplyButton>
            </SearchGroup>
        </FilterContainer>
    );
};

// --- 검색 결과 표시 컴포넌트 ---
const SearchResults = ({ results, type }) => {
    if (!results || results.length === 0) return <NoResults>검색 결과가 없습니다.</NoResults>;
    
    const getPosterUrl = (item) => {
        try {
            const urls = JSON.parse(item.posterUrls);
            if (Array.isArray(urls) && urls.length > 0) return urls[0];
        } catch (e) {}
        return item.posterUrls || item.photoUrl || 'https://placehold.co/200x300/e2e8f0/e2e8f0?text=No+Image';
    };

    return (
        <ResultsGrid>
            {results.map(item => (
                <ResultCard key={item.id}>
                     <PosterContainer>
                        <ResultImage src={item.posterUrl} alt={item.title || item.name} referrerPolicy="no-referrer" />
                        <HoverOverlay>
                            <ButtonGroup>
                                <ActionButton as={Link} to={`/movie/${item.id}`} className="secondary">상세보기</ActionButton>
                                <ActionButton as={Link} to={`/reservation?movie=${item.id}`}>예매하기</ActionButton>
                            </ButtonGroup>
                        </HoverOverlay>
                    </PosterContainer>
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
    const location = useLocation();
    const [searchResults, setSearchResults] = useState([]);
    const [searchType, setSearchType] = useState('movie');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentFilters, setCurrentFilters] = useState(location.state?.filters || null);

    const handleSearch = useCallback(async (type, filters) => {
        setIsLoading(true);
        setError(null);
        setSearchType(type);
        setCurrentFilters(filters);
        
        const params = new URLSearchParams({ page: 0, size: 20 });

        if (type === 'movie') {
            if (filters.query) params.append('title', filters.query);
            if (filters.sortBy) params.append('sortBy', filters.sortBy);
            filters.genres.forEach(g => params.append('genres', g));
            filters.screenTypes.forEach(s => params.append('screenTypes', s));
        } else if (type === 'actor') {
            params.append('actorName', filters.query);
        } else if (type === 'director') {
            params.append('directorName', filters.query);
        }

        try {
            console.log(params.toString());
            const response = await fetch(`/movies?${params.toString()}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '데이터를 불러오는 데 실패했습니다.');
            }
            const data = await response.json();
            const results = data.data?.content || [];
            setSearchResults(results);
        } catch (err) {
            setError(err.message);
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if(location.state?.filters) {
            handleSearch(location.state.searchType, location.state.filters);
        }
    }, [location.state, handleSearch]);

    return (
        <>
            <GlobalStyle />
            <Container>
                <Navbar underline={true} />
                <MainContent>
                    <FilterBar onSearch={handleSearch} isLoading={isLoading} initialFilters={currentFilters} />
                    <ResultsContainer>
                        {isLoading ? <StatusText>검색 중...</StatusText> :
                         error ? <StatusText error>{error}</StatusText> :
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
    color: ${textGray};
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
    text-align: left;
    
    svg {
        margin-left: 8px;
        transition: transform 0.2s ease;
        transform: ${({ open }) => (open ? 'rotate(180deg)' : 'rotate(0deg)')};
    }
    &:disabled {
        background-color: ${lightGray};
        color: ${textGray};
        cursor: not-allowed;
        border-color: ${mediumGray};
        svg {
            color: ${textGray};
        }
    }
`;
const DropdownList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid ${mediumGray};
  border-radius: 8px;
  list-style: none;
  padding: 4px;
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
`;
const DropdownStatus = styled.div`
    padding: 10px 12px;
    color: ${({error}) => error ? red : textGray};
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
    transition: all 0.2s ease;
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
  height: 100%;
  background-color: transparent;
`;
const ApplyButton = styled.button`
  padding: 0 20px;
  height: 100%;
  background-color: ${white};
  color: ${darkGray};
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: ${lightGray};
  }
  &:disabled {
      background-color: ${mediumGray};
      cursor: not-allowed;
  }
`;
const ResultsContainer = styled.div`
    padding: 20px 0;
    min-height: 300px;
`;
const StatusText = styled.p`
    text-align: center;
    font-size: 18px;
    color: ${props => props.error ? red : textGray};
    padding: 40px;
`;
const NoResults = styled(StatusText)``;
const ResultsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 30px;
`;
const PosterContainer = styled.div`
    position: relative;
    width: 100%;
    height: 300px; /* 높이 조정 */
`;
const ResultImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    background-color: ${lightGray};
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
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
    color: ${textGray};
`;
const ButtonGroup = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 75%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  opacity: 0;
  transform: translate(-50%, -45%);
  transition: all 0.3s ease;
`;
const HoverOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    opacity: 0;
    transition: opacity 0.3s ease;
`;
const ResultCard = styled.div`
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
        ${HoverOverlay} { opacity: 1; }
        ${ButtonGroup} { opacity: 1; transform: translate(-50%, -50%); }
    }
`;
const ActionButton = styled(Link)`
  width: 100%;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  background-color: ${primaryBlue};
  color: ${white};
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  transition: all 0.2s ease;

  &.secondary {
    background-color: ${white};
    color: ${darkGray};
  }
  &:hover {
    transform: scale(1.05);
  }
`;
const PaginationNav = styled.nav`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin: 40px 0;
`;
const PageButton = styled.button`
    border: 1px solid ${mediumGray};
    border-radius: 8px;
    padding: 8px 12px;
    margin: 0;
    background-color: ${({ active }) => (active ? primaryBlue : white)};
    color: ${({ active }) => (active ? white : darkGray)};
    font-size: 16px;
    font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
    cursor: pointer;
    transition: all 0.2s ease;
    &:hover:not(:disabled) {
        background-color: ${lightGray};
        border-color: ${darkGray};
    }
    &:disabled {
        background-color: ${lightGray};
        color: ${mediumGray};
        cursor: not-allowed;
    }
`;
