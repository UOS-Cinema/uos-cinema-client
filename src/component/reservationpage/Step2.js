import styled from "styled-components";
import { useState } from "react";

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
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

const Step2 = () => {
  const [adultCount, setAdultCount] = useState(0);
  const [teenCount, setTeenCount] = useState(0);
  const [seniorCount, setSeniorCount] = useState(0);
  const [discountedCount, setDiscountedCount] = useState(0);

  const [selectedSeats, setSelectedSeats] = useState([]); // 선택된 좌석들을 배열로 저장

  const handleSeatClick = (x, y) => {
    const seatIndex = selectedSeats.findIndex(
      (seat) => seat.x === x && seat.y === y
    );
    if (seatIndex >= 0) {
      // 이미 선택된 좌석이면 선택 해제
      setSelectedSeats(selectedSeats.filter((seat) => seat.x !== x || seat.y !== y));
    } else {
      // 선택되지 않은 좌석이면 선택 추가
      setSelectedSeats([...selectedSeats, { x, y }]);
    }
  };

  return (
    <Container>
      <Title>인원 선택</Title>
      <SelectNum>

        <SelectItem>
          <Label>성인</Label>
          <Button onClick={() => setAdultCount(adultCount - 1)}>-</Button>
          <Number>{adultCount}</Number>
          <Button onClick={() => setAdultCount(adultCount + 1)}>+</Button>
        </SelectItem>
        <SelectItem>
          <Label>청소년</Label>
          <Button onClick={() => setTeenCount(teenCount - 1)}>-</Button>
          <Number>{teenCount}</Number>
          <Button onClick={() => setTeenCount(teenCount + 1)}>+</Button>
        </SelectItem>
        <SelectItem>
          <Label>경로</Label>
          <Button onClick={() => setSeniorCount(seniorCount - 1)}>-</Button>
          <Number>{seniorCount}</Number>
          <Button onClick={() => setSeniorCount(seniorCount + 1)}>+</Button>
        </SelectItem>
        <SelectItem>
          <Label>우대</Label>
          <Button onClick={() => setDiscountedCount(discountedCount - 1)}>-</Button>
          <Number>{discountedCount}</Number>
          <Button onClick={() => setDiscountedCount(discountedCount + 1)}>+</Button>
        </SelectItem>
        <div>총가격: {teenCount * 13000 + adultCount * 15000 + seniorCount * 13000 + discountedCount * 10000}원원</div>
      </SelectNum>

      <Title>좌석 선택</Title>
      <Screen>Screen</Screen>
      <SelectSeat>
        <SeatContainer>
          {seatStandard.map((seats, y) => {
            let seatNumber = 1;
            return (
              <SeatRow key={y}>
                <RowLabel>{String.fromCharCode(65 + y)}</RowLabel>
                {seats.map((seat, x) => {
                  const isSelected =
                    selectedSeats.findIndex((seat) => seat.x === x && seat.y === y) >= 0;
                  return (
                    <SeatBox
                      key={x}
                      isAvailable={seat === 1}
                      onClick={() => seat === 1 && handleSeatClick(x, y)}
                      isSelected={isSelected} // 선택된 좌석에 스타일 적용
                    >
                      <SeatNumber>{seat === 1  ? seatNumber++ : ""}</SeatNumber>
                    </SeatBox>
                  );
                })}
              </SeatRow>
            );
          })}
        </SeatContainer>
      </SelectSeat>
    </Container>
  );
};

const Screen = styled.div`
  color: white;
  background-color: gray;
  width: 100%;
  height: 30px;
  text-align: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  width: 100%;
`;

const Title = styled.h2`
  width: 100%;
  background-color:#1D79F2;
  color: white;
  text-align: center;
  font-size: 20px;
  height: 40px;
  margin: 0;
  padding: 10px 0;
`;

const RowLabel = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  color: white;
`;


const SelectNum = styled.div`
  display: flex;
  justify-content: start;
  flex-direction: row;
  align-items: center;
`;

const SelectItem = styled.div`
  border: 1px solid gray;
  border-radius: 10px;
  margin: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Button = styled.button`
  padding: 10px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 5px;
  background-color: inherit;
  border: none;
`;

const Number = styled.div`
  font-size: 20px;
  padding: 0 10px;
`;

const SelectSeat = styled.div`
  display: flex;
  justify-content: center;
  background-color:white;
  padding-top:20px;
`;

const SeatContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const SeatRow = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
`;

const SeatBox = styled.div`
  background-color: ${(props) =>
    props.isAvailable
      ? props.isSelected
        ? "#0B2D59" // 선택된 좌석은 빨간색
        : "#b6b6b6" // 사용 가능한 좌석은 회색
      : "white"};
  height: 30px;
  width: 30px;
  border-radius: 10px 10px 0 0;
  margin: 0 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const SeatNumber = styled.div`
  font-size: 14px;
  color: white;
`;

const Label = styled.div`
  margin: 10px;
`;

export default Step2;
