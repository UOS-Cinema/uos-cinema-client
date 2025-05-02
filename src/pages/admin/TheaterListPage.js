import React from "react";
import styled from "styled-components";
import Navbar from "../../component/common/NavBar";
import { Link } from "react-router-dom";

// 샘플 데이터
const sampleTheaters = [
    {
        theaterId: 1,
        name: "C-Language",
        types: ["2D", "3D"],
    },
    {
        theaterId: 2,
        name: "C++",
        types: ["2D", "4D"],
    },
    {
        theaterId: 3,
        name: "Kotlin",
        types: ["2D"],
    },
    {
        theaterId: 4,
        name: "TS",
        types: ["2D", "3D"],
    },
    {
        theaterId: 5,
        name: "JS",
        types: ["2D", "4D"],
    },
    {
        theaterId: 6,
        name: "Python",
        types: ["2D"],
    },
    {
        theaterId: 7,
        name: "JAVA",
        types: ["2D", "4D"],
    },
    {
        theaterId: 8,
        name: "React",
        types: ["2D"],
    },
];

const TheaterListPage = () => {
    return (
        <Container>
            <Navbar underline={true} />
            <Title>상영관 목록</Title>
            <TheaterUL>
                {sampleTheaters.map((theater) => (
                    <TheaterLI key={theater.theaterId}>
                        <div>
                            <Info>상영관{theater.theaterId} ({theater.name} 상영관)</Info>
                            <Info>제공 유형: {theater.types.join(", ")}</Info>
                        </div>

                        <DetailLink to="/theaterDetail">
                            상세보기
                        </DetailLink>
                    </TheaterLI>
                ))}
            </TheaterUL>
        </Container>
    );
};

const Container = styled.div`

`;

const Title = styled.h2`
  margin-bottom: 20px;
  margin-left:40px;
`;

const TheaterUL = styled.ul`
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin: 0 20px;
`;

const TheaterLI = styled.li`
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 20px;
  margin:15px 20px;
    display: flex;
  justify-content: space-between; /* 내용과 버튼을 양쪽 끝에 배치 */
  align-items: center; /* 세로로 중앙 정렬 */
  background-color: #f9f9f9;
`;

const Info = styled.div`
  margin-bottom: 8px;
  font-size: 16px;
`;

const DetailLink = styled(Link)`
  padding: 8px 16px;
  text-decoration:none;
  background-color: #1D79F2;
  border: none;
  color: white;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0B2D59;
  }
`;


export default TheaterListPage;
