import styled from "styled-components";
import { useState } from "react";
import age15 from '../../asset/age15.png';

const Step1 = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedMovieWithTime, setSelectedMovieWithTime] = useState(null);
  const movies = ["야당", "승부", "바이러스", "플로우즈"];
  const times = ["14:45", "15:40", "16:30", "17:20", "18:25", "20:30", "23:15", "23:30"];
  const today = new Date();
  const daysKor = ["일", "월", "화", "수", "목", "금", "토"];

  // 현재 날짜부터 7일치 날짜 배열 생성
  const getDateRange = (startDate) => {
    const year = startDate.getFullYear();  // startDate의 연도 추출
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i); // 날짜 조정
      return {
        year: year,                        // 연도를 포함
        day: date.getDate().toString(),     // 날짜
        weekday: daysKor[date.getDay()],    // 요일
        month: date.getMonth() + 1,         // 월 (0부터 시작하므로 +1)
      };
    });
  };
  const [dateRange, setDateRange] = useState(getDateRange(today));
  const handlePrevWeek = () => {
    const firstDate = dateRange[0];
    const { year, month, day } = firstDate;
    const newStartDate = new Date(year, month - 1, day);
    newStartDate.setDate(newStartDate.getDate() - 1);
    setDateRange(getDateRange(newStartDate));
  };

  const handleNextWeek = () => {
    const firstDate = dateRange[0];
    const { year, month, day } = firstDate;
    const newStartDate = new Date(year, month - 1, day);
    newStartDate.setDate(newStartDate.getDate() + 1);
    setDateRange(getDateRange(newStartDate));
  };

  return (
    <Container>
      <MovieSelection>
        <Title>영화</Title>
        {movies.map((movie, idx) => (
          <MovieItem
            key={idx}
            active={selectedMovie === movie}
            onClick={() => setSelectedMovie(movie)}
          >
            <StyledImg src={age15} />{movie}
          </MovieItem>
        ))}
      </MovieSelection>
      <TimeSelection>
        <Title>시간</Title>
        <MonthLabel>{dateRange[0]?.month}월</MonthLabel>

        <DateList>
          <ArrowButton onClick={handlePrevWeek}>{"<"}</ArrowButton>
          {dateRange.map((dateObj, idx) => {
            // today 객체 생성 (년, 월, 일만 비교)
            const todayDate = new Date();
            todayDate.setHours(0, 0, 0, 0);  // 시간을 00:00:00으로 설정하여 날짜만 비교

            // dateObj를 새로운 Date 객체로 변환
            const dateToCompare = new Date(dateObj.year, dateObj.month - 1, dateObj.day);
            dateToCompare.setHours(0, 0, 0, 0);  // dateObj도 시간을 00:00:00으로 설정

            const isToday = dateToCompare.getTime() === todayDate.getTime();

            return (
              <DateItem
                key={idx}
                active={selectedDate === dateObj.day}
                weekday={dateObj.weekday}
                onClick={() => setSelectedDate(dateObj.day)}
              >
                <div>{dateObj.day}</div>
                <div>{dateObj.weekday}</div>
                {isToday && <TodayLabel>오늘</TodayLabel>}
              </DateItem>
            );
          })}
          <ArrowButton onClick={handleNextWeek}>{">"}</ArrowButton>
        </DateList>
        <MovieListWithTime>

          {movies.map((movie, idx) => (
            <MovieItemWithTime key={idx}>
              <MovieTitleWithTime><StyledImg src={age15} />{movie}</MovieTitleWithTime>
              <Theater>상영관1 - 2D</Theater>
              <TimeList>
                {times.map((time, idx) => (
                  <TimeItem
                    key={idx}
                    active={selectedTime === time && selectedMovieWithTime === movie}
                    onClick={() => { setSelectedTime(time); setSelectedMovieWithTime(movie); }}
                  >
                    <TimeItemSchedule>{time}</TimeItemSchedule>
                    <TimeItemInfo>188/206
                    </TimeItemInfo>
                  </TimeItem>
                ))}
              </TimeList>
            </MovieItemWithTime>
          ))}

        </MovieListWithTime>

      </TimeSelection>
    </Container>
  );
};

const StyledImg = styled.img`
  width: 25px;
  height: 25px;
  border-radius: 5px;
  margin: 5px 10px;
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
`;

const TimeSelection = styled.div`
  display:flex;
  align-items:center;
  flex-direction:column;
   &:first-of-type {
    border-right: 10px solid black;
  }
`;

const Title = styled.h2`
  width: 100%;
  background-color:#1D79F2;;
  color: white;
  text-align: center;
  font-size: 20px;
  height:40px;
  margin-top: 0;
  margin-bottom: 0;
  padding-top:7px;
 
`;

const MovieSelection = styled.div`
  display: flex;
  flex-direction: column;
  border-right: 1px solid gray;
  align-items: start;
`;

const MovieItem = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  background: ${({ active }) => (active ? "#1E6DFF" : "#fff")};
  color: ${({ active }) => (active ? "white" : "black")};
  border-bottom: 1px solid #ccc;
  cursor: pointer;
  text-align: center;
  padding:7px 0;
  font-size: 16px;
  font-weight: ${({ active }) => (active ? "bold" : "600")};
  transition: background 0.3s, color 0.3s, font-weight 0.3s;
  width: 100%;
  &:first-of-type {
    border-top: 1px solid #ccc;
  }
  &:hover {
    background: ${({ active }) => (active ? "#1E6DFF" : "#f0f0f0")};
  }
`;

const TodayLabel = styled.div`
  font-size: 10px;
  color: #888;
  position: absolute;   /* 부모 요소를 기준으로 위치 조정 */

`;

const DateList = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  overflow-x: auto;
  padding: 10px 0;
  position: relative;
  height:100px;
`;

const ArrowButton = styled.div`
  font-size: 30px;
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
  display: flex;
  text-align:center;
  align-items: center;
  justify-content: center;
  width:30px;
  height:30px;
  &:hover {
    background-color: #ddd;
  }
`;

const MonthLabel = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  display:flex;
  jusify-content:center;
`;

const DateItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 70px;
  cursor: pointer;
  transition: all 0.3s;

  > div:first-child {
    font-size: 18px;
    background: ${({ active }) => (active ? "black" : "transparent")};
    color: ${({ active, weekday }) => {
      if (active) return "white";
      if (weekday === "토") return "blue";
      if (weekday === "일") return "red";
      return "black";
    }};
    font-weight: ${({ active }) => (active ? "bold" : "normal")};
    border-radius: 50%;
    width: 40px;
    height: 40px;
    text-align: center;
    padding-top: 10px;
  }
`;


const MovieListWithTime = styled.div`
  display: flex;
  flex-direction:column;
`;
const MovieTitleWithTime = styled.div`
  font-size:20px;
  display:flex;
  text-algin:center;
  align-items:center;
  font-size:16px;
  font-weight:600;
  margin:3px 10px;
`;
const MovieItemWithTime = styled.div`
  border:1px solid #ccc;
  border-radius:15px;
  margin: 10px 0;
  
`;
const Theater = styled.div`
  color:gray;
  margin:0 20px;
  font-size:12px;

`
const TimeList = styled.div`
  margin:15px 20px;
  display: flex;
  flex-direction:row;
  gap: 10px;
  display: grid;
  grid-template-columns: repeat(5, 1fr); 
`;
const TimeItem = styled.div`
  padding: 10px;
  background: ${({ active }) => (active ? "#ffe5e5" : "#fff")};
  border: 1px solid #ccc;
  cursor: pointer;
  border-radius:10px;
  
`;
const TimeItemSchedule = styled.div`
  font-size:16px;
  font-weight:bold;
`;
const TimeItemInfo = styled.div`
  font-size:12px;

`;
export default Step1;
