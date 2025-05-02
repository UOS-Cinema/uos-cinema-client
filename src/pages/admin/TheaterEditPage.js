import Navbar from "../../component/common/NavBar";
import styled from "styled-components";

import { useState } from "react";
// const sampleTheater = {
//     theaterId: 1,
//     name: "C-Language",
//     types: ["2D", "3D"],
// }
const initialSeatStandard = [
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

const TheaterEditPage = () => {
    const [rows, setRows] = useState(10);
    const [cols, setCols] = useState(20);
    const [seatStandard, setSeatStandard] = useState(initialSeatStandard);
    const [mode, setMode] = useState("normal"); // normal, stair, unavailable
    const [name, setName] = useState("C-Language");
    const [selectedTypes, setSelectedTypes] = useState(["2D", "3D"]);
    const types = ["2D", "3D", "4D"];

    const toggleType = (type) => {
        if (selectedTypes.includes(type)) {
            setSelectedTypes(selectedTypes.filter(t => t !== type));
        } else {
            setSelectedTypes([...selectedTypes, type]);
        }
    };

    // 좌석 규격 변경
    const handleResize = () => {
        const newSeatStandard = Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => 1) // 기본적으로 정상 좌석(1)으로 설정
        );
        setSeatStandard(newSeatStandard);
    };

    // 좌석 모드 변경
    const toggleMode = (newMode) => {
        setMode(newMode);
    };

    const handleSeatClick = (y, x) => {
        const newSeatStandard = [...seatStandard];
        if (mode === "normal") {
            newSeatStandard[y][x] = 1; // 정상 좌석
        } else if (mode === "stair") {
            newSeatStandard[y][x] = newSeatStandard[y][x] === 0 ? 1 : 0; // 계단 ↔ 정상
        } else if (mode === "unavailable") {
            newSeatStandard[y][x] = newSeatStandard[y][x] === 2 ? 1 : 2; // 사용불가 ↔ 정상
        }
        setSeatStandard(newSeatStandard);
    };
    return (
        <div>
            <Navbar underline={true} />
            <Theater>
                <Section>
                    <Label>상영관 이름</Label>
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Section>

                <Section>
                    <Label>제공 유형</Label>
                    <ButtonGroup>
                        {types.map((type) => (
                            <TypeButton
                                key={type}
                                selected={selectedTypes.includes(type)}
                                onClick={() => toggleType(type)}
                            >
                                {type}
                            </TypeButton>
                        ))}
                    </ButtonGroup>
                </Section>


                <Section>
                    <Label>좌석 규격</Label>
                    <SeatInputContainer>
                        <SeatStandardInput
                            type="number"
                            value={rows}
                            onChange={(e) => setRows(Number(e.target.value))}
                            min={1}
                        />
                        x
                        <SeatStandardInput
                            type="number"
                            value={cols}
                            onChange={(e) => setCols(Number(e.target.value))}
                            min={1}
                        />
                    </SeatInputContainer>

                    <SaveButton onClick={handleResize}>적용</SaveButton>
                </Section>

                <Section>
                    <Label>모드 선택</Label>
                    <ButtonGroup>
                        <ModeButton
                            onClick={() => toggleMode("normal")}
                            selected={mode === "normal"}
                        >
                            정상 좌석
                            <SeatBox seatType={1}></SeatBox>
                        </ModeButton>
                        <ModeButton
                            onClick={() => toggleMode("stair")}
                            selected={mode === "stair"}
                        >
                            계단통로 좌석
                            <SeatBox seatType={0}></SeatBox>
                        </ModeButton>
                        <ModeButton
                            onClick={() => toggleMode("unavailable")}
                            selected={mode === "unavailable"}
                        >
                            사용불가 좌석
                            <SeatBox seatType={2}></SeatBox>
                        </ModeButton>
                    </ButtonGroup>
                </Section>

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

                                                onClick={() => handleSeatClick(y, x)}
                                                seatType={seat}
                                            >
                                                <SeatNumber>{seat === 1 || seat === 2 ? seatNumber++ : ""}</SeatNumber>
                                            </SeatBox>
                                        );
                                    })}
                                </SeatRow>
                            );
                        })}
                    </SeatContainer>
                </SelectSeat>
                <SaveButton onClick={() => console.log("저장할 데이터:", { name, seatStandard })}>
                    저장
                </SaveButton>
            </Theater>
        </div>
    );
};

const SeatInputContainer = styled.div`
    display:flex;
    flex-direction:row;
`;

const ModeButton = styled.button`
display:flex;
flex-direciton:row;
gap:10px;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background-color: ${(props) => (props.selected ? "#1D79F2" : "#ccc")};
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => (props.selected ? "#0B2D59" : "#999")};
  }
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
  color: black;
`;
const SeatRow = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
`;

const SeatBox = styled.div`
  background-color: ${(props) => {
        if (props.seatType === 1) return "#b6b6b6"; // 정상
        if (props.seatType === 0) return "#fff176"; // 계단 - 노란색
        if (props.seatType === 2) return "#b71c1c"; // 사용불가 - 빨간색
        return "white";
    }};
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

const Theater = styled.div`
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 30px;
  margin: 15px 20px;
  background-color: #f9f9f9;
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
`;

const SeatStandardInput  = styled.input`
    padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin:5px;
  width:30px;
`;
const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const TypeButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background-color: ${(props) => (props.selected ? "#1D79F2" : "#ccc")};
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => (props.selected ? "#0B2D59" : "#999")};
  }
`;

const SaveButton = styled.button`
  padding: 10px 20px;
  background-color: #1D79F2;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0B2D59;
  }
`;

export default TheaterEditPage;