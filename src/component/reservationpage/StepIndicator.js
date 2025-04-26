import styled from "styled-components";

const StepIndicator = () => {
    return (
        <Container>
            <Step active>step1. 상영시간</Step>
            <Step>step2. 인원/좌석</Step>
            <Step>step3. 결제</Step>
        </Container>
    )
}
export default StepIndicator;
const Container = styled.div`
  width: 150px;
  background: #f8f8f8;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-right:1px solid black;
`;

const Step = styled.div`
    height: 200px;
    text-align:center;
    display:flex;
    align-items:center;
    justify-content:center;
  font-weight: ${({ active }) => (active ? "bold" : "normal")};
  color: ${({ active }) => (active ? "white" : "black")};
  background-color: ${({ active }) => (active ? "#ff4757" : "white")};
    border:1px solid black;
  `;