import React, { useContext } from "react";
import styled from "styled-components";
import Navbar from "../component/common/NavBar";
import directorImg from "../asset/director.jpg";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
// 예시 데이터
const director = {
    name: "봉준호",
    profileImage: "https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png",
    filmography: [
        { title: "기생충", year: 2019, poster: "https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png" },
        { title: "살인의 추억", year: 2003, poster: "https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png" },
        { title: "마더", year: 2009, poster: "https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png" },
    ],
};

const DirectorDetailPage = () => {
    const { user } = useContext(UserContext);
    return (
        <div>
            <Navbar underline={true} />
            <Container>
                <LeftSection>
                    <ProfileImage src={directorImg} alt={director.name} />
                    <DirectorName>{director.name}</DirectorName>
                </LeftSection>
                <RightSection>
                    <SectionTitle>필모그래피</SectionTitle>
                    <FilmographyGrid>
                        {director.filmography.map((film, index) => (
                            <FilmCard key={index} to="/movie/1">
                                <FilmPoster src={film.poster} alt={film.title} />
                                <FilmInfo>
                                    <FilmTitle>{film.title}</FilmTitle>
                                    <FilmYear>{film.year}</FilmYear>
                                </FilmInfo>
                            </FilmCard>
                        ))}
                    </FilmographyGrid>
                </RightSection>
                {user.role === "admin" &&
                    <ActionButtons>
                        <EditButton to="/createDirector">수정하기</EditButton>
                        <DeleteButton >삭제하기</DeleteButton>
                    </ActionButtons>}
            </Container>
        </div>
    );
};

export default DirectorDetailPage;



const ActionButtons = styled.div`
  margin-top: 10px;
`;

const EditButton = styled(Link)`
    text-decoration:none;
  background-color: #1E6DFF;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  
  &:hover {
    background-color: #1D79F2;
  }
`;

const DeleteButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #e53935;
  }
`;
const Container = styled.div`
  display: flex;
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
`;

const LeftSection = styled.div`
  flex: 1;
  max-width: 300px;
  text-align: center;
`;

const ProfileImage = styled.img`
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
`;

const DirectorName = styled.h2`
  margin-top: 20px;
  font-size: 24px;
  color: #333;
`;

const RightSection = styled.div`
  flex: 2;
  padding-left: 40px;
`;

const SectionTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 20px;
  color: #1e6dff;
`;

const FilmographyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 20px;
`;

const FilmCard = styled(Link)`
    text-decoration:none;
    color:black;
  background: #f9f9f9;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
`;

const FilmPoster = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 6px;
`;

const FilmInfo = styled.div`
  margin-top: 10px;
`;

const FilmTitle = styled.div`
  font-weight: bold;
  color: #333;
`;

const FilmYear = styled.div`
  font-size: 14px;
  color: #777;
`;
