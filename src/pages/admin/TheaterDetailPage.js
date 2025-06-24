import React, { useState, useEffect, useContext } from "react";
import Navbar from "../../component/common/NavBar";
import styled from "styled-components";
import { Link, useParams } from "react-router-dom";
import { FaPencilAlt } from "react-icons/fa";
import { UserContext } from "../../context/UserContext";

const TheaterDetailPage = () => {
  const { id } = useParams();
  const {user} = useContext(UserContext);
  const [theater, setTheater] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTheaterData = async () => {
      if (!id) {
        setError("상영관 ID가 유효하지 않습니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/theaters/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                // accessToken이 있을 경우에만 Authorization 헤더를 추가합니다.
                ...(user.accessToken && { 'Authorization': `Bearer ${user.accessToken}` })
            }
        });
        if (!response.ok) {
          throw new Error('상영관 정보를 불러오는 데 실패했습니다.');
        }
        const responseData = await response.json();
        // API 응답이 { data: { ... } } 형태로 온다고 가정
        setTheater(responseData.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTheaterData();
  }, [id]); // id가 변경될 때마다 데이터를 다시 불러옵니다.

  if (loading) {
    return (
      <PageWrapper>
        <Navbar underline={true} />
        <StatusContainer>로딩 중...</StatusContainer>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <Navbar underline={true} />
        <StatusContainer error>{error}</StatusContainer>
      </PageWrapper>
    );
  }

  if (!theater) {
    return (
      <PageWrapper>
        <Navbar underline={true} />
        <StatusContainer>상영관 정보를 찾을 수 없습니다.</StatusContainer>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Navbar underline={true} />
      <Container>
        <InfoHeader>
          <div>
            <Title>상영관{theater.number} ({theater.name})</Title>
            <Info>제공 유형: {theater.screenTypes.join(", ")}</Info>
          </div>
          <EditLink to={`/theaterEdit/${theater.number}`}><FaPencilAlt /> 수정하기</EditLink>
        </InfoHeader>

        <SeatMapContainer>
          <Screen>SCREEN</Screen>
          <SeatContainer>
            {/* API로 받은 seatStandard 데이터를 사용합니다. */}
            {theater.layout.map((row, y) => {
              let seatNumber = 1;
              return (
                <SeatRow key={y}>
                  <RowLabel>{String.fromCharCode(65 + y)}</RowLabel>
                  {row.map((seatType, x) => (
                    // seatType이 "SEAT"일 경우에만 좌석으로 처리합니다.
                    <SeatBox key={x} isSeat={seatType === "SEAT"}>
                      {seatType === "SEAT" && <SeatNumber>{seatNumber++}</SeatNumber>}
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

const StatusContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  font-size: 24px;
  color: ${props => props.error ? '#e03131' : '#868e96'};
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
  /* isAvailable 대신 isSeat 프롭 사용 */
  background-color: ${({ isSeat }) => isSeat ? mediumGray : 'transparent'};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SeatNumber = styled.span`
  font-size: 12px;
  color: ${darkGray};
`;