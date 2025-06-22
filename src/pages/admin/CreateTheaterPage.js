import React, { useState, useContext } from "react";
import Navbar from "../../component/common/NavBar";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { UserContext } from "../../context/UserContext";

// 기본 레이아웃을 생성하는 헬퍼 함수
const createDefaultLayout = (rows, cols) => {
    return Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => "SEAT")
    );
};

const CreateTheaterPage = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    // --- 상태 초기화 (등록 페이지에 맞게 수정) ---
    const [number, setNumber] = useState(""); // 상영관 번호 상태 추가
    const [name, setName] = useState("");
    const [selectedTypes, setSelectedTypes] = useState([]);
    
    const defaultRows = 10;
    const defaultCols = 10;
    const [rows, setRows] = useState(defaultRows);
    const [cols, setCols] = useState(defaultCols);
    const [layout, setLayout] = useState(() => createDefaultLayout(defaultRows, defaultCols));
    
    const [mode, setMode] = useState("SEAT"); 

    const allScreenTypes = ["2D", "3D", "4D"];

    // 제공 유형 선택/해제
    const toggleType = (type) => {
        setSelectedTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    // 좌석 규격 변경 적용
    const handleResize = () => {
        if (rows > 0 && cols > 0) {
            setLayout(createDefaultLayout(rows, cols));
        }
    };

    // 좌석 클릭 시 현재 모드로 좌석 상태 변경
    const handleSeatClick = (y, x) => {
        const newLayout = layout.map(row => [...row]);
        newLayout[y][x] = mode;
        setLayout(newLayout);
    };

    // --- 등록 핸들러 (API 명세에 맞게 수정) ---
    const handleCreate = async () => {
        const accessToken = user?.accessToken;
        if (!accessToken) {
            alert("로그인이 필요합니다.");
            return;
        }

        // 유효성 검사 추가
        if (!number || isNaN(Number(number)) || Number(number) <= 0) {
            alert("유효한 상영관 번호를 입력해주세요.");
            return;
        }
        if (!name.trim()) {
            alert("상영관 이름을 입력해주세요.");
            return;
        }
        if (selectedTypes.length === 0) {
            alert("제공 유형을 하나 이상 선택해주세요.");
            return;
        }

        // 요청 본문(payload) 형식 수정
        const payload = {
            number: Number(number),
            name: name,
            layout: layout,
            screenTypes: selectedTypes,
        };

        try {
            // 엔드포인트 수정
            const response = await fetch('/admin/theaters', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '등록에 실패했습니다.');
            }
            
            alert('성공적으로 등록되었습니다.');
            navigate('/theaters'); 

        } catch (err) {
            alert(err.message);
        }
    };
    
    return (
        <PageWrapper>
            <Navbar underline={true} />
            <Container>
                <Title>새 상영관 등록</Title>
                <EditContainer>
                    <InfoEditSection>
                        {/* 상영관 번호 입력 필드 추가 */}
                        <Section>
                            <Label>상영관 번호</Label>
                            <Input type="number" value={number} placeholder="숫자를 입력하세요 (예: 1)" onChange={(e) => setNumber(e.target.value)} />
                        </Section>
                        <Section>
                            <Label>상영관 이름</Label>
                            <Input type="text" value={name} placeholder="예: 1관, C-Language관" onChange={(e) => setName(e.target.value)} />
                        </Section>
                        <Section>
                            <Label>제공 유형</Label>
                            <ButtonGroup>
                                {allScreenTypes.map((type) => (
                                    <TypeButton key={type} selected={selectedTypes.includes(type)} onClick={() => toggleType(type)}>
                                        {type}
                                    </TypeButton>
                                ))}
                            </ButtonGroup>
                        </Section>
                        <Section>
                            <Label>좌석 규격 (세로(행) x 가로(열))</Label>
                            <ResizeContainer>
                                <SeatStandardInput type="number" min="1" value={rows} onChange={(e) => setRows(Math.max(1, Number(e.target.value)))} />
                                <span>x</span>
                                <SeatStandardInput type="number" min="1" value={cols} onChange={(e) => setCols(Math.max(1, Number(e.target.value)))} />
                                <ApplyButton onClick={handleResize}>크기 변경 적용</ApplyButton>
                            </ResizeContainer>
                        </Section>
                    </InfoEditSection>

                    <SeatEditSection>
                        <ModeSelector>
                            <Label>좌석 편집 모드 (선택 후 좌석 클릭)</Label>
                            <ButtonGroup>
                                <ModeButton selected={mode === "SEAT"} onClick={() => setMode("SEAT")}><SeatBoxPreview seatType="SEAT" />좌석</ModeButton>
                                <ModeButton selected={mode === "AISLE"} onClick={() => setMode("AISLE")}><SeatBoxPreview seatType="AISLE" />통로</ModeButton>
                                <ModeButton selected={mode === "UNAVAILABLE"} onClick={() => setMode("UNAVAILABLE")}><SeatBoxPreview seatType="UNAVAILABLE" />사용불가</ModeButton>
                            </ButtonGroup>
                        </ModeSelector>
                        <Screen>SCREEN</Screen>
                        <SeatContainer>
                            {layout.map((row, y) => {
                                let seatNumber = 1;
                                return (
                                    <SeatRow key={y}>
                                        <RowLabel>{String.fromCharCode(65 + y)}</RowLabel>
                                        {row.map((seatType, x) => (
                                            <SeatBox key={x} seatType={seatType} onClick={() => handleSeatClick(y, x)}>
                                                {seatType === "SEAT" && <SeatNumber>{seatNumber++}</SeatNumber>}
                                            </SeatBox>
                                        ))}
                                    </SeatRow>
                                )
                            })}
                        </SeatContainer>
                    </SeatEditSection>
                </EditContainer>
                <SubmitButton onClick={handleCreate}><FaPlus /> 상영관 등록</SubmitButton>
            </Container>
        </PageWrapper>
    );
};

export default CreateTheaterPage;


// --- STYLED COMPONENTS (이전과 동일) ---
const primaryBlue = '#1E6DFF';
const darkGray = '#343a40';
const mediumGray = '#dee2e6';
const lightGray = '#f8f9fa';
const screenGray = '#495057';
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
  flex-wrap: wrap; 
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
      seatType === "SEAT" ? mediumGray 
    : seatType === "UNAVAILABLE" ? red 
    : "transparent"
  };
  border: ${({seatType}) => seatType === "AISLE" ? `2px dashed ${mediumGray}` : 'none' };
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
  padding: 20px;
  background-color: ${lightGray};
  border-radius: 8px;
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
      seatType === "SEAT" ? mediumGray 
    : seatType === "UNAVAILABLE" ? red 
    : "transparent"
  };
  border: ${({seatType}) => seatType === "AISLE" ? `2px dashed ${mediumGray}` : 'none' };
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.1s;
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
  color: ${darkGray};
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  max-width: 400px;
  padding: 16px 20px;
  margin: 20px auto 0; 
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