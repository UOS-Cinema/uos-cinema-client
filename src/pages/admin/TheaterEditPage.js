import React, { useState } from "react";
import Navbar from "../../component/common/NavBar";
import styled from "styled-components";
import { FaSave } from "react-icons/fa";

// --- 목업 데이터 ---
const initialSeatStandard = [
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
// --- 목업 데이터 끝 ---

const TheaterEditPage = () => {
    const [rows, setRows] = useState(10);
    const [cols, setCols] = useState(20);
    const [seatStandard, setSeatStandard] = useState(initialSeatStandard);
    const [mode, setMode] = useState("normal");
    const [name, setName] = useState("C-Language");
    const [selectedTypes, setSelectedTypes] = useState(["2D", "3D"]);
    const types = ["2D", "3D", "4D", "IMAX"];

    const toggleType = (type) => {
        setSelectedTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const handleResize = () => {
        const newSeatStandard = Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => 1)
        );
        setSeatStandard(newSeatStandard);
    };

    const handleSeatClick = (y, x) => {
        const newSeatStandard = seatStandard.map(row => [...row]);
        const currentSeat = newSeatStandard[y][x];

        if (mode === "normal") newSeatStandard[y][x] = currentSeat === 1 ? 1 : 1;
        else if (mode === "aisle") newSeatStandard[y][x] = currentSeat === 0 ? 1 : 0;
        else if (mode === "disabled") newSeatStandard[y][x] = currentSeat === 2 ? 1 : 2;

        setSeatStandard(newSeatStandard);
    };

    return (
        <PageWrapper>
            <Navbar underline={true} />
            <Container>
                <Title>상영관 수정</Title>
                <EditContainer>
                    {/* 정보 수정 섹션 */}
                    <InfoEditSection>
                        <Section>
                            <Label>상영관 이름</Label>
                            <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </Section>
                        <Section>
                            <Label>제공 유형</Label>
                            <ButtonGroup>
                                {types.map((type) => (
                                    <TypeButton key={type} selected={selectedTypes.includes(type)} onClick={() => toggleType(type)}>
                                        {type}
                                    </TypeButton>
                                ))}
                            </ButtonGroup>
                        </Section>
                        <Section>
                            <Label>좌석 규격 (가로 x 세로)</Label>
                            <ResizeContainer>
                                <SeatStandardInput type="number" value={cols} onChange={(e) => setCols(Number(e.target.value))} min={1} />
                                <span>x</span>
                                <SeatStandardInput type="number" value={rows} onChange={(e) => setRows(Number(e.target.value))} min={1} />
                                <ApplyButton onClick={handleResize}>적용</ApplyButton>
                            </ResizeContainer>
                        </Section>
                    </InfoEditSection>

                    {/* 좌석 배치 수정 섹션 */}
                    <SeatEditSection>
                        <ModeSelector>
                            <Label>좌석 편집 모드</Label>
                            <ButtonGroup>
                                <ModeButton selected={mode === "normal"} onClick={() => setMode("normal")}><SeatBoxPreview seatType={1} />정상</ModeButton>
                                <ModeButton selected={mode === "aisle"} onClick={() => setMode("aisle")}><SeatBoxPreview seatType={0} />통로</ModeButton>
                                <ModeButton selected={mode === "disabled"} onClick={() => setMode("disabled")}><SeatBoxPreview seatType={2} />사용불가</ModeButton>
                            </ButtonGroup>
                        </ModeSelector>
                        <Screen>SCREEN</Screen>
                        <SeatContainer>
                            {seatStandard.map((row, y) => {
                                let seatNumber = 1;
                                return (
                                    <SeatRow key={y}>
                                        <RowLabel>{String.fromCharCode(65 + y)}</RowLabel>
                                        {row.map((seat, x) => (
                                            <SeatBox key={x} seatType={seat} onClick={() => handleSeatClick(y, x)}>
                                                {seat === 1 || seat === 2 ? <SeatNumber seatType={seat}>{seatNumber++}</SeatNumber> : null}
                                            </SeatBox>
                                        ))}
                                    </SeatRow>
                                )
                            })}
                        </SeatContainer>
                    </SeatEditSection>
                </EditContainer>
                <SaveButton><FaSave /> 변경사항 저장</SaveButton>
            </Container>
        </PageWrapper>
    );
};

export default TheaterEditPage;


// --- STYLED COMPONENTS ---
const primaryBlue = '#1E6DFF';
const darkGray = '#343a40';
const mediumGray = '#dee2e6';
const lightGray = '#f8f9fa';
const screenGray = '#495057';
const yellow = '#fcc419';
const red = '#e03131';

const PageWrapper = styled.div`
  background-color: ${lightGray};
  min-height: 100vh;
  padding-bottom: 50px;
`;

const Container = styled.div`
  width: 85%;
  max-width: 1400px;
  margin: 40px auto;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 900;
  color: ${darkGray};
  margin-bottom: 30px;
`;

const EditContainer = styled.div`
  background-color: #fff;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.07);
`;

const InfoEditSection = styled.div`
    border-bottom: 1px solid ${mediumGray};
    padding-bottom: 30px;
    margin-bottom: 30px;
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.h3`
  font-weight: 700;
  font-size: 18px;
  margin: 0 0 12px;
  color: ${darkGray};
`;

const Input = styled.input`
  height: 42px;
  width: 300px;
  padding: 0 16px;
  border: 1px solid ${mediumGray};
  border-radius: 8px;
  font-size: 16px;
  &:focus { outline-color: ${primaryBlue}; }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const TypeButton = styled.button`
  padding: 10px 20px;
  border: 1px solid ${({ selected }) => (selected ? primaryBlue : mediumGray)};
  border-radius: 8px;
  background-color: ${({ selected }) => (selected ? primaryBlue : "#fff")};
  color: ${({ selected }) => (selected ? "#fff" : darkGray)};
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
`;

const ResizeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  span { font-weight: 700; }
`;

const SeatStandardInput = styled.input`
  width: 70px;
  height: 42px;
  text-align: center;
  padding: 0 12px;
  border: 1px solid ${mediumGray};
  border-radius: 8px;
  font-size: 16px;
  &:focus { outline-color: ${primaryBlue}; }
`;

const ApplyButton = styled.button`
  padding: 0 20px;
  height: 42px;
  background-color: ${darkGray};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
`;

const SeatEditSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ModeSelector = styled.div`
    width: 100%;
    margin-bottom: 30px;
`;

const ModeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  border: 1px solid ${({ selected }) => (selected ? primaryBlue : mediumGray)};
  border-radius: 8px;
  background-color: ${({ selected }) => (selected ? '#eff6ff' : "#fff")};
  color: ${({ selected }) => (selected ? primaryBlue : darkGray)};
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
`;

const SeatBoxPreview = styled.span`
  width: 20px;
  height: 18px;
  border-radius: 4px 4px 1px 1px;
  background-color: ${({ seatType }) =>
      seatType === 1 ? mediumGray : seatType === 0 ? "transparent" : red
  };
   border: ${({seatType}) => seatType === 0 ? `2px dashed ${mediumGray}` : 'none' };
   box-sizing: border-box;
`;

const Screen = styled.div`
  width: 100%;
  max-width: 800px;
  margin-bottom: 30px;
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
  gap: 6px;
  margin-bottom: 40px;
`;

const SeatRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

const RowLabel = styled.div`
  width: 30px;
  text-align: center;
  font-size: 15px;
  font-weight: 700;
  color: #adb5bd;
`;

const SeatBox = styled.div`
  width: 30px;
  height: 26px;
  border-radius: 6px 6px 2px 2px;
  background-color: ${({ seatType }) =>
      seatType === 1 ? mediumGray : seatType === 2 ? red : "transparent"
  };
  border: ${({seatType}) => seatType === 0 ? `2px dashed ${mediumGray}` : 'none' };
  box-sizing: border-box; /* 테두리를 크기에 포함시켜 열 정렬 문제 해결 */
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  
  &:hover {
      transform: scale(1.1);
  }
`;

const SeatNumber = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${({seatType}) => (seatType === 1 ? darkGray : '#fff')};
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  align-self: center; /* 버튼 중앙 정렬 */
  width: 100%;
  max-width: 400px;
  padding: 16px 20px;
  margin-top: 20px;
  background-color: ${primaryBlue};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;
