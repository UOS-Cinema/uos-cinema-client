import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import MovieGrid from './MovieGrid';
import { Link } from 'react-router-dom';
import { FaSearch, FaCaretDown } from "react-icons/fa";

const primaryBlue = '#1E6DFF';
const darkBlue = '#005fa3';
const lightGray = '#eee';
const mediumGray = '#ccc';
const darkGray = '#333';
const white = '#fff';
const textGray = '#555';

const SectionWrapper = styled.div`
    width: 80%;
    margin: 0 auto;
    padding-bottom: 50px;
`;

const TabContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 30px 0 20px;
`;

const TabList = styled.div`
    display: flex;
`;

const Tab = styled.div`
    margin: 0 15px;
    padding-bottom: 8px;
    font-size: 20px;
    font-weight: bold;
    color: ${({ active }) => (active ? darkGray : mediumGray)};
    cursor: pointer;
    border-bottom: 3px solid ${({ active }) => (active ? primaryBlue : 'transparent')};
    transition: all 0.3s ease;

    &:hover {
        color: ${darkGray};
        border-bottom-color: ${primaryBlue};
    }
`;

const ViewAllButton = styled(Link)`
    background-color: ${primaryBlue};
    border: none;
    border-radius: 20px;
    color: ${white};
    cursor: pointer;
    padding: 8px 18px;
    font-size: 14px;
    text-decoration: none;
    transition: background-color 0.3s ease, transform 0.2s ease;

    &:hover {
        background-color: ${darkBlue};
        transform: translateY(-2px);
    }

    &:active {
        background-color: #004f8a;
        transform: translateY(0);
    }
`;

const FilterContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-end;
    gap: 25px;
    margin-top: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid ${lightGray};
`;

const FilterGroup = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;

    strong {
        font-size: 16px;
        margin-bottom: 8px;
        color: ${darkGray};
    }
`;

const CustomSelectButton = styled.button`
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid ${mediumGray};
    background-color: ${white};
    color: ${darkGray};
    font-size: 15px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-width: 120px;
    height: 40px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &:focus {
        border-color: ${primaryBlue};
        box-shadow: 0 0 0 2px rgba(30, 109, 255, 0.2);
        outline: none;
    }

    svg {
        margin-left: 8px;
        transition: transform 0.2s ease;
        transform: ${({ open }) => (open ? 'rotate(180deg)' : 'rotate(0deg)')};
    }
`;

const DropdownList = styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    max-height: 200px;
    overflow-y: auto;
    background-color: ${white};
    border: 1px solid ${mediumGray};
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    z-index: 10;
    margin-top: 5px;
`;

const CheckboxItem = styled.label`
    display: flex;
    align-items: center;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 15px;
    color: ${darkGray};

    input[type="checkbox"] {
        margin-right: 8px;
        accent-color: ${primaryBlue};
    }

    &:hover {
        background-color: ${lightGray};
    }
`;

// 검색 유형 선택, 검색 입력창, 조회하기 버튼을 모두 포함하는 하나의 컨테이너
const SearchAndApplyGroup = styled.div`
    display: flex;
    align-items: center;
    /* gap: 10px; 이 간격을 조절하거나, Select와 CombinedSearchInput 사이에는 간격을 없앨 예정 */
    margin-left: auto;
    max-width: 500px;
`;

// 검색 유형 Select와 검색 입력창을 붙여주는 새로운 컨테이너
const SearchTypeAndInputWrapper = styled.div`
    display: flex;
    align-items: center;
    height: 40px; /* 높이 통일 */
`;

const CombinedSearchInput = styled.div`
    display: flex;
    border: 1px solid ${mediumGray};
    border-radius: 20px;
    overflow: hidden;
    align-items: center;
    height: 40px;
    flex-grow: 1;
    box-sizing: border-box;
`;

const SearchInput = styled.input`
    border: none;
    padding: 0 15px;
    font-size: 15px;
    outline: none;
    flex-grow: 1;
    height: 100%;
    background-color: ${white};

    &::placeholder {
        color: ${mediumGray};
    }
`;

const SearchIconButton = styled.button`
    background-color: ${white};
    border: none;
    padding: 0 15px;
    cursor: pointer;
    font-size: 18px;
    color: ${textGray};
    height: 100%;
    transition: color 0.2s ease;

    &:hover {
        color: ${primaryBlue};
    }
`;

const Select = styled.select`
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid ${mediumGray};
    background-color: ${white};
    color: ${darkGray};
    font-size: 15px;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24'%3E%3Cpath fill='%23333' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    height: 40px;
    min-width: 120px;
  box-sizing: border-box;
    &:focus {
        border-color: ${primaryBlue};
        box-shadow: 0 0 0 2px rgba(30, 109, 255, 0.2);
        outline: none;
    }
`;


const ApplyButton = styled.button`
    padding: 10px 20px;
    background-color: ${primaryBlue};
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    height: 40px;
    transition: background-color 0.3s ease, transform 0.2s ease;

    &:hover {
        background-color: ${darkBlue};
        transform: translateY(-2px);
    }

    &:active {
        background-color: #004f8a;
        transform: translateY(0);
    }
`;


const MovieTabSection = () => {
  const [activeTab, setActiveTab] = useState('chart');

  const [tempGenres, setTempGenres] = useState([]);
  const [tempScreenTypes, setTempScreenTypes] = useState([]);
  const [tempSortOrder, setTempSortOrder] = useState('popularity');
  const [tempSearchTerm, setTempSearchTerm] = useState('');
  const [tempSearchType, setTempSearchType] = useState('title');

  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const [isScreenTypeDropdownOpen, setIsScreenTypeDropdownOpen] = useState(false);

  const [filters, setFilters] = useState({
    genres: [],
    screenTypes: [],
    sortOrder: 'popularity',
    searchTerm: '',
    searchType: 'title'
  });

  const genreDropdownRef = useRef(null);
  const screenTypeDropdownRef = useRef(null);

  const allGenres = ['액션', '코미디', '드라마', '공포', '로맨스', '스릴러', '판타지', 'SF', '애니메이션', '다큐멘터리', '범죄', '뮤지컬'];
  const allScreenTypes = ['2D', '3D', 'IMAX', '4DX', 'ATMOS', 'SCREENX'];

  useEffect(() => {
    function handleClickOutside(event) {
      if (genreDropdownRef.current && !genreDropdownRef.current.contains(event.target)) {
        setIsGenreDropdownOpen(false);
      }
      if (screenTypeDropdownRef.current && !screenTypeDropdownRef.current.contains(event.target)) {
        setIsScreenTypeDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [genreDropdownRef, screenTypeDropdownRef]);

  const toggleSelection = (value, currentList, setList) => {
    if (currentList.includes(value)) {
      setList(currentList.filter(v => v !== value));
    } else {
      setList([...currentList, value]);
    }
  };

  const applyFilters = () => {
    setFilters({
      genres: tempGenres,
      screenTypes: tempScreenTypes,
      sortOrder: tempSortOrder,
      searchTerm: tempSearchTerm,
      searchType: tempSearchType
    });
    setIsGenreDropdownOpen(false);
    setIsScreenTypeDropdownOpen(false);
  };

  return (
    <SectionWrapper>
      <FilterContainer>
        {/* 정렬 필터 */}
        <FilterGroup>
          <strong>정렬</strong>
          <Select value={tempSortOrder} onChange={(e) => setTempSortOrder(e.target.value)}>
            <option value="popularity">인기순</option>
            <option value="release">개봉일순</option>
          </Select>
        </FilterGroup>

        {/* 장르 필터 */}
        <FilterGroup ref={genreDropdownRef}>
          <strong>장르</strong>
          <CustomSelectButton onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)} open={isGenreDropdownOpen}>
            {tempGenres.length > 0 ? tempGenres.join(', ') : '전체 장르'}
            <FaCaretDown />
          </CustomSelectButton>
          {isGenreDropdownOpen && (
            <DropdownList>
              {allGenres.map(genre => (
                <CheckboxItem key={genre}>
                  <input
                    type="checkbox"
                    checked={tempGenres.includes(genre)}
                    onChange={() => toggleSelection(genre, tempGenres, setTempGenres)}
                  />
                  {genre}
                </CheckboxItem>
              ))}
            </DropdownList>
          )}
        </FilterGroup>

        {/* 상영유형 필터 */}
        <FilterGroup ref={screenTypeDropdownRef}>
          <strong>상영유형</strong>
          <CustomSelectButton onClick={() => setIsScreenTypeDropdownOpen(!isScreenTypeDropdownOpen)} open={isScreenTypeDropdownOpen}>
            {tempScreenTypes.length > 0 ? tempScreenTypes.join(', ') : '전체 상영유형'}
            <FaCaretDown />
          </CustomSelectButton>
          {isScreenTypeDropdownOpen && (
            <DropdownList>
              {allScreenTypes.map(type => (
                <CheckboxItem key={type}>
                  <input
                    type="checkbox"
                    checked={tempScreenTypes.includes(type)}
                    onChange={() => toggleSelection(type, tempScreenTypes, setTempScreenTypes)}
                  />
                  {type}
                </CheckboxItem>
              ))}
            </DropdownList>
          )}
        </FilterGroup>
        <ApplyButton onClick={applyFilters}> {/* ApplyButton은 이제 SearchAndApplyGroup의 gap의 영향을 받음 */}
          조회하기
        </ApplyButton>
        {/* 영화 검색 유형 선택, 검색 입력창, 조회하기 버튼 그룹 */}
        {/* SearchAndApplyGroup으로 모두 묶고, FilterContainer의 flex-start 정렬에 맞춰 gap으로 간격 유지 */}
        <SearchAndApplyGroup style={{ marginLeft: 'auto', gap: '10px' }}> {/* gap은 이 그룹 내 요소들 사이의 간격으로 사용 */}
          <SearchTypeAndInputWrapper> {/* Select와 CombinedSearchInput을 붙여주는 Wrapper */}
            <Select value={tempSearchType} onChange={(e) => setTempSearchType(e.target.value)} style={{ borderRadius: '8px 0 0 8px', minWidth: '80px', width: 'auto' }}>
              <option value="title">영화</option>
              <option value="actor">배우</option>
              <option value="director">감독</option>
            </Select>
            <CombinedSearchInput style={{ borderRadius: '0 20px 20px 0' }}>
              <SearchInput
                type="text"
                placeholder="영화 제목 검색"
                value={tempSearchTerm}
                onChange={(e) => setTempSearchTerm(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    applyFilters();
                  }
                }}
              />
              <SearchIconButton onClick={applyFilters}>
                <FaSearch />
              </SearchIconButton>
            </CombinedSearchInput>
          </SearchTypeAndInputWrapper>

        </SearchAndApplyGroup>
      </FilterContainer>

      <TabContainer>
        <TabList>
          <Tab active={activeTab === 'chart'} onClick={() => setActiveTab('chart')}>
            무비차트
          </Tab>
          <Tab active={activeTab === 'upcoming'} onClick={() => setActiveTab('upcoming')}>
            상영예정작
          </Tab>
        </TabList>
        <ViewAllButton to={`/moviechart`}>전체보기</ViewAllButton>
      </TabContainer>

      <MovieGrid
        type={activeTab}
        sortOrder={filters.sortOrder}
        genres={filters.genres}
        screenTypes={filters.screenTypes}
        searchTerm={filters.searchTerm}
        searchType={filters.searchType}
      />
    </SectionWrapper>
  );
};

export default MovieTabSection;