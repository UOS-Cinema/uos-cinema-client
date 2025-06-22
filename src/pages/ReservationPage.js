import React, { useState, useMemo } from 'react';
import styled from 'styled-components';

// 컴포넌트 임포트
import GlobalStyle from '../globalStyle';
import Navbar from '../component/common/NavBar';
import StepIndicator from '../component/reservationpage/StepIndicator';
import Step1 from '../component/reservationpage/Step1';
import Step2 from '../component/reservationpage/Step2';
import Step3 from'../component/reservationpage/Step3';

function BookingPage() {
    // --- 예매 과정 전체 데이터 상태 관리 ---
    const [step, setStep] = useState(1);
    const [selectedScreening, setSelectedScreening] = useState(null);
    // Step2의 상태를 부모로 끌어올림
    const [counts, setCounts] = useState({ adult: 0, teen: 0, senior: 0, discounted: 0 }); 
    const [selectedSeats, setSelectedSeats] = useState([]);

    // 다음 단계로 이동하는 핸들러
    const handleNext = () => {
        // 1단계 -> 2단계 유효성 검사
        if (step === 1 && !selectedScreening) {
            alert("상영일정을 선택해주세요.");
            return;
        }

        // 2단계 -> 3단계 유효성 검사
        if (step === 2) {
            const totalPeople = Object.values(counts).reduce((sum, count) => sum + count, 0);
            if (totalPeople === 0) {
                alert("인원을 1명 이상 선택해주세요.");
                return;
            }
            if (selectedSeats.length !== totalPeople) {
                alert("선택하신 인원수와 좌석 수가 일치하지 않습니다.");
                return;
            }
        }

        if (step < 3) {
            setStep((prev) => prev + 1);
        } else {
            // 마지막 단계에서는 결제 로직 등을 처리할 수 있습니다.
            alert("결제를 진행합니다.");
        }
    };

    return (
        <>
            <GlobalStyle />
            <AppContainer>
                <Navbar underline={true} />
                <BodyContainer>
                    <StepIndicator step={step} />
                    <ContentWrapper>
                        <ContentArea>
                            {step === 1 && (
                                <Step1 
                                    selectedScreening={selectedScreening}
                                    setSelectedScreening={setSelectedScreening}
                                />
                            )}
                            {step === 2 && (
                                <Step2 
                                    screeningId={selectedScreening?.id} 
                                    counts={counts}
                                    setCounts={setCounts}
                                    selectedSeats={selectedSeats}
                                    setSelectedSeats={setSelectedSeats}
                                />
                            )}
                            {step === 3 && (
                                <Step3
                                    screeningInfo={selectedScreening}
                                    personCounts={counts}
                                    seatInfo={selectedSeats}
                                />
                            )}
                        </ContentArea>
                        <ButtonArea>
                            {/* 마지막 단계에서는 버튼 텍스트를 '결제하기' 등으로 변경 가능 */}
                            <NextButton onClick={handleNext}>
                                {step < 3 ? '다음 단계' : '결제하기'}
                            </NextButton>
                        </ButtonArea>
                    </ContentWrapper>
                </BodyContainer>
            </AppContainer>
        </>
    );
}

// --- STYLED COMPONENTS ---

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #fff;
`;

const BodyContainer = styled.main`
  display: flex;
  flex: 1;
  margin: 20px 8%;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  min-height: 0; /* 자식 요소의 높이가 부모를 넘어가지 않도록 설정 */
`;

const ButtonArea = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 20px 30px;
  border-top: 1px solid #f0f0f0;
`;

const NextButton = styled.button`
  padding: 12px 35px;
  color: white;
  font-size: 16px;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: linear-gradient(45deg, #3c8de2, #66A3F2);
  box-shadow: 0 4px 15px rgba(0, 115, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(0, 115, 255, 0.3);
  }
`;

export default BookingPage;