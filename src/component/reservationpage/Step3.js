import React, { useState, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaRegCreditCard, FaMoneyBillTransfer, FaPiggyBank, FaAngleRight } from "react-icons/fa6";


// 목업 데이터 (실제 앱에서는 props나 context API로 전달받아야 함)
const MOCK_DATA = {
    availablePoints: 5000,
    productPrice: 45000,
    discountAmount: 2000,
};

// 결제수단 데이터 배열
const paymentMethods = {
    card: [
        { id: 'toss', name: 'Toss', description: '최대 2,000원 할인' },
        { id: 'kakao', name: 'Kakaopay', description: '최대 3,000원 할인' },
        { id: 'naver', name: 'NaverPay', description: '최대 1,000원 할인' },
    ],
    transfer: [
        { bank: '예시은행', account: '123-456-7890', holder: '홍길동' }
    ],
    saved: [
        { id: 'saved-card-1', name: '신한카드(1234)' },
        { id: 'saved-account-1', name: '우리은행(5678)' },
    ]
};


// Step3 메인 컴포넌트
const Step3 = () => {
    // 탭 상태 및 선택된 결제수단 상태 관리
    const [selectedTab, setSelectedTab] = useState("card");
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [usedPoints, setUsedPoints] = useState(0);

    // 최종 결제 금액 계산
    const finalPrice = useMemo(() => {
        const priceAfterDiscount = MOCK_DATA.productPrice - MOCK_DATA.discountAmount;
        const priceAfterPoints = priceAfterDiscount - usedPoints;
        return priceAfterPoints > 0 ? priceAfterPoints : 0;
    }, [usedPoints]);
    
    // 포인트 입력 핸들러
    const handlePointChange = (e) => {
        let value = parseInt(e.target.value, 10) || 0;
        if (value < 0) value = 0;
        if (value > MOCK_DATA.availablePoints) value = MOCK_DATA.availablePoints;
        setUsedPoints(value);
    };


    return (
        <Container>
            {/* 좌측: 결제 옵션 선택 영역 */}
            <PaymentOptionsSection>
                {/* 포인트 사용 */}
                <SectionBox>
                    <SectionTitle>포인트 사용</SectionTitle>
                    <PointContainer>
                        <InputWrapper>
                             <StyledInput 
                                type="number"
                                placeholder="0" 
                                value={usedPoints === 0 ? '' : usedPoints}
                                onChange={handlePointChange}
                            />
                            <span>P</span>
                        </InputWrapper>
                        <AvailablePoints>
                            사용 가능: {MOCK_DATA.availablePoints.toLocaleString()} P
                        </AvailablePoints>
                    </PointContainer>
                </SectionBox>

                {/* 결제 수단 선택 */}
                <SectionBox>
                     <SectionTitle>결제 수단</SectionTitle>
                     <PaymentContainer>
                        <TabList>
                            <TabButton isSelected={selectedTab === "card"} onClick={() => setSelectedTab("card")}>카드결제</TabButton>
                            <TabButton isSelected={selectedTab === "transfer"} onClick={() => setSelectedTab("transfer")}>계좌이체</TabButton>
                            <TabButton isSelected={selectedTab === "saved"} onClick={() => setSelectedTab("saved")}>등록된 결제수단</TabButton>
                        </TabList>
                        <TabContent>
                            {selectedTab === 'card' && paymentMethods.card.map(p => (
                                <PaymentItem key={p.id} isSelected={selectedPayment === p.id} onClick={() => setSelectedPayment(p.id)}>
                                    <FaRegCreditCard />
                                    <div>
                                        <PaymentName>{p.name}</PaymentName>
                                        <PaymentDescription>{p.description}</PaymentDescription>
                                    </div>
                                </PaymentItem>
                            ))}
                             {selectedTab === 'transfer' && paymentMethods.transfer.map((p, i) => (
                                <AccountInfo key={i}>
                                    <FaMoneyBillTransfer />
                                     <div>
                                        <p><strong>은행명:</strong> {p.bank}</p>
                                        <p><strong>계좌번호:</strong> {p.account}</p>
                                        <p><strong>예금주:</strong> {p.holder}</p>
                                    </div>
                                </AccountInfo>
                            ))}
                            {selectedTab === 'saved' && paymentMethods.saved.map(p => (
                                <PaymentItem key={p.id} isSelected={selectedPayment === p.id} onClick={() => setSelectedPayment(p.id)}>
                                    <FaPiggyBank />
                                    <PaymentName>{p.name}</PaymentName>
                                </PaymentItem>
                            ))}
                        </TabContent>
                    </PaymentContainer>
                </SectionBox>
            </PaymentOptionsSection>
            
            {/* 우측: 최종 결제 정보 요약 */}
            <SummarySection>
                <SummaryTitle>최종 결제 정보</SummaryTitle>
                <SummaryContent>
                    <InfoRow>
                        <InfoLabel>상품 금액</InfoLabel>
                        <InfoValue>{MOCK_DATA.productPrice.toLocaleString()}원</InfoValue>
                    </InfoRow>
                     <InfoRow>
                        <InfoLabel>할인 금액</InfoLabel>
                        <InfoValue>-{MOCK_DATA.discountAmount.toLocaleString()}원</InfoValue>
                    </InfoRow>
                     <InfoRow>
                        <InfoLabel>포인트 사용</InfoLabel>
                        <InfoValue>-{usedPoints.toLocaleString()}원</InfoValue>
                    </InfoRow>
                </SummaryContent>
                <FinalPriceRow>
                    <FinalPriceLabel>총 결제금액</FinalPriceLabel>
                    <FinalPriceValue>{finalPrice.toLocaleString()}원</FinalPriceValue>
                </FinalPriceRow>
                <PayButton>결제하기</PayButton>
            </SummarySection>
        </Container>
    );
};


// --- STYLED COMPONENTS ---

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  gap: 24px;
  padding: 24px;
  background-color: #f8f9fa;
  animation: ${fadeIn} 0.6s ease-out;
`;

const PaymentOptionsSection = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SummarySection = styled.div`
  flex: 2;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.07);
  padding: 24px;
  display: flex;
  flex-direction: column;
`;

const SectionBox = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.07);
  overflow: hidden;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  padding: 16px 24px;
  margin: 0;
  border-bottom: 1px solid #e9ecef;
`;

const PointContainer = styled.div`
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const InputWrapper = styled.div`
    display: flex;
    align-items: center;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    padding-right: 12px;
    transition: all 0.2s ease;
    &:focus-within {
        border-color: #1E6DFF;
        box-shadow: 0 0 0 2px rgba(30, 109, 255, 0.2);
    }
    span {
        font-weight: 700;
        color: #868e96;
    }
`;

const StyledInput = styled.input`
  padding: 12px;
  font-size: 16px;
  border: none;
  outline: none;
  background: transparent;
  width: 150px;
`;

const AvailablePoints = styled.div`
  font-size: 14px;
  color: #868e96;
`;

const PaymentContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TabList = styled.div`
  display: flex;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
`;

const TabButton = styled.button`
  flex: 1;
  padding: 14px 0;
  font-size: 16px;
  font-weight: ${({ isSelected }) => (isSelected ? "700" : "500")};
  color: ${({ isSelected }) => (isSelected ? "#1E6DFF" : "#495057")};
  cursor: pointer;
  background-color: transparent;
  border: none; 
  border-bottom: 3px solid ${({ isSelected }) => (isSelected ? "#1E6DFF" : "transparent")};
  transition: all 0.3s ease;

  &:hover {
    color: #1E6DFF;
    background-color: #f1f3f5;
  }
`;

const TabContent = styled.div`
  padding: 12px 24px;
`;

const PaymentItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid ${({ isSelected }) => (isSelected ? "#1E6DFF" : "#e9ecef")};
  background-color: ${({ isSelected }) => (isSelected ? "#eff6ff" : "white")};
  margin-bottom: 12px;
  transition: all 0.2s ease;

  svg {
    font-size: 24px;
    color: ${({ isSelected }) => (isSelected ? "#1E6DFF" : "#868e96")};
  }

  &:hover {
    border-color: #1E6DFF;
  }
`;

const PaymentName = styled.div`
    font-size: 16px;
    font-weight: 700;
`;
const PaymentDescription = styled.div`
    font-size: 14px;
    color: #868e96;
`;

const AccountInfo = styled.div`
    padding: 16px;
    background-color: #f8f9fa;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 16px;
    p {
        margin: 4px 0;
        font-size: 15px;
    }
    svg {
        font-size: 24px;
        color: #868e96;
    }
`;

const SummaryTitle = styled.h3`
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 24px 0;
    padding-bottom: 16px;
    border-bottom: 1px solid #e9ecef;
`;

const SummaryContent = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const InfoRow = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 16px;
`;
const InfoLabel = styled.span`
    color: #555;
`;
const InfoValue = styled.span`
    font-weight: 500;
    color: #333;
`;

const FinalPriceRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 20px 0;
    margin-top: 20px;
    border-top: 1px solid #e9ecef;
`;
const FinalPriceLabel = styled.span`
    font-size: 18px;
    font-weight: 700;
    color: #333;
`;
const FinalPriceValue = styled.span`
    font-size: 28px;
    font-weight: 900;
    color: #1E6DFF;
`;

const PayButton = styled.button`
    width: 100%;
    padding: 16px 0;
    font-size: 18px;
    font-weight: 700;
    color: white;
    background: linear-gradient(45deg, #3c8de2, #1E6DFF);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(30, 109, 255, 0.3);
    }
`;


export default Step3;
