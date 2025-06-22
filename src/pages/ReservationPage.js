import React, { useState } from 'react';
import styled from 'styled-components';

// 컴포넌트 임포트
import GlobalStyle from '../globalStyle';
import Navbar from '../component/common/NavBar';
import StepIndicator from '../component/reservationpage/StepIndicator';
import Step1 from '../component/reservationpage/Step1';
import Step2 from '../component/reservationpage/Step2';
import Step3 from'../component/reservationpage/Step3';
import { useReservationState } from '../context/ReservationContext';

function BookingPage() {
    // 1. step 상태를 BookingPage에서 직접 관리
    const [step, setStep] = useState(1);

    // 2. Context에서는 예매 데이터만 가져옴
    const { selectedScreening, counts, selectedSeats } = useReservationState();
    
    // handleNext 함수는 이제 Context의 dispatch가 아닌 로컬 setStep을 사용
    const handleNext = () => {
        if (step === 1 && !selectedScreening) {
            alert("상영일정을 선택해주세요.");
            return;
        }

        if (step === 2) {
            const totalPeople = Object.values(counts).reduce((s, c) => s + c, 0);
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
            // 3. dispatch 대신 setStep으로 상태 변경
            setStep((prev) => prev + 1);
        } else {
            alert("결제를 진행합니다.");
        }
    };

    return (
        <>
            <GlobalStyle />
            <AppContainer>
                <Navbar underline={true} />
                <BodyContainer>
                    {/* 로컬 step 상태를 StepIndicator에 전달 */}
                    <StepIndicator step={step} />
                    <ContentWrapper>
                        <ContentArea>
                            {/* 로컬 step 상태에 따라 컴포넌트를 조건부 렌더링 */}
                            {step === 1 && <Step1 />}
                            {step === 2 && <Step2 />}
                            {step === 3 && <Step3 />}
                        </ContentArea>
                        <ButtonArea>
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
  min-height: 0;
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