import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import MovieGrid from './MovieGrid';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaCaretDown } from "react-icons/fa";

// --- 스타일 상수 ---
const primaryBlue = '#1E6DFF';
const darkBlue = '#005fa3';
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
    // 각 필터의 임시 상태
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
    }, [tempSearchType, isMovieSearch]);


    const allGenres = ['액션', '코미디', '드라마', '공포', '로맨스', '스릴러'];
    const allScreenTypes = ['2D', '3D', 'IMAX', '4DX'];

    const handleGenreToggle = (genre) => {
        setTempGenres(prev => 
            prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
        );
    };
    
    const handleScreenTypeToggle = (type) => {
        setTempScreenTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const handleApply = () => {
        navigate('/home', {
            state: {
                searchType: tempSearchType,
                filters: {
                    query: tempSearchTerm,
                    sortBy: isMovieSearch ? (tempSortOrder === 'release' ? 'RELEASE_DATE' : 'POPULARITY') : 'POPULARITY', 
                    genres: isMovieSearch ? tempGenres : [],
                    screenTypes: isMovieSearch ? tempScreenTypes : [],
                }
            }
        });
    };
    
    // 검색 타입에 따라 placeholder 텍스트를 반환하는 함수
    const getPlaceholderText = () => {
        switch (tempSearchType) {
            case 'movie':
                return "영화를 검색해보세요";
            case 'actor':
                return "배우를 검색해보세요";
            case 'director':
                return "감독을 검색해보세요";
            default:
                return "검색어를 입력해보세요";
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
                        {allGenres.map(genre => (
                            <CheckboxItem key={genre}>
                                <input type="checkbox" checked={tempGenres.includes(genre)} onChange={() => handleGenreToggle(genre)} /> {genre}
                            </CheckboxItem>
                        ))}
                    </DropdownList>
                )}
            </FilterGroup>

            <FilterGroup ref={screenTypeRef}>
                 <CustomSelectButton onClick={() => isMovieSearch && setIsScreenTypeOpen(!isScreenTypeOpen)} open={isScreenTypeOpen} disabled={!isMovieSearch}>
                    {tempScreenTypes.length > 0 ? tempScreenTypes.join(', ') : '상영관 타입'} <FaCaretDown />
                </CustomSelectButton>
                {isScreenTypeOpen && isMovieSearch && (
                    <DropdownList>
                        {allScreenTypes.map(type => (
                            <CheckboxItem key={type}>
                                <input type="checkbox" checked={tempScreenTypes.includes(type)} onChange={() => handleScreenTypeToggle(type)} /> {type}
                            </CheckboxItem>
                        ))}
                    </DropdownList>
                )}
            </FilterGroup>
            
            <SearchGroup>
                {/* placeholder를 동적으로 변경 */}
                 <SearchInput 
                    type="text" 
                    placeholder={getPlaceholderText()}
                    value={tempSearchTerm}
                    onChange={(e) => setTempSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleApply()}
                 />
                 <ApplyButton onClick={handleApply}><FaSearch /></ApplyButton>
            </SearchGroup>
        </FilterContainer>
    );
};


const MovieTabSection = () => {
    const [activeTab, setActiveTab] = useState('chart');
    const [filters, setFilters] = useState({
        sortOrder: 'popularity',
        genres: [],
        screenTypes: [],
        searchTerm: '',
    });

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
            <MovieGrid type={activeTab} filters={filters} />
        </SectionWrapper>
    );
};


// --- STYLED COMPONENTS ---
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
  margin-bottom: 40px;
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
  background-color : white;
  color: ${darkGray};
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${mediumGray};
  margin-bottom: 24px;
`;

const TabList = styled.div`
  display: flex;
  gap: 20px;
`;

const Tab = styled.div`
  padding: 16px 5px;
  font-size: 22px;
  font-weight: 700;
  color: ${({ active }) => (active ? darkGray : '#adb5bd')};
  cursor: pointer;
  position: relative;
  transition: color 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: ${primaryBlue};
    transform: scaleX(${({ active }) => (active ? 1 : 0)});
    transition: transform 0.3s ease;
  }
`;

const ViewAllButton = styled(Link)`
  background: none;
  border: 1px solid ${mediumGray};
  border-radius: 20px;
  color: ${darkGray};
  cursor: pointer;
  padding: 8px 18px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${lightGray};
    border-color: ${darkGray};
  }
`;

export default MovieTabSection;