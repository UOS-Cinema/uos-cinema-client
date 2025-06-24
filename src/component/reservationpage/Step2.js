import React, { useState, useMemo, useEffect, useContext } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import { UserContext } from '../../context/UserContext';
import { useReservationState, useReservationDispatch } from '../../context/ReservationContext';
import { useCustomerTypes } from '../../context/CustomerTypeContext';
import { useScreenTypes } from '../../context/ScreenTypeContext';

// 고객 유형 영문 -> 한글 변환 헬퍼
const translateCustomerType = (type) => {
    switch (type) {
        case 'ADULT': return '성인';
        case 'TEEN': return '청소년';
        case 'CHILD': return '어린이';
        case 'SENIOR': return '경로';
        case 'ELDERLY': return '경로';
        case 'DISCOUNTED': return '우대';
        default: return type;
    }
};

// 인원 선택 컴포넌트
const PersonCounter = ({ label, count, onIncrease, onDecrease, isIncreaseDisabled, disabled }) => (
    <SelectItem>
        <Label>{label}</Label>
        <Counter>
            <CounterButton onClick={onDecrease} disabled={count <= 0 || disabled}><FaMinus /></CounterButton>
            <Number>{count}</Number>
            <CounterButton onClick={onIncrease} disabled={isIncreaseDisabled || disabled}><FaPlus /></CounterButton>
        </Counter>
    </SelectItem>
);

const Step2 = () => {
    const { user } = useContext(UserContext);
    const { selectedScreening, screenType, counts, selectedSeats } = useReservationState();
    const dispatch = useReservationDispatch();
    const { customerTypes, loading: customerTypesLoading } = useCustomerTypes();
    const { screenTypes, loading: screenTypesLoading } = useScreenTypes();
    
    const screeningId = selectedScreening?.id;
    const [seatLayout, setSeatLayout] = useState([]);
    const [screeningDetails, setScreeningDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 사용 가능한 좌석 수를 계산하는 함수
    const calculateAvailableSeats = (layout) => {
        if (!layout || !Array.isArray(layout)) return 0;
        return layout.flat().filter(seat => seat === 'SEAT').length;
    };

    useEffect(() => {
        if (!screeningId) {
            setError("상영 정보가 올바르지 않습니다.");
            setLoading(false);
            return;
        }
        const fetchScreeningDetails = async () => {
            setLoading(true);
            setError(null);

            if (!user || !user.accessToken) {
                setError("좌석 정보를 보려면 로그인이 필요합니다.");
                setLoading(false);
                return;
            }

            try {
                // --- !! 수정된 부분: API 엔드포인트 변경 !! ---
                const response = await fetch(`/screenings/${screeningId}/reservations`, {
                    headers: { 'Authorization': `Bearer ${user.accessToken}` },
                });
                if (!response.ok) throw new Error("좌석 정보를 불러오는 데 실패했습니다.");
                
                const responseData = await response.json();
                console.log(responseData.data);
                // API는 좌석 레이아웃을 직접 반환합니다
                setSeatLayout(responseData.data || []);
                // 스크리닝 상세 정보는 별도 API에서 가져와야 할 수 있습니다
                setScreeningDetails({ 
                    seatingStatus: responseData.data || [],
                    availableSeats: calculateAvailableSeats(responseData.data || [])
                });
            } catch (err) {
                setError(err.message);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchScreeningDetails();
    }, [screeningId, user]);

    const totalPrice = useMemo(() => {
        const screenTypeData = screenTypes.find(st => st.type === screenType);
        const basePrice = screenTypeData?.price || 0;
        
        if (basePrice === 0 || !customerTypes || customerTypes.length === 0) return 0;

        return Object.entries(counts).reduce((sum, [type, count]) => {
            const customerTypeData = customerTypes.find(ct => ct.type === type);
            const discountAmount = customerTypeData?.discountAmount || 0;
            
            const finalPricePerTicket = basePrice - discountAmount;
            return sum + (finalPricePerTicket * count);
        }, 0);
    }, [counts, screenType, screenTypes, customerTypes]);

    const totalPeople = useMemo(() => Object.values(counts).reduce((sum, count) => sum + count, 0), [counts]);
    
    const maxSelectable = useMemo(() => {
        if (!screeningDetails) return 8; 
        return Math.min(8, screeningDetails.availableSeats);
    }, [screeningDetails]);
    
    const handleCountChange = (type, delta) => {
        if (delta > 0 && !loading && totalPeople >= maxSelectable) {
            alert(`최대 ${maxSelectable}명까지 선택할 수 있습니다. (잔여 좌석: ${screeningDetails.availableSeats}석)`);
            return;
        }
        const newCount = (counts[type] || 0) + delta;
        if (newCount >= 0) {
            const newCounts = { ...counts, [type]: newCount };
            dispatch({ type: 'SET_COUNTS', payload: newCounts });
        }
    };
    
    const handleSeatClick = (seatId, seatType) => {
        if (seatType !== 'SEAT') return;
        
        const isSelected = selectedSeats.includes(seatId);

        if (isSelected) {
            const newSeats = selectedSeats.filter(id => id !== seatId);
            dispatch({ type: 'SET_SEATS', payload: newSeats });
        } else {
            if (selectedSeats.length < totalPeople) {
                const newSeats = [...selectedSeats, seatId];
                dispatch({ type: 'SET_SEATS', payload: newSeats });
            } else {
                alert('선택한 인원수만큼 좌석을 선택할 수 있습니다.');
            }
        }
    };

    const globalLoading = loading || customerTypesLoading || screenTypesLoading;

    if (error) return <StatusText>{error}</StatusText>;
    if (globalLoading && !screeningDetails) return <StatusText>예매 정보를 불러오는 중...</StatusText>;

    const isIncreaseDisabled = totalPeople >= maxSelectable;

    return (
        <Container>
            <TopSection>
                {customerTypes.map(customer => (
                    <PersonCounter 
                        key={customer.type}
                        label={translateCustomerType(customer.type)}
                        count={counts[customer.type] || 0}
                        onIncrease={() => handleCountChange(customer.type, 1)}
                        onDecrease={() => handleCountChange(customer.type, -1)}
                        isIncreaseDisabled={isIncreaseDisabled}
                        disabled={globalLoading}
                    />
                ))}
                
                <PriceContainer>
                    <PriceLabel>총 금액</PriceLabel>
                    <TotalPrice>{totalPrice.toLocaleString()}원</TotalPrice>
                </PriceContainer>
            </TopSection>
            
            <BottomSection>
                {loading ? (
                    <StatusText>좌석 정보를 불러오는 중...</StatusText>
                ) : (
                    <>
                        <Screen>SCREEN</Screen>
                        <SeatSelectionArea>
                            <SeatContainer>
                                {seatLayout && Array.isArray(seatLayout) && seatLayout.map((row, y) => {
                                    let seatNumber = 1;
                                    return (
                                        <SeatRow key={y}>
                                            <RowLabel>{String.fromCharCode(65 + y)}</RowLabel>
                                            {row.map((seatType, x) => {
                                                if (seatType === "AISLE" || seatType === "NONE") {
                                                    return <Aisle key={`${y}-${x}`} />;
                                                }
                                                const seatId = `${String.fromCharCode(65 + y)}${seatNumber}`;
                                                const isSelected = selectedSeats.includes(seatId);
                                                const isDisabled = seatType !== 'SEAT';
                                                const currentSeatNumber = seatNumber++;

                                                return (
                                                    <SeatBox key={seatId} isSelected={isSelected} disabled={isDisabled} onClick={() => handleSeatClick(seatId, seatType)}>
                                                        <SeatNumber isSelected={isSelected}>{currentSeatNumber}</SeatNumber>
                                                    </SeatBox>
                                                );
                                            })}
                                        </SeatRow>
                                    );
                                })}
                            </SeatContainer>
                        </SeatSelectionArea>
                    </>
                )}
            </BottomSection>
        </Container>
    );
};

export default Step2;

// --- STYLED COMPONENTS ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #f8f9fa;
  animation: ${fadeIn} 0.6s ease-out;
`;
const StatusText = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    font-size: 20px;
    color: #868e96;
`;
const TopSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #fff;
  border-bottom: 1px solid #e9ecef;
  flex-wrap: wrap;
  gap: 20px;
`;
const SelectItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  background: white;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
`;
const Label = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #333;
  min-width: 50px;
`;
const Counter = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    background: #f8f9fa;
    border-radius: 20px;
    padding: 2px;
`;
const CounterButton = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background-color: white;
  color: #1E6DFF;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
  &:hover:not(:disabled) {
    background-color: #1E6DFF;
    color: white;
  }
  &:disabled {
    background-color: #e9ecef;
    color: #adb5bd;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;
const Number = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #333;
  min-width: 25px;
  text-align: center;
`;
const PriceContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: 20px;
    padding-left: 30px;
    border-left: 2px solid #e9ecef;
`;
const PriceLabel = styled.span`
    font-size: 16px;
    font-weight: 500;
    color: #555;
`;
const TotalPrice = styled.div`
  font-size: 24px;
  font-weight: 900;
  color: #1E6DFF;
`;
const BottomSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
  min-height: 0;
`;
const Screen = styled.div`
  width: 80%;
  margin: 0 auto;
  padding: 12px 0;
  background: linear-gradient(to bottom, #495057, #343a40);
  color: #ced4da;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 5px;
  border-radius: 10px 10px 0 0;
  box-shadow: 0 -4px 15px rgba(0,0,0,0.2);
  margin-bottom: 30px;
`;
const SeatSelectionArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  justify-content: center;
  &::-webkit-scrollbar { width: 8px; }
  &::-webkit-scrollbar-thumb { background-color: #ced4da; border-radius: 4px; }
  &::-webkit-scrollbar-track { background-color: #f1f3f5; }
`;
const SeatContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;
const SeatRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;
const RowLabel = styled.div`
  width: 30px;
  text-align: center;
  font-size: 14px;
  font-weight: 700;
  color: #868e96;
`;
const Aisle = styled.div`
    width: 30px;
    height: 30px;
`;
const SeatBox = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 6px 6px 2px 2px;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ isSelected, disabled }) => 
    isSelected ? '#1E6DFF' : 
    disabled ? '#868e96' : '#dee2e6'};
  border: 1px solid ${({ isSelected, disabled }) => 
    isSelected ? '#1E6DFF' : 
    disabled ? '#868e96' : '#adb5bd'};
  transition: all 0.2s ease-in-out;
  &:hover {
    transform: ${({ disabled }) => disabled ? 'none' : 'scale(1.15)'};
    box-shadow: ${({ disabled }) => disabled ? 'none' : '0 4px 10px rgba(30, 109, 255, 0.3)'};
  }
`;
const SeatNumber = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${({ isSelected }) => (isSelected ? 'white' : '#495057')};
`;
