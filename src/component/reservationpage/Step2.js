import styled from "styled-components";
import { useState } from "react";
import { FaMinus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";

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
      {/* <Title>인원 선택</Title> */}
      <SelectNum>

        <SelectItem>
          <Label>성인</Label>
          <Button onClick={() => setAdultCount(adultCount - 1)}><FaMinus /></Button>
          <Number>{adultCount}</Number>
          <Button onClick={() => setAdultCount(adultCount + 1)}><FaPlus /></Button>
        </SelectItem>
        <SelectItem>
          <Label>청소년</Label>
          <Button onClick={() => setTeenCount(teenCount - 1)}><FaMinus /></Button>
          <Number>{teenCount}</Number>
          <Button onClick={() => setTeenCount(teenCount + 1)}><FaPlus /></Button>
        </SelectItem>
        <SelectItem>
          <Label>경로</Label>
          <Button onClick={() => setSeniorCount(seniorCount - 1)}><FaMinus /></Button>
          <Number>{seniorCount}</Number>
          <Button onClick={() => setSeniorCount(seniorCount + 1)}><FaPlus /></Button>
        </SelectItem>
        <SelectItem>
          <Label>우대</Label>
          <Button onClick={() => setDiscountedCount(discountedCount - 1)}><FaMinus /></Button>
          <Number>{discountedCount}</Number>
          <Button onClick={() => setDiscountedCount(discountedCount + 1)}><FaPlus /></Button>
        </SelectItem>
        <TotalPrice>{teenCount * 13000 + adultCount * 15000 + seniorCount * 13000 + discountedCount * 10000}원</TotalPrice>
      </SelectNum>

      {/* <Title>좌석 선택</Title> */}
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
                      <SeatNumber
                        isSelected={isSelected}
                      >{seat === 1 ? seatNumber++ : ""}</SeatNumber>
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
  background-color: #66A3F2;
  width: 100%;
  padding:16px 0;
  font-size:16px;
  text-align: center;
  display:flex;
  justify-content:center;
  align-items:center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  width: 100%;
   border-right: 1px solid  #DCEBFF;
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
  font-size: 14px;
  font-weight: bold;
  color: #1E6DFF;
`;


const SelectNum = styled.div`
  display: flex;
  justify-content: start;
  flex-direction: row;
  align-items: center;
  justify-content:center;
  padding:8px 0;
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
  padding: 4px;
  font-size: 14px;
  margin-top:5px;
  margin-left:4px;
  margin-right:4px;
  cursor: pointer;
  text-align:center;
  transition: background-color 0.3s ease;
  
  background-color: inherit;
  border: none;
`;

const Number = styled.div`
  font-size: 16px;
  padding: 0 4px;
`;
const TotalPrice = styled.div`
  font-size:16px;
  font-weight:600;
  margin-left:30px;
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

  border: ${(props) =>
    props.isAvailable
      ? props.isSelected
        ? "2px solid #1E6DFF" // 선택된 좌석은 빨간색
        : "2px solid #b6b6b6" // 사용 가능한 좌석은 회색
      : "2px solid white"};
  border: ${(props) =>
    props.isAvailable
      ? "2px solid #1E6DFF"
      : "2px solid white"};
  background-color:${(props) =>
    props.isSelected
      ? " #1E6DFF" // 선택된 좌석은 빨간색

      : " white"};
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
  color: ${(props) =>
    props.isSelected
      ? " white" // 선택된 좌석은 빨간색

      : " #1E6DFF"};
`;

const Label = styled.div`
  margin-left: 8px;
  font-size:12px;
`;

export default Step2;
