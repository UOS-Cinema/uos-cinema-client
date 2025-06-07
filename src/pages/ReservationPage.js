import React, { useState } from 'react';
import styled from 'styled-components';

// 컴포넌트 임포트
import GlobalStyle from '../globalStyle';
import Navbar from '../component/common/NavBar';
import StepIndicator from '../component/reservationpage/StepIndicator';
import Step1 from '../component/reservationpage/Step1';
import Step2 from '../component/reservationpage/Step2';
import Step3 from'../component/reservationpage/Step3';

function BookingPage() {
    // 현재 예매 단계를 관리하는 state
    const [step, setStep] = useState(1);

    // 다음 단계로 이동하는 핸들러
    const handleNext = () => {
        if (step < 3) {
            setStep((prev) => prev + 1);
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
                            {step === 1 && <Step1 />}
                            {step === 2 && <Step2 />}
                            {step === 3 && <Step3 />}
                        </ContentArea>
                        <ButtonArea>
                            {step < 3 && (
                                <NextButton onClick={handleNext}>
                                    다음 단계
                                </NextButton>
                            )}
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
