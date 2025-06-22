import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaSearch, FaCaretDown } from "react-icons/fa";
import { useGenres } from '../../context/GenreContext'; // GenreContext 사용

// --- 스타일 상수 ---
const primaryBlue = '#1E6DFF';
const lightGray = '#f1f3f5';
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
    // Context에서 장르 목록, 로딩, 에러 상태 가져오기
    const { genres: allGenres, loading: genresLoading, error: genresError } = useGenres();

    // 필터 옵션 상태 관리
    const [searchType, setSearchType] = useState('movie');
    const [sortOrder, setSortOrder] = useState('RELEASE_DATE');
    const [genres, setGenres] = useState([]);
    const [screenTypes, setScreenTypes] = useState([]);
    const [query, setQuery] = useState('');

    const [isGenreOpen, setIsGenreOpen, genreRef] = useDropdown();
    const [isScreenTypeOpen, setIsScreenTypeOpen, screenTypeRef] = useDropdown();

    const isMovieSearch = searchType === 'movie';

    // 검색 타입(영화, 배우, 감독)이 변경될 때 영화 관련 필터 초기화
    useEffect(() => {
        if (!isMovieSearch) {
            setSortOrder('RELEASE_DATE');
            setGenres([]);
            setScreenTypes([]);
        }
    }, [searchType, isMovieSearch]);

    // 목업 데이터 대신 실제 상영관 타입 목록
    const allScreenTypes = ['2D', '3D', 'IMAX', '4DX'];

    const handleGenreToggle = (genreName) => {
        setGenres(prev => prev.includes(genreName) ? prev.filter(g => g !== genreName) : [...prev, genreName]);
    };
    
    const handleScreenTypeToggle = (typeName) => {
        setScreenTypes(prev => prev.includes(typeName) ? prev.filter(t => t !== typeName) : [...prev, typeName]);
    };

    // '검색' 버튼 클릭 시, 부모(MovieChartPage)에게 현재 필터 상태를 전달
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
                        {genresLoading && <DropdownStatus>장르 로딩 중...</DropdownStatus>}
                        {genresError && <DropdownStatus error>{genresError}</DropdownStatus>}
                        {!genresLoading && !genresError && allGenres && (
                            allGenres.map(genre => (
                                <CheckboxItem key={genre.name}>
                                    <input type="checkbox" checked={genres.includes(genre.name)} onChange={() => handleGenreToggle(genre.name)} /> {genre.name}
                                </CheckboxItem>
                            ))
                        )}
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

export default FilterBar;


// --- STYLED COMPONENTS ---
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
    color: #adb5bd;
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
        color: #adb5bd;
        cursor: not-allowed;
        border-color: ${mediumGray};
        svg {
            color: #adb5bd;
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
  max-height: 250px;
  overflow-y: auto;
`;
const DropdownStatus = styled.div`
    padding: 10px 12px;
    color: ${({error}) => error ? '#e03131' : '#868e96'};
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
  &:hover {
    background-color: ${lightGray};
  }
`;