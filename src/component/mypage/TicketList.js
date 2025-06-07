import React, { useState } from "react";
import styled from "styled-components";
// import { movies } from "../../example_data/movies"; // 실제 데이터 경로 확인

// --- 목업 데이터 ---
const movies = [
    {id: 1, title: '기생충', poster: 'https://search.pstatic.net/common?quality=75&direct=true&src=https%3A%2F%2Fmovie-phinf.pstatic.net%2F20190528_36%2F1559024198386YVTEw_JPEG%2Fmovie_image.jpg', reservation_rate: 17.5, director: '봉준호', actors: '송강호, 이선균, 조여정', genres: ['드라마', '스릴러'], screen_types: ['2D'], release_date: '2019-05-30'},
    {id: 2, title: '올드보이', poster: 'https://search.pstatic.net/common?quality=75&direct=true&src=https%3A%2F%2Fmovie-phinf.pstatic.net%2F20111222_177%2F1324537084439rmrVk_JPEG%2Fmovie_image.jpg', reservation_rate: 14.6, director: '박찬욱', actors: '최민식, 유지태, 강혜정', genres: ['스릴러', '액션'], screen_types: ['2D', 'IMAX'], release_date: '2003-11-21'},
    {id: 3, title: '부산행', poster: 'https://search.pstatic.net/common?quality=75&direct=true&src=https%3A%2F%2Fmovie-phinf.pstatic.net%2F20200612_248%2F1591937633750Vvyr6_JPEG%2Fmovie_image.jpg', reservation_rate: 12.1, director: '연상호', actors: '공유, 정유미, 마동석', genres: ['액션', '공포'], screen_types: ['2D', '4DX'], release_date: '2016-07-20'},
    {id: 4, title: '극한직업', poster: 'https://search.pstatic.net/common?quality=75&direct=true&src=https%3A%2F%2Fmovie-phinf.pstatic.net%2F20190116_206%2F1547615429111dINWj_JPEG%2Fmovie_image.jpg', reservation_rate: 18.2, director: '이병헌', actors: '류승룡, 이하늬, 진선규', genres: ['코미디', '액션'], screen_types: ['2D'], release_date: '2019-01-23'},
    {id: 5, title: '헤어질 결심', poster: 'https://search.pstatic.net/common?quality=75&direct=true&src=https%3A%2F%2Fmovie-phinf.pstatic.net%2F20220607_129%2F16545872892918GA4h_JPEG%2Fmovie_image.jpg', reservation_rate: 9.8, director: '박찬욱', actors: '박해일, 탕웨이', genres: ['로맨스', '드라마'], screen_types: ['2D'], release_date: '2022-06-29'},
];
// --- 목업 데이터 끝 ---

const TicketList = () => {
    const [subTab, setSubTab] = useState("upcoming");
    return (
        <Wrapper>
            <Header>
                <Title>MY 티켓</Title>
                <SubTabContainer>
                    <SubTab selected={subTab === "upcoming"} onClick={() => setSubTab("upcoming")}>
                        상영예정 예매내역
                    </SubTab>
                    <SubTab selected={subTab === "all"} onClick={() => setSubTab("all")}>
                        전체 예매내역
                    </SubTab>
                </SubTabContainer>
            </Header>

            <ListContainer>
                {movies.map((movie) => (
                    <Ticket key={movie.id}>
                        <Poster src={movie.poster} alt={movie.title} />
                        <TicketInfo>
                            <h3>{movie.title}</h3>
                            <InfoGrid>
                                <span>관람등급</span> <p>{movie.class || "정보 없음"}</p>
                                <span>상영관</span> <p>상영관1(2D)-E11, E12(성인1, 청소년1)</p>
                                <span>상영시간</span> <p>13:30 ~ 15:25</p>
                                <span>예매완료</span> <p>2019.06.15 17:30</p>
                            </InfoGrid>
                        </TicketInfo>
                    </Ticket>
                ))}
            </ListContainer>
        </Wrapper>
    )
}
export default TicketList;

// --- STYLED COMPONENTS ---

const primaryBlue = '#1E6DFF';
const mediumGray = '#dee2e6';
const darkGray = '#343a40';
const textGray = '#868e96';

const Wrapper = styled.div`
    width: 100%;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid ${mediumGray};
    padding-bottom: 20px;
    margin-bottom: 30px;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 900;
  color: ${darkGray};
  margin: 0;
`;

const SubTabContainer = styled.div`
  display: flex;
  gap: 10px;
  background-color: #f1f3f5;
  border-radius: 8px;
  padding: 6px;
`;

const SubTab = styled.button`
  padding: 10px 20px;
  font-size: 15px;
  font-weight: 700;
  background: ${({ selected }) => (selected ? "#fff" : "transparent")};
  color: ${({ selected }) => (selected ? primaryBlue : textGray)};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${({ selected }) => (selected ? "0 2px 4px rgba(0,0,0,0.1)" : "none")};
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Ticket = styled.div`
  display: flex;
  background: #fff;
  border: 1px solid ${mediumGray};
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  gap: 24px;
`;

const Poster = styled.img`
  width: 120px;
  height: 170px;
  object-fit: cover;
  border-radius: 8px;
`;

const TicketInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  h3 {
    margin: 0 0 16px;
    font-size: 22px;
    font-weight: 700;
  }
`;

const InfoGrid = styled.div`
    display: grid;
    grid-template-columns: 80px 1fr;
    gap: 8px 12px;
    
    span {
        font-weight: 500;
        color: ${textGray};
    }
    p {
        margin: 0;
        font-size: 15px;
        color: ${darkGray};
    }
`;
