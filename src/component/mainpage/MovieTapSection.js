import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaSearch, FaCaretDown } from "react-icons/fa";
import { useGenres } from '../../context/GenreContext';
import { useScreenTypes } from '../../context/ScreenTypeContext'; // 상영 타입 Context 훅 임포트

// --- 스타일 상수 ---
const primaryBlue = '#1E6DFF';
const lightGray = '#f1f3f5';
const mediumGray = '#dee2e6';
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
const FilterBar = () => {
    const { genres: allGenres, loading: genresLoading, error: genresError } = useGenres();
    // 상영 타입 Context에서 데이터 가져오기
    const { screenTypes: allScreenTypes, loading: screenTypesLoading } = useScreenTypes();

    const [tempSearchType, setTempSearchType] = useState('movie');
    const [tempSortOrder, setTempSortOrder] = useState('popularity');
    const [tempGenres, setTempGenres] = useState([]);
    const [tempScreenTypes, setTempScreenTypes] = useState([]);
    const [tempSearchTerm, setTempSearchTerm] = useState('');

    const [isGenreOpen, setIsGenreOpen, genreRef] = useDropdown();
    const [isScreenTypeOpen, setIsScreenTypeOpen, screenTypeRef] = useDropdown();
    
    const navigate = useNavigate();
    const isMovieSearch = tempSearchType === 'movie';

    useEffect(() => {
        if (!isMovieSearch) {
            setTempSortOrder('popularity');
            setTempGenres([]);
            setTempScreenTypes([]);
        }
    }, [isMovieSearch]);

    const handleGenreToggle = (genreName) => setTempGenres(prev => prev.includes(genreName) ? prev.filter(g => g !== genreName) : [...prev, genreName]);
    const handleScreenTypeToggle = (typeName) => setTempScreenTypes(prev => prev.includes(typeName) ? prev.filter(t => t !== typeName) : [...prev, typeName]);
    
    const handleApply = () => navigate('/moviechart', { state: { searchType: tempSearchType, filters: { query: tempSearchTerm, sortBy: isMovieSearch ? (tempSortOrder === 'release' ? 'RELEASE_DATE' : 'POPULARITY') : 'POPULARITY', genres: isMovieSearch ? tempGenres : [], screenTypes: isMovieSearch ? tempScreenTypes : [] } } });
    const getPlaceholderText = () => {
        switch (tempSearchType) {
            case 'movie': return "영화를 검색해보세요";
            case 'actor': return "배우를 검색해보세요";
            case 'director': return "감독을 검색해보세요";
            default: return "검색어를 입력해보세요";
        }
    };

    return (
        <FilterContainer>
            <FilterGroup>
                <Select value={tempSearchType} onChange={(e) => setTempSearchType(e.target.value)}>
                    <option value="movie">영화</option>
                    <option value="actor">배우</option>
                    <option value="director">감독</option>
                </Select>
            </FilterGroup>
            <FilterGroup>
                <Select value={tempSortOrder} onChange={(e) => setTempSortOrder(e.target.value)} disabled={!isMovieSearch}>
                    <option value="popularity">인기순</option>
                    <option value="release">최신순</option>
                </Select>
            </FilterGroup>
            <FilterGroup ref={genreRef}>
                <CustomSelectButton onClick={() => isMovieSearch && setIsGenreOpen(!isGenreOpen)} open={isGenreOpen} disabled={!isMovieSearch}>
                    {tempGenres.length > 0 ? `${tempGenres.join(', ')}` : '장르 선택'} <FaCaretDown />
                </CustomSelectButton>
                {isGenreOpen && isMovieSearch && (
                    <DropdownList>
                        {genresLoading ? <DropdownStatus>로딩 중...</DropdownStatus> : genresError ? <DropdownStatus error>{genresError}</DropdownStatus> :
                         allGenres.map(genre => (
                            <CheckboxItem key={genre.name}>
                                <input type="checkbox" checked={tempGenres.includes(genre.name)} onChange={() => handleGenreToggle(genre.name)} /> {genre.name}
                            </CheckboxItem>
                        ))}
                    </DropdownList>
                )}
            </FilterGroup>
            <FilterGroup ref={screenTypeRef}>
                <CustomSelectButton onClick={() => isMovieSearch && setIsScreenTypeOpen(!isScreenTypeOpen)} open={isScreenTypeOpen} disabled={!isMovieSearch}>
                    {tempScreenTypes.length > 0 ? tempScreenTypes.join(', ') : '상영 타입'} <FaCaretDown />
                </CustomSelectButton>
                {isScreenTypeOpen && isMovieSearch && (
                    <DropdownList>
                        {screenTypesLoading ? <DropdownStatus>로딩 중...</DropdownStatus> :
                         allScreenTypes.map(type => (
                            <CheckboxItem key={type.type}>
                                <input type="checkbox" checked={tempScreenTypes.includes(type.type)} onChange={() => handleScreenTypeToggle(type.type)} /> {type.type}
                            </CheckboxItem>
                        ))}
                    </DropdownList>
                )}
            </FilterGroup>
            <SearchGroup>
                <SearchInput type="text" placeholder={getPlaceholderText()} value={tempSearchTerm} onChange={(e) => setTempSearchTerm(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleApply()} />
                <ApplyButton onClick={handleApply}><FaSearch /></ApplyButton>
            </SearchGroup>
        </FilterContainer>
    );
};

// --- MovieGrid 컴포넌트 ---
const MovieGrid = ({ results }) => {
    const getPosterUrl = (movie) => {
        const urls = movie.posterUrls;
        if (Array.isArray(urls) && urls.length > 0) {
            try {
                const parsed = JSON.parse(urls[0]);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
            } catch (e) {
                return urls[0];
            }
        }
        if (typeof urls === 'string' && urls.startsWith('http')) return urls;
        return 'https://placehold.co/240x360/e9ecef/adb5bd?text=No+Image';
    };

    if (!results || results.length === 0) {
        return <StatusText>표시할 영화가 없습니다.</StatusText>;
    }

    return (
        <Grid>
            {results.map((movie) => (
                <MovieCard key={movie.id}>
                    <PosterContainer>
                        <Poster 
                            src={getPosterUrl(movie)} 
                            alt={`${movie.title} 포스터`} 
                            referrerPolicy="no-referrer"
                            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/240x360/e9ecef/adb5bd?text=Image+Error'; }}
                        />
                        <HoverOverlay>
                            <ButtonGroup>
                                <ActionButton as={Link} to={`/movie/${movie.id}`} className="secondary">상세보기</ActionButton>
                                <ActionButton as={Link} to={`/reservation?movie=${movie.id}`}>예매하기</ActionButton>
                            </ButtonGroup>
                        </HoverOverlay>
                    </PosterContainer>
                    <Info>
                        <h3>{movie.title}</h3>
                        <p>예매 수 {movie.cumulativeBookings}</p>
                    </Info>
                </MovieCard>
            ))}
        </Grid>
    );
};

// --- 메인 컴포넌트 ---
const MovieTabSection = () => {
    const [activeTab, setActiveTab] = useState('chart');
    const [movieList, setMovieList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            setIsLoading(true);
            setError(null);
            setMovieList([]);

            let endpoint = '';
            if (activeTab === 'chart') {
                endpoint = `/movies/ranking?page=0&size=4`;
            } else if (activeTab === 'upcoming') {
                endpoint = `/movies/upcoming?page=0&size=4`;
            } else {
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(endpoint);
                if (!response.ok) {
                    throw new Error(`${activeTab === 'chart' ? '랭킹' : '상영예정작'} 정보를 불러오는데 실패했습니다.`);
                }
                const responseData = await response.json();
                setMovieList(responseData.data?.content || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovies();
    }, [activeTab]);

    return (
        <SectionWrapper>
            <FilterBar />
            <TabContainer>
                <TabList>
                    <Tab active={activeTab === 'chart'} onClick={() => setActiveTab('chart')}>무비차트</Tab>
                    <Tab active={activeTab === 'upcoming'} onClick={() => setActiveTab('upcoming')}>상영예정작</Tab>
                </TabList>
                <ViewAllButton to={`/moviechart`}>전체보기</ViewAllButton>
            </TabContainer>
            
            {isLoading && <StatusText>로딩 중...</StatusText>}
            {error && <StatusText error>{error}</StatusText>}
            {!isLoading && !error && <MovieGrid results={movieList} />}
        </SectionWrapper>
    );
};


// --- STYLED COMPONENTS ---
const SectionWrapper = styled.section` margin-top: 60px; `;
const FilterContainer = styled.div`
  display: flex; flex-wrap: wrap; gap: 16px; padding: 24px;
  background-color: ${white}; border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.07); margin-bottom: 40px;
`;
const FilterGroup = styled.div` position: relative; `;
const Select = styled.select`
  height: 42px; padding: 0 16px; border-radius: 8px; border: 1px solid ${mediumGray};
  background-color: ${white}; font-size: 15px; cursor: pointer;
  -webkit-appearance: none; appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23868e96' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 12px center; padding-right: 40px;
  &:disabled { background-color: ${lightGray}; color: #adb5bd; cursor: not-allowed; border-color: ${mediumGray}; }
`;
const CustomSelectButton = styled.button`
    height: 42px; padding: 0 16px; border-radius: 8px; border: 1px solid ${mediumGray};
    background-color: ${white}; font-size: 15px; cursor: pointer;
    display: flex; justify-content: space-between; align-items: center;
    min-width: 150px; text-align: left;
    svg { margin-left: 8px; transition: transform 0.2s ease; transform: ${({ open }) => (open ? 'rotate(180deg)' : 'rotate(0deg)')}; }
    &:disabled { background-color: ${lightGray}; color: #adb5bd; cursor: not-allowed; border-color: ${mediumGray}; svg { color: #adb5bd; } }
`;
const DropdownList = styled.div`
  position: absolute; top: calc(100% + 5px); left: 0; min-width: 100%;
  background-color: ${white}; border: 1px solid ${mediumGray}; border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1); z-index: 100;
  padding: 8px; max-height: 250px; overflow-y: auto;
`;
const DropdownStatus = styled.div` padding: 10px 12px; color: ${({error}) => error ? '#e03131' : '#868e96'}; `;
const CheckboxItem = styled.label`
  display: flex; align-items: center; padding: 10px 12px; border-radius: 6px;
  cursor: pointer; font-size: 15px; white-space: nowrap;
  input[type="checkbox"] { margin-right: 10px; accent-color: ${primaryBlue}; }
  &:hover { background-color: ${lightGray}; }
`;
const SearchGroup = styled.div`
    margin-left: auto; display: flex; align-items: center;
    border: 1px solid ${mediumGray}; border-radius: 8px;
    overflow: hidden; height: 42px;
    &:focus-within { border-color: ${primaryBlue}; box-shadow: 0 0 0 2px rgba(30, 109, 255, 0.2); }
`;
const SearchInput = styled.input`
  border: none; padding: 0 16px; font-size: 15px;
  outline: none; width: 250px;
`;
const ApplyButton = styled.button`
  padding: 0 20px; background-color : white; color: ${darkGray};
  border: none; font-size: 16px; cursor: pointer; height: 100%;
  transition: background-color 0.2s ease;
  &:hover { background-color: ${lightGray}; }
`;
const TabContainer = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  border-bottom: 1px solid ${mediumGray}; margin-bottom: 24px;
`;
const TabList = styled.div` display: flex; gap: 20px; `;
const Tab = styled.div`
  padding: 16px 5px; font-size: 22px; font-weight: 700;
  color: ${({ active }) => (active ? darkGray : '#adb5bd')};
  cursor: pointer; position: relative; transition: color 0.3s ease;
  &::after {
    content: ''; position: absolute; bottom: -1px; left: 0;
    width: 100%; height: 3px; background-color: ${primaryBlue};
    transform: scaleX(${({ active }) => (active ? 1 : 0)});
    transition: transform 0.3s ease;
  }
`;
const ViewAllButton = styled(Link)`
  background: none; border: 1px solid ${mediumGray}; border-radius: 20px;
  color: ${darkGray}; cursor: pointer; padding: 8px 18px;
  font-size: 14px; font-weight: 500; text-decoration: none;
  transition: all 0.2s ease;
  &:hover { background-color: ${lightGray}; border-color: ${darkGray}; }
`;
const Grid = styled.div`
  display: grid; gap: 30px;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
`;
const StatusText = styled.p`
    text-align: center; font-size: 18px;
    color: ${props => props.error ? '#e03131' : '#868e96'}; padding: 50px;
`;
const ButtonGroup = styled.div`
  position: absolute; top: 50%; left: 50%; width: 75%;
  display: flex; flex-direction: column; align-items: center;
  gap: 12px; opacity: 0; transform: translate(-50%, -45%);
  transition: all 0.3s ease;
`;
const HoverOverlay = styled.div`
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.6); opacity: 0;
    transition: opacity 0.3s ease;
`;
const MovieCard = styled.div`
  background-color: #fff; border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden; transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    ${HoverOverlay} { opacity: 1; }
    ${ButtonGroup} { opacity: 1; transform: translate(-50%, -50%); }
  }
`;
const PosterContainer = styled.div`
    position: relative; width: 100%; height: 360px;
`;
const Poster = styled.img`
  width: 100%; height: 100%; object-fit: cover; display: block;
`;
const Info = styled.div`
  padding: 16px;
  h3 { font-size: 20px; font-weight: 700; margin: 0 0 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  p { margin: 0; font-size: 15px; color: #555; }
`;
const ActionButton = styled.button`
  width: 100%; padding: 12px 20px; font-size: 16px; font-weight: 700;
  border: none; border-radius: 8px; background-color: #1E6DFF; color: #fff;
  cursor: pointer; text-decoration: none; display: inline-block;
  text-align: center; transition: all 0.2s ease;
  &.secondary { background-color: #fff; color: #333; }
  &:hover { transform: scale(1.05); }
`;

export default MovieTabSection;
