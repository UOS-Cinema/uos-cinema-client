import React, { useContext, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import Navbar from "../component/common/NavBar";
import { UserContext } from "../context/UserContext";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

// --- 목업 데이터 ---
const director = {
    name: "봉준호",
    profileImage: "https://search.pstatic.net/common?type=b&size=3000&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2F189%2F201710111116464471.jpg",
    filmography: [
        { id: 1, title: "기생충", year: 2019, role: "기택", poster: "https://search.pstatic.net/common?quality=75&direct=true&src=https%3A%2F%2Fmovie-phinf.pstatic.net%2F20190528_36%2F1559024198386YVTEw_JPEG%2Fmovie_image.jpg" },
        { id: 2, title: "변호인", year: 2013, role: "송우석", poster: 
          "https://search.pstatic.net/common?quality=75&direct=true&src=https%3A%2F%2Fmovie-phinf.pstatic.net%2F20190116_206%2F1547615429111dINWj_JPEG%2Fmovie_image.jpg" },
        { id: 3, title: "택시운전사", year: 2017, role: "김만섭", poster: "https://search.pstatic.net/common?quality=75&direct=true&src=https%3A%2F%2Fmovie-phinf.pstatic.net%2F20190528_36%2F1559024198386YVTEw_JPEG%2Fmovie_image.jpg" },
        { id: 4, title: "살인의 추억", year: 2003, role: "박두만", poster: "https://search.pstatic.net/common?quality=75&direct=true&src=https%3A%2F%2Fmovie-phinf.pstatic.net%2F20190528_36%2F1559024198386YVTEw_JPEG%2Fmovie_image.jpg" },
        { id: 5, title: "괴물", year: 2006, role: "박강두", poster: "https://search.pstatic.net/common?quality=75&direct=true&src=https%3A%2F%2Fmovie-phinf.pstatic.net%2F20190528_36%2F1559024198386YVTEw_JPEG%2Fmovie_image.jpg" },
        { id: 6, title: "설국열차", year: 2013, role: "남궁민수", poster: "https://search.pstatic.net/common?quality=75&direct=true&src=https%3A%2F%2Fmovie-phinf.pstatic.net%2F20190528_36%2F1559024198386YVTEw_JPEG%2Fmovie_image.jpg" },
        { id: 7, title: "사도", year: 2015, role: "영조", poster: "https://search.pstatic.net/common?quality=75&direct=true&src=https%3A%2F%2Fmovie-phinf.pstatic.net%2F20190528_36%2F1559024198386YVTEw_JPEG%2Fmovie_image.jpg" },
        { id: 8, title: "마약왕", year: 2018, role: "이두삼", poster: "https://search.pstatic.net/common?quality=75&direct=true&src=https%3A%2F%2Fmovie-phinf.pstatic.net%2F20190528_36%2F1559024198386YVTEw_JPEG%2Fmovie_image.jpg" },
    ]
};

const MockUserProvider = ({ children }) => {
    const [user, setUser] = useState({ role: 'admin' });
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
// --- 목업 데이터 끝 ---


const DirectorDetailPage = () => {
    const { user } = useContext(UserContext);
    // const { directorId } = useParams(); // 실제 구현 시 감독 ID를 URL 파라미터로 받음

    return (
        <>
            <GlobalStyle />
            <MockUserProvider>
                <Navbar underline={true} />
                <Container>
                    <LeftSection>
                        <ProfileImage src={director.profileImage} alt={director.name} />
                        <DirectorName>{director.name}</DirectorName>
                        {user.role === "admin" && (
                            <ActionButtons>
                                <EditButton to="/createDirector"><FaEdit /> 수정하기</EditButton>
                                <DeleteButton><FaTrashAlt /> 삭제하기</DeleteButton>
                            </ActionButtons>
                        )}
                    </LeftSection>
                    <RightSection>
                        <SectionTitle>필모그래피</SectionTitle>
                        <FilmographyGrid>
                            {director.filmography.map((film, index) => (
                                <FilmCard key={film.id} delay={index}>
                                     <PosterLink to={`/movie/${film.id}`}>
                                        <FilmPoster src={film.poster} alt={film.title} />
                                        <HoverOverlay>
                                            <DetailButton>
                                                상세보기
                                            </DetailButton>
                                        </HoverOverlay>
                                    </PosterLink>
                                    <FilmInfo>
                                        <FilmTitle>{film.title}</FilmTitle>
                                        <FilmYear>{film.year}</FilmYear>
                                    </FilmInfo>
                                </FilmCard>
                            ))}
                        </FilmographyGrid>
                    </RightSection>
                </Container>
            </MockUserProvider>
        </>
    );
};

export default DirectorDetailPage;

// --- STYLED COMPONENTS ---

const primaryBlue = '#1E6DFF';
const darkGray = '#212529';
const mediumGray = '#adb5bd';
const lightGray = '#f8f9fa';
const red = '#e03131';

const GlobalStyle = createGlobalStyle`
  body, html {
    background-color: ${lightGray};
    margin: 0;
    font-family: 'Noto Sans KR', sans-serif;
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  display: flex;
  gap: 50px;
  padding: 40px;
  max-width: 1400px;
  margin: 40px auto;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.06);
`;

const LeftSection = styled.div`
  flex-basis: 300px;
  flex-shrink: 0;
  text-align: center;
`;

const ProfileImage = styled.img`
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
`;

const DirectorName = styled.h2`
  margin-top: 20px;
  font-size: 28px;
  font-weight: 900;
  color: ${darkGray};
`;

const ActionButtons = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 10px;
`;

const ButtonBase = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex: 1;
  text-decoration: none;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const EditButton = styled(ButtonBase)`
  background-color: ${primaryBlue};
  color: white;
  &:hover { background-color: #0056b3; }
`;

const DeleteButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex: 1;
  text-decoration: none;
  border: 1px solid ${mediumGray};
  padding: 12px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: transparent;
  color: ${darkGray};
  
  &:hover {
    background-color: ${red};
    border-color: ${red};
    color: white;
  }
`;

const RightSection = styled.div`
  flex: 1;
  min-width: 0;
`;

const SectionTitle = styled.h3`
  font-size: 24px;
  font-weight: 900;
  margin: 0 0 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${mediumGray};
  color: ${darkGray};
`;

const FilmographyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 24px;
`;

const HoverOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
`;

const DetailButton = styled.div`
  padding: 10px 20px;
  border-radius: 6px;
  background-color: white;
  color: ${darkGray};
  font-size: 15px;
  font-weight: 700;
  text-align: center;
  width: 80%;
`;

const PosterLink = styled(Link)`
  display: block;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  
  &:hover ${HoverOverlay} {
    opacity: 1;
  }
`;

const FilmPoster = styled.img`
  width: 100%;
  height: 240px;
  object-fit: cover;
  display: block;
`;

const FilmInfo = styled.div`
  padding: 12px;
`;

const FilmCard = styled.div`
  text-decoration: none;
  color: black;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  background-color: #fff;
  opacity: 0;
  transform: translateY(20px);
  animation: ${slideUp} 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: ${props => props.delay * 0.07}s;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.15);
  }
`;

const FilmTitle = styled.div`
  font-weight: 700;
  font-size: 15px;
  color: ${darkGray};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FilmYear = styled.div`
  font-size: 13px;
  color: #868e96;
`;
