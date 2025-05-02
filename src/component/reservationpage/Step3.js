import styled from "styled-components";
import { useState } from "react";

const Step3 = () => {
  // 탭 상태 관리 (현재 선택된 탭)
  const [selectedTab, setSelectedTab] = useState("card");
    const [selectedPayment, setSelectedPayment] = useState(null);
  return (
    <Container>

      <Content>
        <Title>포인트</Title>
        <PointContainer>
          <PointLabel>사용할 포인트</PointLabel>
          <StyledInput placeholder="포인트를 입력하세요" />
          <AvailablePoints>현재 사용 가능 포인트: 3000원</AvailablePoints>
          <AvailablePoints>최소 사용 포인트: 1000원</AvailablePoints>
        </PointContainer>
      </Content>
      <Content>
        <Title>결제수단</Title>
        <PaymentContainer>
          <TabList>
            <TabButton
              isSelected={selectedTab === "card"}
              onClick={() => setSelectedTab("card")}
            >
              카드결제
            </TabButton>
            <TabButton
              isSelected={selectedTab === "transfer"}
              onClick={() => setSelectedTab("transfer")}
            >
              계좌이체
            </TabButton>
            <TabButton
              isSelected={selectedTab === "saved"}
              onClick={() => setSelectedTab("saved")}
            >
              내가 등록한 결제수단
            </TabButton>
          </TabList>
          <TabContent>
            {selectedTab === "card" && (
                <Payment onClick={()=>setSelectedPayment(1)}
                isSelected={selectedPayment===1}
                >Toss(최대 2000원 할인)</Payment>
            )}
              {selectedTab === "card" && (
                <Payment onClick={()=>setSelectedPayment(2)}
                isSelected={selectedPayment===2}
                >Kakacopay(최대 3000원 할인)</Payment>
            )}
              {selectedTab === "card" && (
                <Payment onClick={()=>setSelectedPayment(3)}
                isSelected={selectedPayment===3}
                >NaverPay(최대1000원 할인)</Payment>
            )}
            {selectedTab === "transfer" && (
              <div>
                <div>은행명: 예시은행</div>
                <div>계좌번호: 123-456-7890</div>
                <div>예금주: 홍길동</div>
              </div>
            )}
            {selectedTab === "saved" && (
              <div>
                <div>등록된 결제수단을 선택하세요.</div>
                <div>카드/계좌/포인트 등 다양한 결제 수단을 확인 가능합니다.</div>
              </div>
            )}
           
          </TabContent>
          
        </PaymentContainer>
        <TotalPaymentInfoContainer>
            <TotalPaymentInfo>적립될 포인트
                <div>3000원</div>
            </TotalPaymentInfo>
            <TotalPaymentInfo>상품 금액
            <div>30000원</div>
            </TotalPaymentInfo>
            <TotalPaymentInfo>할인 금액
            <div>2000원</div>
            </TotalPaymentInfo>
            <TotalPaymentInfo>결제 금액
            <div>25000원</div>
            </TotalPaymentInfo>
            <TotalPaymentInfo>결제하기</TotalPaymentInfo>
        </TotalPaymentInfoContainer>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;


const Content = styled.div`
  width: 100%;
  border-right: 1px solid gray;
  &:last-child:{
    display:flex;
    justify-content:space-between;
  }
`;

const Title = styled.h2`
  width: 100%;
  background-color: #1D79F2;
  color: white;
  text-align: center;
  font-size: 28px;
  height: 40px;
  margin: 0;
  padding: 10px 0;
`;

const PointContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const PointLabel = styled.label`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const StyledInput = styled.input`
  padding: 10px;
  font-size: 16px;
  margin-bottom: 10px;
  border: 1px solid gray;
  border-radius: 5px;
  width: 80%;
`;

const AvailablePoints = styled.div`
  font-size: 16px;
  color: gray;
  margin-top: 10px;
`;

const PaymentContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
const Payment = styled.div`
  padding: 12px;
  font-size: 18px;
  border-bottom: 1px solid gray;
  cursor: pointer;

  &:hover {
    background-color: #444;
    color: white;
  }

  &:active {
    background-color: #ddd; /* 선택 시 배경색 변경 */
  }

  color: ${(props) => (props.isSelected ? "black" : "#ccc")};
`;

const TabList = styled.div`
  display: flex;
  flex-direction: column;
    border-right: 1px solid gray;
    &:last-child{
    border-bottom:1px solid gray;}
`;

const TabButton = styled.button`
  width: 150px;
  padding: 12px;
  font-size: 18px;
  color: ${(props) => (props.isSelected ? "black" : "#ccc")};
  cursor: pointer;
  text-align: left;
  
  background-color:white;
  border:none; 
    border-bottom: 1px solid gray;

  &:hover {
    background-color: #444;
    color: white;
  }
`;

const TabContent = styled.div`
  flex: 1;
  font-size: 16px;
`;
const TotalPaymentInfoContainer = styled.div`
    margin-top:150px;
`;
const TotalPaymentInfo = styled.div`
    background-color:#66A3F2;
    color:white;
    display:flex;
    justify-content:space-between;
    padding:10px 30px;
    border-bottom:1px solid black;
     &:first-child {
    border-top: 1px solid black;
  }
  
  &:last-child { /* 여기 수정 */
    background-color: #0B2D59;
     justify-content:center;
  }
`;
export default Step3;
