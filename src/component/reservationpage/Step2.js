import React, { useState, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaMinus, FaPlus } from 'react-icons/fa6';

// 좌석 배치 데이터 (0: 통로, 1: 좌석)
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
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// 가격 정보
const prices = {
    adult: 15000,
    teen: 13000,
    senior: 13000,
    discounted: 10000
};

// 인원 선택 컴포넌트
const PersonCounter = ({ label, count, onIncrease, onDecrease }) => (
    <SelectItem>
        <Label>{label}</Label>
        <Counter>
            <CounterButton onClick={onDecrease} disabled={count <= 0}><FaMinus /></CounterButton>
            <Number>{count}</Number>
            <CounterButton onClick={onIncrease}><FaPlus /></CounterButton>
        </Counter>
    </SelectItem>
);


// Step2 메인 컴포넌트
const Step2 = () => {
    // 인원수 상태 관리
    const [counts, setCounts] = useState({
        adult: 0,
        teen: 0,
        senior: 0,
        discounted: 0,
    });
    
    // 선택된 좌석 상태 관리
    const [selectedSeats, setSelectedSeats] = useState([]);

    // 총 선택 인원수 계산
    const totalPeople = useMemo(() => Object.values(counts).reduce((sum, count) => sum + count, 0), [counts]);
    
    // 총 가격 계산
    const totalPrice = useMemo(() => {
        return Object.entries(counts).reduce((sum, [type, count]) => {
            return sum + (prices[type] * count);
        }, 0);
    }, [counts]);
    
    // 인원수 변경 핸들러
    const handleCountChange = (type, delta) => {
        const newCount = counts[type] + delta;
        if (newCount >= 0) {
            setCounts(prev => ({ ...prev, [type]: newCount }));
        }
    };
    
    // 좌석 클릭 핸들러
    const handleSeatClick = (x, y) => {
        const seatId = `${y}-${x}`;
        const isSelected = selectedSeats.includes(seatId);

        if (isSelected) {
            // 좌석 선택 해제
            setSelectedSeats(selectedSeats.filter(id => id !== seatId));
        } else {
            // 총 인원수보다 많은 좌석을 선택하지 못하도록 제한
            if (selectedSeats.length < totalPeople) {
                setSelectedSeats([...selectedSeats, seatId]);
            } else {
                alert('선택한 인원수만큼 좌석을 선택할 수 있습니다.');
            }
        }
    };

    return (
        <Container>
            {/* 상단: 인원 선택 및 가격 정보 */}
            <TopSection>
                <PersonCounter label="성인" count={counts.adult} onIncrease={() => handleCountChange('adult', 1)} onDecrease={() => handleCountChange('adult', -1)} />
                <PersonCounter label="청소년" count={counts.teen} onIncrease={() => handleCountChange('teen', 1)} onDecrease={() => handleCountChange('teen', -1)} />
                <PersonCounter label="경로" count={counts.senior} onIncrease={() => handleCountChange('senior', 1)} onDecrease={() => handleCountChange('senior', -1)} />
                <PersonCounter label="우대" count={counts.discounted} onIncrease={() => handleCountChange('discounted', 1)} onDecrease={() => handleCountChange('discounted', -1)} />
                <PriceContainer>
                    <PriceLabel>총 금액</PriceLabel>
                    <TotalPrice>{totalPrice.toLocaleString()}원</TotalPrice>
                </PriceContainer>
            </TopSection>
            
            {/* 하단: 좌석 선택 */}
            <BottomSection>
                <Screen>SCREEN</Screen>
                <SeatSelectionArea>
                    <SeatContainer>
                        {seatStandard.map((row, y) => {
                            let seatNumber = 1;
                            return (
                                <SeatRow key={y}>
                                    <RowLabel>{String.fromCharCode(65 + y)}</RowLabel>
                                    {row.map((seatType, x) => {
                                        if (seatType === 0) {
                                            return <Aisle key={`${y}-${x}`} />;
                                        }
                                        const seatId = `${y}-${x}`;
                                        const isSelected = selectedSeats.includes(seatId);
                                        const currentSeatNumber = seatNumber++;
                                        return (
                                            <SeatBox
                                                key={seatId}
                                                isSelected={isSelected}
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
            </BottomSection>
        </Container>
    );
};

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

  &:hover {
    background-color: #1E6DFF;
    color: white;
  }
  
  &:disabled {
    background-color: #e9ecef;
    color: #adb5bd;
    cursor: not-allowed;
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
  flex: 1; /* 남은 공간을 모두 차지하도록 설정 */
  display: flex;
  flex-direction: column;
  padding: 24px;
  min-height: 0; /* flex-shrink 방지 */
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
  flex: 1; /* 스크롤을 위해 남은 공간을 차지 */
  overflow-y: auto; /* 내용이 넘칠 경우 세로 스크롤 생성 */
  padding: 10px;
  display: flex;
  justify-content: center;
  
  /* 스크롤바 디자인 */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ced4da;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background-color: #f1f3f5;
  }
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
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ isSelected }) => isSelected ? '#1E6DFF' : '#dee2e6'};
  border: 1px solid ${({ isSelected }) => isSelected ? '#1E6DFF' : '#adb5bd'};
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.15);
    box-shadow: 0 4px 10px rgba(30, 109, 255, 0.3);
  }
`;

const SeatNumber = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${({ isSelected }) => (isSelected ? 'white' : '#495057')};
`;

export default Step2;

