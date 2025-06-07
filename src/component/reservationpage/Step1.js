import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

// 컴포넌트가 나타날 때의 페이드인 애니메이션
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Step1 = () => {
    // 상태 관리: 선택된 영화, 날짜, 시간
    const [selectedMovie, setSelectedMovie] = useState("야당");
    const [selectedDate, setSelectedDate] = useState(new Date().getDate().toString());
    const [selectedTime, setSelectedTime] = useState(null);

    // 목업 데이터
    const movies = ["야당", "승부", "바이러스", "플로우즈"];
    const times = ["14:45", "15:40", "16:30", "17:20", "18:25", "20:30", "23:15", "23:30"];
    const daysKor = ["일", "월", "화", "수", "목", "금", "토"];
    const today = new Date();

    // 오늘부터 7일간의 날짜 배열을 생성하는 함수
    const getDateRange = (startDate) => {
        const year = startDate.getFullYear();
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            return {
                year: year,
                month: date.getMonth() + 1,
                day: date.getDate().toString(),
                weekday: daysKor[date.getDay()],
            };
        });
    };
    
    // 날짜 범위 상태 관리
    const [dateRange, setDateRange] = useState(getDateRange(today));

    // 날짜 이동 핸들러 (이전/다음)
    const handleDateNav = (direction) => {
        const newStartDate = new Date(dateRange[0].year, dateRange[0].month - 1, dateRange[0].day);
        newStartDate.setDate(newStartDate.getDate() + direction);
        setDateRange(getDateRange(newStartDate));
    };

    return (
        <Step1Container>
            {/* 왼쪽: 영화 선택 패널 */}
            <MovieSelection>
                <SectionTitle>영화 선택</SectionTitle>
                {movies.map((movie, idx) => (
                    <MovieItem
                        key={idx}
                        active={selectedMovie === movie}
                        onClick={() => {
                            setSelectedMovie(movie);
                            setSelectedTime(null); // 영화 변경 시 시간 선택 초기화
                        }}
                    >
                        <StyledImg src={`https://placehold.co/24x24/E8A2A2/FFFFFF?text=15`} alt="15세 이용가" />
                        {movie}
                    </MovieItem>
                ))}
            </MovieSelection>

            {/* 오른쪽: 날짜 및 시간 선택 패널 */}
            <TimeSelection>
                <DateSelectionWrapper>
                    <MonthLabel>{dateRange[0]?.month}월</MonthLabel>
                    <DateList>
                        <ArrowButton onClick={() => handleDateNav(-1)}>{"<"}</ArrowButton>
                        {dateRange.map((dateObj, idx) => (
                            <DateItem
                                key={idx}
                                active={selectedDate === dateObj.day}
                                weekday={dateObj.weekday}
                                onClick={() => setSelectedDate(dateObj.day)}
                            >
                                <DateDay active={selectedDate === dateObj.day}>{dateObj.day}</DateDay>
                                <DateWeekday>{dateObj.weekday}</DateWeekday>
                            </DateItem>
                        ))}
                        <ArrowButton onClick={() => handleDateNav(1)}>{">"}</ArrowButton>
                    </DateList>
                </DateSelectionWrapper>

                <MovieListWithTime>
                    {selectedMovie ? (
                        <MovieItemWithTime key={selectedMovie}>
                            <MovieTitleWithTime>
                                <StyledImg src={`https://placehold.co/24x24/E8A2A2/FFFFFF?text=15`} alt="15세 이용가" />
                                {selectedMovie}
                            </MovieTitleWithTime>
                            <Theater>상영관 1 • 2D</Theater>
                            <TimeList>
                                {times.map((time, idx) => (
                                    <TimeItem
                                        key={idx}
                                        active={selectedTime === time}
                                        onClick={() => setSelectedTime(time)}
                                    >
                                        <TimeItemSchedule active={selectedTime === time}>{time}</TimeItemSchedule>
                                        <TimeItemInfo active={selectedTime === time}>188/206</TimeItemInfo>
                                    </TimeItem>
                                ))}
                            </TimeList>
                        </MovieItemWithTime>
                    ) : (
                        <Placeholder>영화를 먼저 선택해주세요.</Placeholder>
                    )}
                </MovieListWithTime>
            </TimeSelection>
        </Step1Container>
    );
};


// --- STYLED COMPONENTS ---

const Step1Container = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  width: 100%;
  height: 100%;
  animation: ${fadeIn} 0.6s ease-out;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #343a40;
  padding: 20px 24px;
  margin: 0;
  border-bottom: 1px solid #e9ecef;
`;

const MovieSelection = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-right: 1px solid #e9ecef;
  padding-top: 16px;
`;

const MovieItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: ${({ active }) => (active ? "700" : "500")};
  color: ${({ active }) => (active ? "#1E6DFF" : "#343a40")};
  background: ${({ active }) => (active ? "#eff6ff" : "transparent")};
  border-right: ${({ active }) => (active ? "3px solid #1E6DFF" : "3px solid transparent")};
  transition: all 0.3s ease;

  &:hover {
    background: #f8f9fa;
    border-right-color: #66A3F2;
  }
`;

const StyledImg = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 4px;
`;

const TimeSelection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  background-color: #f8f9fa;
  overflow-y: auto;
`;

const DateSelectionWrapper = styled.div`
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
`;

const DateList = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

const ArrowButton = styled.div`
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #868e96;
  transition: all 0.3s ease;

  &:hover {
    background-color: #f1f3f5;
    color: #343a40;
  }
`;

const MonthLabel = styled.div`
  font-size: 22px;
  font-weight: 900;
  text-align: center;
  margin-bottom: 20px;
  color: #343a40;
`;

const DateItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 70px;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 8px;
  gap: 8px;
  color: ${({ weekday }) => (weekday === "토" ? "#007bff" : weekday === "일" ? "#dc3545" : "#495057")};

  &:hover {
      background-color: #f8f9fa;
  }
`;

const DateWeekday = styled.div`
    font-size: 14px;
    font-weight: 500;
`;

const DateDay = styled.div`
    font-size: 20px;
    font-weight: 700;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    background: ${({ active }) => (active ? "#66A3F2" : "transparent")};
    color: ${({ active }) => (active ? "white" : "inherit")};
`;

const MovieListWithTime = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const MovieItemWithTime = styled.div`
  width: 100%;
  background-color: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  animation: ${fadeIn} 0.5s ease;
`;

const MovieTitleWithTime = styled.div`
  font-size: 20px;
  font-weight: 700;
  display: flex;
  gap: 8px;
  align-items: center;
  color: #212529;
`;

const Theater = styled.div`
  color: #868e96;
  margin: 4px 0 20px 0;
  font-size: 14px;
  font-weight: 500;
`;

const TimeList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
`;

const TimeItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background: ${({ active }) => (active ? "#1E6DFF" : "#f8f9fa")};
  border: 1px solid ${({ active }) => (active ? "#1E6DFF" : "#dee2e6")};
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
    border-color: #66A3F2;
  }
`;

const TimeItemSchedule = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${({ active }) => (active ? "white" : "#343a40")};
  transition: color 0.3s ease;
`;

const TimeItemInfo = styled.div`
  font-size: 12px;
  color: ${({ active }) => (active ? "rgba(255, 255, 255, 0.8)" : "#868e96")};
  transition: color 0.3s ease;
`;

const Placeholder = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 18px;
    color: #adb5bd;
    font-weight: 500;
    text-align: center;
    animation: ${fadeIn} 0.5s ease;
`;


export default Step1;
