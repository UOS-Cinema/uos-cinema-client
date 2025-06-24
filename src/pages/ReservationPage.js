import React, { useState, useContext } from 'react';
import styled from 'styled-components';

// 컴포넌트 임포트
import GlobalStyle from '../globalStyle';
import Navbar from '../component/common/NavBar';
import StepIndicator from '../component/reservationpage/StepIndicator';
import Step1 from '../component/reservationpage/Step1';
import Step2 from '../component/reservationpage/Step2';
import Step3 from '../component/reservationpage/Step3';
import { useReservationState } from '../context/ReservationContext';
import { UserContext } from '../context/UserContext'; // UserContext 추가

function BookingPage() {
    // --- 상태 관리 ---
    const [step, setStep] = useState(1);
    // Context에서 예매 데이터 가져오기
    const { selectedScreening, counts, selectedSeats } = useReservationState();
    // Context에서 사용자 인증 정보 가져오기
    const { user } = useContext(UserContext);
    // 생성된 예약 정보를 저장할 상태
    const [reservationInfo, setReservationInfo] = useState(null);

    // --- 다음 단계 이동 핸들러 (API 연동 로직 추가) ---
    const handleNext = async () => {
        // 1단계 -> 2단계 유효성 검사
        if (step === 1) {
            if (!selectedScreening) {
                alert("상영일정을 선택해주세요.");
                return;
            }
        }

        // 2단계 -> 3단계 유효성 검사 및 API 호출
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
            if (!user?.accessToken) {
                alert("로그인이 필요합니다.");
                return;
            }

            // API 요청 본문(payload) 생성
            const payload = {
                screeningId: selectedScreening.id,
                theaterId: selectedScreening.theaterId,
                seatNumbers: selectedSeats,
                customerCount: counts
            };
            console.log(payload);
            try {
                const response = await fetch('/reservations', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.accessToken}`
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || '예약 생성에 실패했습니다.');
                }

                const responseData = await response.json();
                setReservationInfo(responseData.data); // 서버로부터 받은 예약 정보 저장

            } catch (err) {
                alert(err.message);
                console.error("Reservation failed:", err);
                return; // 에러 발생 시 다음 단계로 진행하지 않음
            }
        }

        if (step < 3) {
            setStep((prev) => prev + 1);
        } else {
            // 마지막 단계에서는 결제 로직을 처리
            alert("결제를 진행합니다.");
            // 여기서 결제 API 호출 로직을 추가할 수 있습니다.
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
                            {step === 3 && <Step3 reservationInfo={reservationInfo} />}
                        </ContentArea>
                        <ButtonArea>
                            {step < 3 &&
                                <NextButton onClick={handleNext}>
                                    {step < 3 ? '다음 단계' : '결제하기'}
                                </NextButton>

                            }

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
