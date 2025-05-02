// src/component/mypage/PointInfo.jsx

import React from "react";
import styled from "styled-components";

const PointInfo = () => {
  // 샘플 데이터
  const pointHistory = [
    {
      id: 1,
      type: "earn", // 적립
      movieTitle: "인터스텔라",
      bookingNumber: "A123456",
      paymentNumber:"ASD12312",
      date: "2025-04-20",
      pointChange: 5000,
    },
    {
      id: 2,
      type: "use", // 사용
      movieTitle: "듄: 파트2",
      bookingNumber: "B789012",
      paymentNumber:"HDJAS123",
      date: "2025-04-22",
      pointChange: -3000,
    },
    {
      id: 3,
      type: "earn",
      movieTitle: "라라랜드",
      bookingNumber: "C345678",
      paymentNumber:"VSDAS231",
      date: "2025-04-25",
      pointChange: 4000,
    },
  ];

  // 현재 포인트 잔액 계산
  const currentPoint = pointHistory.reduce((acc, item) => acc + item.pointChange, 0);

  return (
    <div>
      <Title>포인트 정보</Title>
      <CurrentPoint>현재 포인트: {currentPoint.toLocaleString()}P</CurrentPoint>
      <HistoryList>
        {pointHistory
          .sort((a, b) => new Date(b.date) - new Date(a.date)) // 최신순 정렬
          .map((item) => (
            <HistoryItem key={item.id} type={item.type}>
              <div>
                <strong>{item.movieTitle}</strong> (예매번호: {item.bookingNumber} | 결제번호: {item.paymentNumber})
              </div>
              <div>{item.date}</div>
              <PointChange type={item.type}>
                {item.type === "earn" ? "+" : ""}
                {item.pointChange.toLocaleString()}P
              </PointChange>
            </HistoryItem>
          ))}
      </HistoryList>
    </div>
  );
};

export default PointInfo;

// 스타일
const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
`;

const CurrentPoint = styled.div`
  font-size: 20px;
  margin-bottom: 30px;
  font-weight: bold;
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;

`;

const HistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid #ccc;
`;
const PointChange = styled.div`
  font-size: 18px;
  color: ${({ type }) => (type === "earn" ? "#007bff" : "red")}; // earn이면 파란색 (#007bff)
  font-weight: bold;
`;

