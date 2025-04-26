import React, { useState } from 'react';
import styled from 'styled-components';
import MovieGrid from './MovieGrid';
import { Link } from 'react-router-dom';

const TabContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
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
  transition: color 0.3s;

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
  transition: color 0.3s;

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

const MovieTabSection = () => {
  const [activeTab, setActiveTab] = useState('chart');

  return (
    <div>
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

      {activeTab === 'chart' ? <MovieGrid /> : <MovieGrid />}
    </div>
  );
};

export default MovieTabSection;
