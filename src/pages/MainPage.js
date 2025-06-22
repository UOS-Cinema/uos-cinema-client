import React from 'react';
import styled from 'styled-components';
import Navbar from "../component/common/NavBar";
import MovieTabSection from "../component/mainpage/MovieTapSection";
import TopReservationBanner from "../component/mainpage/TopReservationBanner";
// UserContext는 필요 시 주석을 해제하여 사용하세요.
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { GenreContext } from '../context/GenreContext';

const MainPageContainer = styled.div`
  background-color: #f8f9fa; /* 전체 페이지 배경색 */
`;

const MainContent = styled.main`
  width: 85%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 0;
`;

const MainPage = () => {
    const { user } = useContext(UserContext); // 필요 시 사용
    console.log(user);
    return (
        <MainPageContainer>
            <Navbar underline={true} />
            <MainContent>
                <TopReservationBanner />
                <MovieTabSection />
            </MainContent>
        </MainPageContainer>
    );
};

export default MainPage;
