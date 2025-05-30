import { useState } from "react";
import Navbar from "../component/common/NavBar";
import SearchBar from "../component/common/SearchBar";
import MovieGrid from "../component/mainpage/MovieGrid";
import styled from "styled-components";



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

const MovieChartPage = () => {
    const [tempGenres, setTempGenres] = useState([]);
    const [tempScreenTypes, setTempScreenTypes] = useState([]);
    const [tempSortOrder, setTempSortOrder] = useState('popularity');
    const toggleSelection = (value, currentList, setList) => {
        if (currentList.includes(value)) {
            setList(currentList.filter(v => v !== value));
        } else {
            setList([...currentList, value]);
        }
    };
    return (
        <div>
            <Navbar underline={true}></Navbar>
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

                <SearchBar />
            </FilterContainer>
            <MovieGrid></MovieGrid>
        </div>
    )
}
export default MovieChartPage

