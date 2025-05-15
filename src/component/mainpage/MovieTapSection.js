import React, { useState } from 'react';
import styled from 'styled-components';
import MovieGrid from './MovieGrid';
import { Link } from 'react-router-dom';
import SearchBar from '../common/SearchBar';

const TabContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
  margin-left: 10%;
  width: 80%;
`;

const TabList = styled.div`
  display: flex;
`;

const Tab = styled.div`
  margin: 0 20px;
  font-size: 18px;
  font-weight: bold;
  color: ${({ active }) => (active ? '#000' : '#aaa')};
  cursor: pointer;

  &:hover {
    color: #000;
  }
`;

const ViewAllButton = styled.button`
  background: none;
  border: none;
  font-size: 12px;
  background-color:#1E6DFF;
  border-radius:12px;
  color: white;
  cursor: pointer;
  padding: 6px 12px;

  &:hover {
    background-color: #005fa3;
  }

  &:active {
    background-color: #004f8a;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;

  &:visited {
    color: inherit;
  }
`;


const FilterContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  margin-left: 11%;
  margin-top:20px;
  width: 80%;
  margin-bottom: 20px;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top:6px;
`;

const FilterButton = styled.button`
  padding: 8px 12px;
  border-radius: 20px;
  border: 1px solid #ccc;
  background-color: ${({ active }) => (active ? '#1E6DFF' : '#fff')};
  color: ${({ active }) => (active ? '#fff' : '#333')};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ active }) => (active ? '#005fa3' : '#eee')};
  }
`;

const Select = styled.select`
  padding: 8px;
  border-radius: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  margin-top:6px;
`;

const SearchButton = styled.button`
  padding: 10px 16px;
  background-color: #1E6DFF;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  width: fit-content;
  height:40px;

  &:hover {
    background-color: #005fa3;
  }
`;

const MovieTabSection = () => {
  const [activeTab, setActiveTab] = useState('chart');

  // 임시 선택 상태 (조회하기 전에만 반영됨)
  const [tempGenres, setTempGenres] = useState([]);
  const [tempScreenTypes, setTempScreenTypes] = useState([]);
  const [tempSortOrder, setTempSortOrder] = useState('popularity');

  // 실제 반영되는 필터링 상태
  const [filters, setFilters] = useState({
    genres: [],
    screenTypes: [],
    sortOrder: 'popularity'
  });

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
      sortOrder: tempSortOrder
    });
  };

  return (
    <div>


      <FilterContainer>
        <div>
          <strong>정렬</strong><br />
          <Select value={tempSortOrder} onChange={(e) => setTempSortOrder(e.target.value)}>
            <option value="popularity">인기순</option>
            <option value="release">개봉일순</option>
          </Select>
        </div>

        <div>
          <strong>장르</strong>
          <ButtonGroup>
            {['액션', '코미디', '드라마', '공포', '로맨스'].map(genre => (
              <FilterButton
                key={genre}
                active={tempGenres.includes(genre)}
                onClick={() => toggleSelection(genre, tempGenres, setTempGenres)}
              >
                {genre}
              </FilterButton>
            ))}
          </ButtonGroup>
        </div>

        <div>
          <strong>상영유형</strong>
          <ButtonGroup>
            {['2D', '3D', 'IMAX', '4DX'].map(type => (
              <FilterButton
                key={type}
                active={tempScreenTypes.includes(type)}
                onClick={() => toggleSelection(type, tempScreenTypes, setTempScreenTypes)}
              >
                {type}
              </FilterButton>
            ))}
          </ButtonGroup>
        </div>

      </FilterContainer>
      <SearchBar />
      <TabContainer>
        <TabList>
          <Tab active={activeTab === 'chart'} onClick={() => setActiveTab('chart')}>
            무비차트
          </Tab>
          <Tab active={activeTab === 'upcoming'} onClick={() => setActiveTab('upcoming')}>
            상영예정작
          </Tab>
        </TabList>
        <ViewAllButton><StyledLink to={`/moviechart`}>전체보기</StyledLink></ViewAllButton>
      </TabContainer>
      <MovieGrid
        type={activeTab}
        sortOrder={filters.sortOrder}
        genres={filters.genres}
        screenTypes={filters.screenTypes}
      />
    </div>
  );
};

export default MovieTabSection;
