import styled from "styled-components";
import { movies } from "../../example_data/movies";
import { useState } from "react";
const TicketList = () => {
    const [subTab, setSubTab] = useState("upcoming");
    return (
        <div>
            <SubTabContainer>
                <SubTab
                    selected={subTab === "upcoming"}
                    onClick={() => setSubTab("upcoming")}
                >
                    상영예정 예매내역
                </SubTab>
                <SubTab
                    selected={subTab === "all"}
                    onClick={() => setSubTab("all")}
                >
                    전체 예매내역
                </SubTab>
            </SubTabContainer>

            <Container>
                {movies.map((movie) => (
                    <Ticket key={movie.id}>
                        <img src={movie.poster} alt={movie.title} />
                        <TicketInfo>
                            <h3>{movie.title}</h3>
                            <p>감독: {movie.director}</p>
                            <p>출연: {movie.actors}</p>
                            <p>관람등급: {movie.class || "정보 없음"}</p>
                            <p>개봉일: {movie.releaseDate || "정보 없음"}</p>
                        </TicketInfo>
                    </Ticket>
                ))}
            </Container>
        </div>
    )
}
export default TicketList;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Ticket = styled.div`
  display: flex;
  background: #fafafa;
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  img {
    width: 100px;
    height: 140px;
    object-fit: cover;
    border-radius: 4px;
    margin-right: 20px;
  }
`;

const TicketInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  h3 {
    margin: 0 0 10px;
  }

  p {
    margin: 2px 0;
    font-size: 14px;
    color: #333;
  }
`

const SubTabContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
`;

const SubTab = styled.button`
  padding: 10px 15px;
  font-size: 15px;
  background: ${({ selected }) => (selected ? "#333" : "#eee")};
  color: ${({ selected }) => (selected ? "#fff" : "#000")};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    background: #ccc;
  }
`;
