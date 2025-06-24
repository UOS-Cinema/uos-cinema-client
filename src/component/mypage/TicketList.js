import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { UserContext } from "../../context/UserContext";

const TicketList = () => {
    const { user } = useContext(UserContext);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchReservationHistory();
    }, [currentPage]);

    const fetchReservationHistory = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/customers/reservations?page=${currentPage}&size=10`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Reservation response:', data); // 디버깅용
            
            setReservations(data.data.content);
            setTotalPages(data.data.totalPages);
        } catch (err) {
            setError(err.message || '예매내역을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelReservation = async (reservationId) => {
        if (!window.confirm('예매를 취소하시겠습니까?')) return;
        
        try {
            const response = await fetch(`/reservations/${reservationId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '예매 취소에 실패했습니다.');
            }
            
            alert('예매가 취소되었습니다.');
            fetchReservationHistory(); // 목록 새로고침
        } catch (err) {
            alert('예매 취소에 실패했습니다: ' + err.message);
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '-';
            return `${date.toLocaleDateString('ko-KR')} ${date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`;
        } catch {
            return '-';
        }
    };

    const isUpcoming = (screeningDate) => {
        if (!screeningDate) return false;
        try {
            const date = new Date(screeningDate);
            return !isNaN(date.getTime()) && date > new Date();
        } catch {
            return false;
        }
    };

    if (loading) return <LoadingWrapper>로딩 중...</LoadingWrapper>;
    if (error) return <ErrorWrapper>오류: {error}</ErrorWrapper>;

    return (
        <Wrapper>
            <Header>
                <Title>MY 티켓</Title>
            </Header>

            <ListContainer>
                {reservations.length === 0 ? (
                    <EmptyState>
                        예매내역이 없습니다.
                    </EmptyState>
                ) : (
                    reservations.map((reservation) => (
                        <Ticket key={reservation.reservationId}>
                            <TicketInfo>
                                <TicketHeader>
                                    <h3>{reservation.screening?.movieTitle || '영화 제목 없음'}</h3>
                                    {isUpcoming(reservation.screening?.startTime) && reservation.status === 'CONFIRMED' && (
                                        <CancelButton onClick={() => handleCancelReservation(reservation.reservationId)}>
                                            예매취소
                                        </CancelButton>
                                    )}
                                </TicketHeader>
                                <InfoGrid>
                                    <span>관람등급</span> <p>전체관람가</p>
                                    <span>상영관</span> <p>{reservation.screening?.theaterName}({reservation.screening?.screenType}) - {reservation.seatNumbers?.join(', ')}</p>
                                    <span>예매상태</span> <p>{getStatusText(reservation.status)}</p>
                                </InfoGrid>
                            </TicketInfo>
                        </Ticket>
                    ))
                )}
            </ListContainer>
            
            {totalPages > 1 && (
                <PaginationWrapper>
                    <PaginationButton 
                        onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                        disabled={currentPage === 0}
                    >
                        이전
                    </PaginationButton>
                    <PageInfo>{currentPage + 1} / {totalPages}</PageInfo>
                    <PaginationButton 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                        disabled={currentPage === totalPages - 1}
                    >
                        다음
                    </PaginationButton>
                </PaginationWrapper>
            )}
        </Wrapper>
    )
}

const getStatusText = (status) => {
    switch (status) {
        case 'CONFIRMED': return '예매완료';
        case 'CANCELLED': return '예매취소';
        case 'PENDING': return '예매대기';
        case 'COMPLETED': return '예매완료';
        default: return status || '알 수 없음';
    }
};

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

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Ticket = styled.div`
  display: flex;
  gap: 24px;
  background: #fff;
  border: 1px solid ${mediumGray};
  padding: 24px;
  border-radius: 12px;
`;

const TicketInfo = styled.div`
  flex: 1;
`;

const TicketHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  
  h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: ${darkGray};
  }
`;

const CancelButton = styled.button`
  padding: 8px 16px;
  background: #e03131;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  &:hover {
    background: #c92a2a;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 10px;
  
  span {
    font-weight: 500;
    color: ${textGray};
    font-size: 14px;
  }
  p {
    margin: 0;
    font-size: 15px;
    color: ${darkGray};
  }
`;

const LoadingWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    font-size: 18px;
    color: ${textGray};
`;

const ErrorWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    font-size: 18px;
    color: #e03131;
`;

const EmptyState = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    font-size: 18px;
    color: ${textGray};
`;

const PaginationWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    margin-top: 32px;
`;

const PaginationButton = styled.button`
    padding: 8px 16px;
    background: ${({ disabled }) => disabled ? mediumGray : primaryBlue};
    color: ${({ disabled }) => disabled ? textGray : 'white'};
    border: none;
    border-radius: 6px;
    cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
    font-weight: 600;
`;

const PageInfo = styled.span`
    font-weight: 600;
    color: ${darkGray};
`;
