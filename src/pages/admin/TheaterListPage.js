import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Navbar from "../../component/common/NavBar";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

const TheaterListPage = () => {
    // --- 상태 관리 ---
    // API로부터 받은 상영관 목록을 저장할 상태
    const [theaters, setTheaters] = useState([]); 
    // 데이터 로딩 상태
    const [loading, setLoading] = useState(true); 
    // 에러 상태
    const [error, setError] = useState(null); 

    // --- 데이터 페칭 ---
    useEffect(() => {
        const fetchTheaters = async () => {
            try {
                // API 요청 시작: 에러/로딩 상태 초기화
                setError(null);
                setLoading(true);

                const response = await fetch('/theaters');
                if (!response.ok) {
                    throw new Error('상영관 정보를 불러오는 데 실패했습니다.');
                }
                const responseData = await response.json();
                
                // 목업 데이터 구조에 맞게 responseData.data 사용
                setTheaters(responseData.data); 

            } catch (e) {
                setError(e.message);
                console.error("Failed to fetch theaters:", e);
            } finally {
                // API 요청 종료: 로딩 상태 false로 변경
                setLoading(false); 
            }
        };

        fetchTheaters();
    }, []); // 빈 배열을 의존성으로 전달하여 컴포넌트 마운트 시 1회만 실행

    // --- 렌더링 로직 ---
    const renderContent = () => {
        if (loading) {
            return <StatusText>로딩 중...</StatusText>;
        }
        if (error) {
            return <StatusText>오류: {error}</StatusText>;
        }
        if (theaters.length === 0) {
            return <StatusText>등록된 상영관이 없습니다.</StatusText>;
        }
        return (
            <TheaterGrid>
                {/* API로부터 받은 theaters 배열을 매핑 */}
                {theaters.map((theater) => (
                    // API 응답의 'number'를 key로 사용
                    <TheaterCard key={theater.number}>
                        <div>
                             {/* API 응답의 'number'와 'name'을 사용 */}
                            <TheaterName>상영관{theater.number} ({theater.name})</TheaterName>
                            {/* API 응답의 'screenTypes'를 사용 */}
                            <TypeInfo>제공 유형: {theater.screenTypes.join(", ")}</TypeInfo>
                        </div>
                         {/* API 응답의 'number'를 상세 페이지 링크에 사용 */}
                        <DetailLink to={`/theaterDetail/${theater.number}`}>상세보기</DetailLink>
                    </TheaterCard>
                ))}
            </TheaterGrid>
        );
    };

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
                {renderContent()}
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

// 로딩 및 에러 메시지를 위한 스타일 컴포넌트 추가
const StatusText = styled.div`
    text-align: center;
    font-size: 18px;
    color: #868e96;
    padding: 50px;
`;