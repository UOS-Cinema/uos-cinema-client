import React, { useState } from "react";
import styled from "styled-components";
import StepIndicator from "../component/reservationpage/StepIndicator";
import Navbar from "../component/common/NavBar";
import Step1 from "../component/reservationpage/Step1";
import Step2 from "../component/reservationpage/Step2";
import Step3 from "../component/reservationpage/Step3";
const BookingPage = () => {
    const [step, setStep] = useState(1);
    const handleNext = () => {
        setStep((prev) => prev + 1);
    };
    return (
        <Container>
            <Navbar underline={false}/>
            <BodyContainer>
                <StepIndicator step={step} />
                <ContentArea>
                    {step === 1 && (
                        <Step1 />
                    )}
                    {step === 2 && (
                        <Step2/>
                    )}
                    {step === 3 && (
                        <Step3/>
                    )}
                </ContentArea>
                <ButtonArea>
                    {step < 3 && (
                        <NextButton onClick={handleNext}>
                            Next
                        </NextButton>
                    )}
                </ButtonArea>
            </BodyContainer>

        </Container>
    );
};

export default BookingPage;

// 스타일
const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const BodyContainer = styled.div`
    display: flex;
    flex: 1;
`;

const ContentArea = styled.div`
  display: flex;
  flex: 1;
`;

const ButtonArea = styled.div`
    display: flex;
    justify-content: center;
    
`;

const NextButton = styled.button`
  padding: 10px 30px;
  color: white;
  font-size: 18px;
  border: none;
  cursor: pointer;
  background-color: red;

  &:hover {
    background-color: darkred;
  }`
;