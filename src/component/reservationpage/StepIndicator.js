import React from 'react';
import styled from 'styled-components';

const StepIndicator = ({ step }) => {
    return (
        <StepIndicatorContainer>
            <Step active={step === 1} finished={step > 1}>
                <StepNumber active={step === 1} finished={step > 1}>STEP 1</StepNumber>
                <StepTitle>상영시간</StepTitle>
            </Step>
            <Step active={step === 2} finished={step > 2}>
                <StepNumber active={step === 2} finished={step > 2}>STEP 2</StepNumber>
                <StepTitle>인원/좌석</StepTitle>
            </Step>
            <Step active={step === 3} finished={step > 3}>
                <StepNumber active={step === 3} finished={step > 3}>STEP 3</StepNumber>
                <StepTitle>결제</StepTitle>
            </Step>
        </StepIndicatorContainer>
    );
};


// --- STYLED COMPONENTS ---

const StepIndicatorContainer = styled.aside`
  width: 220px;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  border-right: 1px solid #e9ecef;
`;

const Step = styled.div`
  padding: 30px 25px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 5px;
  position: relative;
  transition: all 0.4s ease;
  font-weight: ${({ active }) => (active ? "700" : "500")};
  color: ${({ active, finished }) => (active ? "#1E6DFF" : finished ? "#343a40" : "#adb5bd")};
  
  /* 활성화된 스텝 왼쪽에 표시되는 파란색 바 */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: ${({ active }) => (active ? "60%" : "0")};
    width: 4px;
    background-color: #1E6DFF;
    border-radius: 0 4px 4px 0;
    transition: all 0.4s ease;
  }
`;

const StepNumber = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${({ active, finished }) => (active ? "#1E6DFF" : finished ? "#868e96" : "#ced4da")};
`;

const StepTitle = styled.span`
  font-size: 18px;
`;


export default StepIndicator;
