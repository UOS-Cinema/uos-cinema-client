import React from "react";
import styled from "styled-components";
import Navbar from "../../component/common/NavBar";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

// 샘플 데이터
const sampleTheaters = [
    { theaterId: 1, name: "C-Language", types: ["2D", "3D"] },
    { theaterId: 2, name: "C++", types: ["2D", "4D"] },
    { theaterId: 3, name: "Kotlin", types: ["2D"] },
    { theaterId: 4, name: "TS", types: ["2D", "3D"] },
    { theaterId: 5, name: "JS", types: ["2D", "4D"] },
    { theaterId: 6, name: "Python", types: ["2D"] },
    { theaterId: 7, name: "JAVA", types: ["2D", "4D"] },
    { theaterId: 8, name: "React", types: ["2D"] },
];

const TheaterListPage = () => {
    return (
        <PageWrapper>
            <Navbar underline={true} />
            <Container>
                <Header>
                    <Title>상영관 관리</Title>
                    <AddButton to="/theater/create">
                        <FaPlus /> 상영관 등록
                    </AddButton>
                </Header>
                <TheaterGrid>
                    {sampleTheaters.map((theater) => (
                        <TheaterCard key={theater.theaterId}>
                            <div>
                                <TheaterName>상영관{theater.theaterId} ({theater.name}관)</TheaterName>
                                <TypeInfo>제공 유형: {theater.types.join(", ")}</TypeInfo>
                            </div>
                            <DetailLink to={`/theaterDetail/${theater.theaterId}`}>상세보기</DetailLink>
                            {/* <DetailLink to={`/theaterDetail/${theater.theaterId}`}>상세보기</DetailLink> */}
                        </TheaterCard>
                    ))}
                </TheaterGrid>
            </Container>
        </PageWrapper>
    );
};

export default TheaterListPage;

// --- STYLED COMPONENTS ---
const primaryBlue = '#1E6DFF';
const darkGray = '#343a40';
const mediumGray = '#dee2e6';
const lightGray = '#f8f9fa';

const PageWrapper = styled.div`
  background-color: ${lightGray};
  min-height: 100vh;
`;

const Container = styled.div`
  width: 85%;
  max-width: 1400px;
  margin: 40px auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 900;
  color: ${darkGray};
`;

const AddButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: ${primaryBlue};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(30, 109, 255, 0.3);
  }
`;

const TheaterGrid = styled.div`
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
`;

const TheaterCard = styled.div`
  border: 1px solid ${mediumGray};
  border-radius: 12px;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  
  &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  }
`;

const TheaterName = styled.h3`
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 700;
  color: ${darkGray};
`;

const TypeInfo = styled.p`
  margin: 0;
  font-size: 15px;
  color: #868e96;
`;

const DetailLink = styled(Link)`
  padding: 8px 18px;
  text-decoration: none;
  background-color: ${primaryBlue};
  color: white;
  font-weight: 700;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`;
