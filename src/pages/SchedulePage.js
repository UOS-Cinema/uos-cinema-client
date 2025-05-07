import React, { useState } from "react";
import styled from "styled-components";
import StepIndicator from "../component/reservationpage/StepIndicator";
import Navbar from "../component/common/NavBar";
import Step1 from "../component/reservationpage/Step1";
import Step2 from "../component/reservationpage/Step2";
import Step3 from "../component/reservationpage/Step3";
const SchedulePage = () => {
    const [step, setStep] = useState(1);
    const handleNext = () => {
        setStep((prev) => prev + 1);
    };
    return (
        <Container>
            <Navbar underline={false}/>
            <BodyContainer>
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
  
            </BodyContainer>

        </Container>
    );
};

export default SchedulePage;

// 스타일
const Container = styled.div`
  display: flex;
  flex-direction: column;
  
`;

const BodyContainer = styled.div`
    display: flex;
    flex: 1;
    margin:0 100px;
`;

const ContentArea = styled.div`
  display: flex;
  flex: 1;
`;