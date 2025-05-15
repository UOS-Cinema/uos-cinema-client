import React, { useContext } from "react";
import styled from "styled-components";
import Navbar from "../component/common/NavBar";
import actor1 from "../asset/actor1.jpg";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
// 예시 데이터: 송강호
const actor = {
    name: "송강호",
    profileImage: "https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png",
    filmography: [
        { title: "기생충", year: 2019, role: "기택", poster: "https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png" },
        { title: "변호인", year: 2013, role: "송우석", poster: "https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png" },
        { title: "택시운전사", year: 2017, role: "김만섭", poster: "https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png" },
        { title: "살인의 추억", year: 2003, role: "박두만", poster: "https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png" },
        { title: "괴물", year: 2006, role: "박강두", poster: "https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png" },
        { title: "밀양", year: 2007, role: "종찬", poster: "https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png" },
        { title: "박쥐", year: 2009, role: "상현", poster: "https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png" },
        { title: "설국열차", year: 2013, role: "남궁민수", poster: "https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png" },
        { title: "사도", year: 2015, role: "영조", poster: "https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png" },
        { title: "마약왕", year: 2018, role: "이두삼", poster: "https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png" },
        { title: "비상선언", year: 2021, role: "인호", poster: "https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png" },
        { title: "브로커", year: 2022, role: "상현", poster: "https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png" },
        { title: "천문", year: 2019, role: "장영실", poster: "https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png" },
        { title: "좋은 놈, 나쁜 놈, 이상한 놈", year: 2008, role: "이상한 놈", poster: "https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png" }
    ]
};



const ActorDetailPage = () => {
    const { user } = useContext(UserContext);
    return (
        <div>
            <Navbar underline={true} />
            <Container>
                <LeftSection>
                    <ProfileImage src={actor1} alt={actor.name} />
                    <ActorName>{actor.name}</ActorName>
                </LeftSection>
                <RightSection>
                    <SectionTitle>필모그래피</SectionTitle>
                    <FilmographyGrid>
                        {actor.filmography.map((film, index) => (
                            <FilmCard key={index} to="/movie/1">
                                <FilmPoster src={film.poster} alt={film.title} />
                                <FilmInfo>
                                    <FilmTitle>{film.title}</FilmTitle>
                                    <FilmYear>{film.year}년</FilmYear>
                                    <FilmRole>{film.role} 역</FilmRole>
                                </FilmInfo>
                            </FilmCard>
                        ))}
                    </FilmographyGrid>
                </RightSection>
                {user.role === "admin" &&
                    <ActionButtons>
                    <EditButton to="/createActor">수정하기</EditButton>
                    <DeleteButton >삭제하기</DeleteButton>
                  </ActionButtons>}
            </Container>
        </div>
    );
};

export default ActorDetailPage;

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

const ActorName = styled.h2`
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
  margin-top:0;
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

const FilmRole = styled.div`
  font-size: 14px;
  color: #555;
  margin-top: 4px;
`;
