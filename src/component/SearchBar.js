import React, { useState } from 'react';
import styled from 'styled-components';
import { FaSearch } from "react-icons/fa";
const SearchContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 100px;
  padding: 12px;
  display: flex;
  gap: 8px;
  max-width: 800px;
  margin: 15px auto;
`;

const Select = styled.select`
  padding: 8px;
  border: none;
  outline: none;
  font-size: 16px;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px;
  border: none;
  outline: none;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #3182f6;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #2563eb;
  }
`;

function SearchBar() {
  const [searchType, setSearchType] = useState('movie');
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    console.log(`검색 유형: ${searchType}, 검색어: ${query}`);
  };

  return (
    <SearchContainer>
      <Select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
        <option value="movie">영화</option>
        <option value="actor">배우</option>
        <option value="director">감독</option>
      </Select>
      <Input
        type="text"
        placeholder="검색어를 입력하세요"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button onClick={handleSearch}><FaSearch/></Button>
    </SearchContainer>
  );
}

export default SearchBar;
