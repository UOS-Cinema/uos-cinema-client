import React, { useState, useMemo, useEffect, useContext } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import { UserContext } from '../../context/UserContext';

// 가격 정보
const prices = {
    adult: 15000,
    teen: 13000,
    senior: 13000,
    discounted: 10000
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

// Step2 메인 컴포넌트
const Step2 = ({ screeningId, counts, setCounts, selectedSeats, setSelectedSeats }) => {
    const { user } = useContext(UserContext);
    const [seatLayout, setSeatLayout] = useState([]);
    const [screeningDetails, setScreeningDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                const response = await fetch(`/screenings/${screeningId}`, {
                    headers: { 'Authorization': `Bearer ${user.accessToken}` },
                });
                if (!response.ok) throw new Error("좌석 정보를 불러오는 데 실패했습니다.");
                
                const responseData = await response.json();
                setScreeningDetails(responseData.data);
                setSeatLayout(responseData.data.seatingStatus);
            } catch (err) {
                setError(err.message);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchScreeningDetails();
    }, [screeningId, user]);

    // 부모로부터 받은 counts prop으로 계산
    const totalPeople = useMemo(() => Object.values(counts).reduce((sum, count) => sum + count, 0), [counts]);
    
    // 로딩 중이거나, screeningDetails가 없을 때 기본값(8)을 사용하도록 하여 초기 오류 방지
    const maxSelectable = useMemo(() => {
        if (!screeningDetails) return 8; 
        return Math.min(8, screeningDetails.availableSeats);
    }, [screeningDetails]);
    
    const totalPrice = useMemo(() => {
        return Object.entries(counts).reduce((sum, [type, count]) => sum + (prices[type] * count), 0);
    }, [counts]);
    
    // 인원수 변경 핸들러
    const handleCountChange = (type, delta) => {
        // 인원을 늘리려고 할 때, 로딩 중이 아닐 때만 최대 인원수 체크
        if (delta > 0 && !loading && totalPeople >= maxSelectable) {
            alert(`최대 ${maxSelectable}명까지 선택할 수 있습니다. (잔여 좌석: ${screeningDetails.availableSeats}석)`);
            return;
        }

        const newCount = counts[type] + delta;
        // setCounts가 함수인지 확인하여 예기치 않은 오류 방지
        if (newCount >= 0 && typeof setCounts === 'function') {
            setCounts(prev => ({ ...prev, [type]: newCount }));
        }
    };
    
    // 좌석 클릭 핸들러
    const handleSeatClick = (x, y) => {
        const seatStatus = seatLayout[y]?.[x];
        if (seatStatus !== 'SEAT') return;
        
        const seatId = `${String.fromCharCode(65 + y)}${x + 1}`;
        const isSelected = selectedSeats.includes(seatId);

        if (isSelected) {
            // setSelectedSeats가 함수인지 확인하여 예기치 않은 오류 방지
            if(typeof setSelectedSeats === 'function') {
                setSelectedSeats(selectedSeats.filter(id => id !== seatId));
            }
        } else {
            if (selectedSeats.length < totalPeople) {
                if(typeof setSelectedSeats === 'function') {
                    setSelectedSeats([...selectedSeats, seatId]);
                }
            } else {
                alert('선택한 인원수만큼 좌석을 선택할 수 있습니다.');
            }
        }
    };

    if (error) return <StatusText>{error}</StatusText>;

    const isIncreaseDisabled = totalPeople >= maxSelectable;

    return (
        <Container>
            <TopSection>
                <PersonCounter label="성인" count={counts.adult} onIncrease={() => handleCountChange('adult', 1)} onDecrease={() => handleCountChange('adult', -1)} isIncreaseDisabled={isIncreaseDisabled} disabled={loading} />
                <PersonCounter label="청소년" count={counts.teen} onIncrease={() => handleCountChange('teen', 1)} onDecrease={() => handleCountChange('teen', -1)} isIncreaseDisabled={isIncreaseDisabled} disabled={loading} />
                <PersonCounter label="경로" count={counts.senior} onIncrease={() => handleCountChange('senior', 1)} onDecrease={() => handleCountChange('senior', -1)} isIncreaseDisabled={isIncreaseDisabled} disabled={loading} />
                <PersonCounter label="우대" count={counts.discounted} onIncrease={() => handleCountChange('discounted', 1)} onDecrease={() => handleCountChange('discounted', -1)} isIncreaseDisabled={isIncreaseDisabled} disabled={loading} />
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
                                {seatLayout.map((row, y) => {
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
                                                    <SeatBox
                                                        key={seatId}
                                                        isSelected={isSelected}
                                                        disabled={isDisabled}
                                                        onClick={() => handleSeatClick(x, y)}
                                                    >
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