import Navbar from "../../component/common/NavBar";
import styled from "styled-components";
import { Link } from "react-router-dom";
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
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];
const TheaterDetailPage = () => {
    return (
        <div>
            <Navbar underline={true} />
            <Theater>
                <InfoHeader>
                    <div>
                        <Info>상영관{sampleTheater.theaterId} ({sampleTheater.name} 상영관)</Info>
                        <Info>제공 유형: {sampleTheater.types.join(", ")}</Info>
                    </div>

                    <EditLink to="../theaterEdit">수정하기</EditLink>
                </InfoHeader>
                <div>
                    <Screen>Screen</Screen>
                    <SelectSeat>
                        <SeatContainer>
                            {seatStandard.map((seats, y) => {
                                let seatNumber = 1;
                                return (
                                    <SeatRow key={y}>
                                        <RowLabel>{String.fromCharCode(65 + y)}</RowLabel>
                                        {seats.map((seat, x) => {
                                            return (
                                                <SeatBox
                                                    key={x}
                                                    isAvailable={seat === 1}
                                                >
                                                    <SeatNumber>{seat === 1 ? seatNumber++ : ""}</SeatNumber>
                                                </SeatBox>
                                            );
                                        })}
                                    </SeatRow>
                                );
                            })}
                        </SeatContainer>
                    </SelectSeat>
                </div>

            </Theater>

        </div>
    )
}

const InfoHeader = styled.div`
    display:flex;
    flex-direction:row;
    justify-content:space-between;
`;
const EditLink = styled(Link)`
  padding: 8px 16px;
  text-decoration:none;
  background-color: #1D79F2;
  border: none;
  color: white;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
    height:30px;
  &:hover {
    background-color: #0B2D59;
  }
`;
const Theater = styled.div`
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 30px;
  margin:15px 20px;
    
  background-color: #f9f9f9;
`;

const Info = styled.div`
  margin-bottom: 8px;
  font-size: 16px;
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
const Screen = styled.div`
  color: white;
  background-color: gray;
  width: 100%;
  height: 30px;
  text-align: center;
`;
export default TheaterDetailPage;