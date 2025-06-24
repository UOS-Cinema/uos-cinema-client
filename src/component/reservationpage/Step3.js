import React, { useState, useMemo, useEffect, useContext } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaRegCreditCard, FaMoneyBillTransfer } from "react-icons/fa6"; // FaPiggyBank 아이콘 제거
import { useReservationState } from '../../context/ReservationContext';
import { useCustomerTypes } from '../../context/CustomerTypeContext';
import { useScreenTypes } from '../../context/ScreenTypeContext';
import { useCardCompanies } from '../../context/CardCompanyContext';
import { useBanks } from '../../context/BankContext';
import { UserContext } from '../../context/UserContext';
// import { processPayment } from '../../api/paymentApi';
// import { getCurrentPoints } from '../../api/pointApi';

// 고객 유형 영문 -> 한글 변환 헬퍼
const translateCustomerType = (type) => {
    switch (type) {
        case 'ADULT': return '성인';
        case 'TEEN': return '청소년';
        case 'CHILD': return '어린이';
        case 'SENIOR': return '경로';
        case 'ELDERLY': return '경로';
        case 'DISCOUNTED': return '우대';
        default: return type;
    }
};

const Step3 = () => {
    // --- Context에서 데이터 가져오기 ---
    const { user } = useContext(UserContext);
    const { screenType, counts, reservationId, selectedSeats, screeningId, theaterId } = useReservationState();
    const { customerTypes } = useCustomerTypes();
    const { screenTypes } = useScreenTypes();
    const { cardCompanies } = useCardCompanies();
    const { banks } = useBanks();

    // --- 로컬 상태 관리 ---
    const [selectedTab, setSelectedTab] = useState("card");
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [usedPoints, setUsedPoints] = useState(0);
    const [paymentDiscount, setPaymentDiscount] = useState(0);
    const [availablePoints, setAvailablePoints] = useState(0);
    const [pointsLoading, setPointsLoading] = useState(true);
    const [paymentLoading, setPaymentLoading] = useState(false);

    // --- 포인트 정보 API 페칭 ---
    useEffect(() => {
        if (!user?.accessToken) {
            setPointsLoading(false);
            return;
        }

        const fetchUserPoints = async () => {
            setPointsLoading(true);
            try {
                const response = await fetch('/members/points', {
                    headers: { 'Authorization': `Bearer ${user.accessToken}` },
                });
                if (!response.ok) throw new Error('포인트 정보를 불러오지 못했습니다.');
                const responseData = await response.json();
                setAvailablePoints(responseData.data || 0);
            } catch (err) {
                console.error("Failed to fetch points:", err);
            } finally {
                setPointsLoading(false);
            }
        };

        fetchUserPoints();
    }, [user]);

    // --- 가격 및 할인 계산 ---
    const originalPrice = useMemo(() => {
        const screenTypeData = screenTypes.find(st => st.type === screenType);
        const basePrice = screenTypeData?.price || 0;
        if (basePrice === 0 || !customerTypes || customerTypes.length === 0) return 0;
        return Object.entries(counts).reduce((sum, [type, count]) => {
            const customerTypeData = customerTypes.find(ct => ct.type === type);
            const discountAmount = customerTypeData?.discountAmount || 0;
            const finalPricePerTicket = basePrice - discountAmount;
            return sum + (finalPricePerTicket * count);
        }, 0);
    }, [counts, screenType, screenTypes, customerTypes]);

    const finalPrice = useMemo(() => {
        const priceAfterDiscount = originalPrice - paymentDiscount;
        const priceAfterPoints = priceAfterDiscount - usedPoints;
        return priceAfterPoints > 0 ? priceAfterPoints : 0;
    }, [originalPrice, paymentDiscount, usedPoints]);
    
    // --- 핸들러 함수 ---
    const handlePointChange = (e) => {
        let value = parseInt(e.target.value, 10) || 0;
        const maxPoints = originalPrice - paymentDiscount;
        if (value < 0) value = 0;
        if (value > availablePoints) value = availablePoints;
        if (value > maxPoints) value = maxPoints;
        setUsedPoints(value);
    };

    const handlePaymentSelect = (method) => {
        setSelectedPayment(method);
        setPaymentDiscount(method.discountAmount || 0);
    };

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
        setSelectedPayment(null);
        setPaymentDiscount(0);
    };

    // --- 결제 처리 함수 ---
    const handlePayment = async () => {
        console.log('Payment attempt - reservationId:', reservationId);
        console.log('Selected payment:', selectedPayment);
        console.log('Selected tab:', selectedTab);
        
        if (!selectedPayment && selectedTab !== "transfer") {
            alert('결제 수단을 선택해주세요.');
            return;
        }

        if (!reservationId) {
            console.error('No reservationId available');
            alert('예매 정보가 없습니다. 다시 시도해주세요.');
            return;
        }

        setPaymentLoading(true);
        
        try {
            const paymentData = {
                reservationId: reservationId,
                customerCount: counts,
                paymentMethod: selectedTab === "card" ? "CARD" : "BANK",
                affiliateName: selectedPayment?.name || (selectedTab === "transfer" && banks.length > 0 ? banks[0].name : ""),
                usedPoint: usedPoints
            };

            const response = await fetch('/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.accessToken}`
                },
                body: JSON.stringify(paymentData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '결제 처리에 실패했습니다.');
            }

            const responseData = await response.json();
            alert('결제가 완료되었습니다!');
            // 결제 완료 후 리다이렉트 또는 다음 단계로 이동
            window.location.href = '/mypage?tab=tickets';
                
        } catch (error) {
            console.error('Payment error:', error);
            alert('결제 처리 중 오류가 발생했습니다: ' + (error.message || '알 수 없는 오류'));
        } finally {
            setPaymentLoading(false);
        }
    };

    return (
        <Container>
            <PaymentOptionsSection>
                <SectionBox>
                    <SectionTitle>포인트 사용</SectionTitle>
                    <PointContainer>
                        <InputWrapper>
                             <StyledInput 
                                type="number"
                                placeholder="0" 
                                value={usedPoints === 0 ? '' : usedPoints}
                                onChange={handlePointChange}
                                disabled={pointsLoading}
                             />
                            <span>P</span>
                        </InputWrapper>
                        <AvailablePoints>
                            {pointsLoading ? "조회 중..." : `사용 가능: ${availablePoints.toLocaleString()} P`}
                        </AvailablePoints>
                    </PointContainer>
                </SectionBox>

                <SectionBox>
                     <SectionTitle>결제 수단</SectionTitle>
                     <PaymentContainer>
                        <TabList>
                            <TabButton isSelected={selectedTab === "card"} onClick={() => handleTabChange("card")}>카드결제</TabButton>
                            <TabButton isSelected={selectedTab === "transfer"} onClick={() => handleTabChange("transfer")}>계좌이체</TabButton>
                        </TabList>
                        <TabContent>
                            {selectedTab === 'card' && cardCompanies.map(p => (
                                <PaymentItem key={p.name} isSelected={selectedPayment?.name === p.name} onClick={() => handlePaymentSelect(p)}>
                                    <FaRegCreditCard />
                                    <div>
                                        <PaymentName>{p.name}</PaymentName>
                                        <PaymentDescription>최대 {p.discountAmount.toLocaleString()}원 할인</PaymentDescription>
                                    </div>
                                </PaymentItem>
                            ))}
                             {selectedTab === 'transfer' && banks.map((p, i) => (
                                <AccountInfo key={i}>
                                    <FaMoneyBillTransfer />
                                     <div>
                                        <p><strong>은행명:</strong> {p.name}</p>
                                        <p><strong>계좌번호:</strong> 123-456-7890 (예시)</p> 
                                        <p><strong>예금주:</strong> 시네마천국 (예시)</p>
                                     </div>
                                </AccountInfo>
                            ))}
                        </TabContent>
                     </PaymentContainer>
                </SectionBox>
            </PaymentOptionsSection>
            
            <SummarySection>
                <SummaryTitle>최종 결제 정보</SummaryTitle>
                {process.env.NODE_ENV === 'development' && (
                    <DebugInfo>
                        예매 ID: {reservationId || 'None'}
                    </DebugInfo>
                )}
                <SummaryContent>
                    <InfoRow>
                        <InfoLabel>상품 금액</InfoLabel>
                        <InfoValue>{originalPrice.toLocaleString()}원</InfoValue>
                    </InfoRow>
                     <InfoRow>
                        <InfoLabel>결제 할인</InfoLabel>
                        <InfoValue>-{paymentDiscount.toLocaleString()}원</InfoValue>
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
                <PayButton onClick={handlePayment} disabled={paymentLoading}>
                    {paymentLoading ? '결제 처리 중...' : '결제하기'}
                </PayButton>
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
  padding: 24px;
  padding-right: 16px;
  max-height: 250px;
  overflow-y: auto;
  min-height:250px;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ced4da;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
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
    margin-bottom:15px;
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
    
    &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(30, 109, 255, 0.3);
    }
    
    &:disabled {
        background: #ced4da;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }
`;

const DebugInfo = styled.div`
    background: #fffbf0;
    border: 1px solid #ffd93d;
    border-radius: 4px;
    padding: 8px 12px;
    margin-bottom: 16px;
    font-size: 12px;
    color: #856404;
`;

export default Step3;
