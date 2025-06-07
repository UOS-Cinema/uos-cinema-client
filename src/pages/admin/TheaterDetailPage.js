import React from "react";
import Navbar from "../../component/common/NavBar";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FaPencilAlt } from "react-icons/fa";

const sampleTheater = {
    theaterId: 1,
    name: "C-Language",
    types: ["2D", "3D"],
}
const seatStandard = [
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

const TheaterDetailPage = () => {
    return (
        <PageWrapper>
            <Navbar underline={true} />
            <Container>
                <InfoHeader>
                    <div>
                        <Title>상영관{sampleTheater.theaterId} ({sampleTheater.name}관)</Title>
                        <Info>제공 유형: {sampleTheater.types.join(", ")}</Info>
                    </div>
                    <EditLink to={`/theaterEdit`}><FaPencilAlt /> 수정하기</EditLink>
                    {/* <EditLink to={`/theaterEdit/${sampleTheater.theaterId}`}><FaPencilAlt /> 수정하기</EditLink> */}
                </InfoHeader>

                <SeatMapContainer>
                    <Screen>SCREEN</Screen>
                    <SeatContainer>
                        {seatStandard.map((row, y) => {
                            let seatNumber = 1;
                            return (
                                <SeatRow key={y}>
                                    <RowLabel>{String.fromCharCode(65 + y)}</RowLabel>
                                    {row.map((seat, x) => (
                                        <SeatBox key={x} isAvailable={seat === 1}>
                                            {seat === 1 && <SeatNumber>{seatNumber++}</SeatNumber>}
                                        </SeatBox>
                                    ))}
                                </SeatRow>
                            );
                        })}
                    </SeatContainer>
                </SeatMapContainer>
            </Container>
        </PageWrapper>
    )
}

export default TheaterDetailPage;

// --- STYLED COMPONENTS ---
const primaryBlue = '#1E6DFF';
const darkGray = '#343a40';
const mediumGray = '#dee2e6';
const lightGray = '#f8f9fa';
const screenGray = '#495057';

const PageWrapper = styled.div`
  background-color: ${lightGray};
  min-height: 100vh;
`;

const Container = styled.div`
  width: 85%;
  max-width: 1200px;
  margin: 40px auto;
  background-color: #fff;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.07);
`;

const InfoHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 24px;
    border-bottom: 1px solid ${mediumGray};
    margin-bottom: 40px;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 900;
  color: ${darkGray};
  margin: 0;
`;

const Info = styled.p`
  margin: 8px 0 0;
  font-size: 16px;
  color: #868e96;
`;

const EditLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  text-decoration:none;
  background-color: ${primaryBlue};
  border: none;
  color: white;
  font-weight: 700;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }
`;

const SeatMapContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Screen = styled.div`
  width: 100%;
  max-width: 800px;
  margin-bottom: 40px;
  padding: 12px 0;
  background: ${screenGray};
  color: #fff;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 5px;
  border-radius: 6px;
`;

const SeatContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SeatRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const RowLabel = styled.div`
  width: 30px;
  text-align: center;
  font-size: 15px;
  font-weight: 700;
  color: #adb5bd;
`;

const SeatBox = styled.div`
  width: 32px;
  height: 28px;
  border-radius: 6px 6px 2px 2px;
  background-color: ${({isAvailable}) => isAvailable ? mediumGray : 'transparent'};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SeatNumber = styled.span`
  font-size: 12px;
  color: ${darkGray};
`;
