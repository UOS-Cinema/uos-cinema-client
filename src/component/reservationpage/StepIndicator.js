import styled from "styled-components";

const StepIndicator = ({ step }) => {
  return (
    <Container>
      <Step active={step === 1} finished={step > 1}>
        <div>STEP1</div>
        <div>상영시간</div>
      </Step>
      <Step active={step === 2} finished={step > 2}>
        <div>STEP2</div>
        <div>인원/좌석</div>
      </Step>
      <Step active={step === 3} finished={step > 3}>
        <div>STEP3</div>
        <div>결제</div>
      </Step>
    </Container>
  );
};

export default StepIndicator;

const Container = styled.div`
  width: 90px;
  background-color: white;
  display: flex;
  flex-direction: column;
  border-right: 1px solid black;
`;

const Step = styled.div`
  height: 200px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-weight: ${({ active }) => (active ? "bold" : "normal")};
  color: ${({ active }) => (active ? "white" : "black")};
  background-color: ${({ active, finished }) => 
    active ? "red" : finished ? "darkred" : "white"};
  border-bottom: 1px solid black;
`;
