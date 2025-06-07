import React from "react";
import styled from "styled-components";

const PointInfo = () => {
    // 샘플 데이터
    const pointHistory = [
        { id: 1, type: "earn", movieTitle: "인터스텔라", bookingNumber: "A123456", paymentNumber: "ASD12312", date: "2025-04-20", pointChange: 5000 },
        { id: 2, type: "use", movieTitle: "듄: 파트2", bookingNumber: "B789012", paymentNumber: "HDJAS123", date: "2025-04-22", pointChange: -3000 },
        { id: 3, type: "earn", movieTitle: "라라랜드", bookingNumber: "C345678", paymentNumber: "VSDAS231", date: "2025-04-25", pointChange: 4000 },
    ];

    const currentPoint = pointHistory.reduce((acc, item) => acc + item.pointChange, 0);

    return (
        <Wrapper>
            <Title>포인트 관리</Title>
            <CurrentPointCard>
                <span>사용가능 포인트</span>
                <p>{currentPoint.toLocaleString()} P</p>
            </CurrentPointCard>
            <HistoryTable>
                <TableHeader>
                    <div>내용</div>
                    <div>날짜</div>
                    <div>포인트 변동</div>
                </TableHeader>
                <HistoryList>
                    {pointHistory.sort((a, b) => new Date(b.date) - new Date(a.date)).map((item) => (
                        <HistoryItem key={item.id}>
                            <div>
                                <strong>{item.movieTitle}</strong>
                                <span>(예매: {item.bookingNumber} | 결제: {item.paymentNumber})</span>
                            </div>
                            <div>{item.date}</div>
                            <PointChange type={item.type}>
                                {item.pointChange > 0 ? "+" : ""}{item.pointChange.toLocaleString()} P
                            </PointChange>
                        </HistoryItem>
                    ))}
                </HistoryList>
            </HistoryTable>
        </Wrapper>
    );
};

export default PointInfo;

// --- STYLED COMPONENTS ---

const primaryBlue = '#1E6DFF';
const darkGray = '#343a40';
const textGray = '#868e96';
const mediumGray = '#dee2e6';
const red = '#e03131';

const Wrapper = styled.div`
  width: 100%;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 900;
  color: ${darkGray};
  margin: 0 0 30px 0;
  padding-bottom: 20px;
  border-bottom: 1px solid ${mediumGray};
`;

const CurrentPointCard = styled.div`
  background: linear-gradient(45deg, ${primaryBlue}, #3b82f6);
  color: white;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 30px;
  
  span {
    font-size: 16px;
    opacity: 0.9;
  }
  p {
    font-size: 32px;
    font-weight: 900;
    margin: 8px 0 0;
  }
`;

const HistoryTable = styled.div`
  border: 1px solid ${mediumGray};
  border-radius: 8px;
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr 1fr;
  background-color: #f8f9fa;
  padding: 12px 20px;
  font-weight: 700;
  color: ${textGray};
  border-bottom: 1px solid ${mediumGray};
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
`;

const HistoryItem = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr 1fr;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f1f3f5;

  &:last-child {
    border-bottom: none;
  }

  strong {
    font-weight: 700;
    color: ${darkGray};
  }
  
  span {
      font-size: 14px;
      color: ${textGray};
      margin-left: 8px;
  }
`;

const PointChange = styled.div`
  font-size: 16px;
  font-weight: 700;
  text-align: right;
  color: ${({ type }) => (type === "earn" ? primaryBlue : red)};
`;
