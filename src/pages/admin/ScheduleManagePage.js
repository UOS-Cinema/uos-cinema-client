import styled from "styled-components";
import { useState } from "react";
import age15 from '../../asset/age15.png';
import Navbar from "../../component/common/NavBar";
import { Link } from "react-router-dom";
import TimeTable from "../../component/admin/TimeTable";
// 샘플 데이터
const sampleTheaters = [
  {
    theaterId: 1,
    name: "C-Language",
    types: ["2D", "3D"],
  },
  {
    theaterId: 2,
    name: "C++",
    types: ["2D", "4D"],
  },
  {
    theaterId: 3,
    name: "Kotlin",
    types: ["2D"],
  },
  {
    theaterId: 4,
    name: "TS",
    types: ["2D", "3D"],
  },
  {
    theaterId: 5,
    name: "JS",
    types: ["2D", "4D"],
  },
  {
    theaterId: 6,
    name: "Python",
    types: ["2D"],
  },
  {
    theaterId: 7,
    name: "JAVA",
    types: ["2D", "4D"],
  },
  {
    theaterId: 8,
    name: "React",
    types: ["2D"],
  },
];
const ScheduleManagePage = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const movies = ["야당", "승부", "바이러스", "플로우즈", "파과", "거룩한 밤", "아이언맨", "위플래쉬"];

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
    <div>
      <Navbar underline={true} />
      <Strong>상영일정 관리</Strong>
      <Container>

        <MovieSelection>

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

          <TheaterUL>
            {sampleTheaters.map((theater) => (
              <TheaterLI key={theater.theaterId}
                onClick={() => setSelectedTheater(theater.theaterId)}
                isSelected={selectedTheater === theater.theaterId}>
                <div>
                  <Info>상영관{theater.theaterId} ({theater.name} 상영관)</Info>
                </div>
              </TheaterLI>
            ))}
          </TheaterUL>
        </TimeSelection>
        <TimeTable></TimeTable>
        <SaveButtonWrapper>
          <SaveButton >저장하기</SaveButton>
        </SaveButtonWrapper>
      </Container>
    </div>
  );
};


const SaveButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 10px 50px;
`;

const SaveButton = styled.button`
  background-color: #1E90FF;
  color: white;
  font-size: 16px;
  padding: 10px 20px;
  height:60px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #1C6DD0;
  }
`;
const TheaterUL = styled.ul`
  list-style: none;
  padding: 0;
  gap: 20px;
  margin: 0 20px;
`;

const TheaterLI = styled.li`
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 20px;
  margin:15px 20px;
    display: flex;
  justify-content: space-between; /* 내용과 버튼을 양쪽 끝에 배치 */
  align-items: center; /* 세로로 중앙 정렬 */
  background-color: ${({ isSelected }) => (isSelected ? '#1D79F2' : 'white')};
  &:hover {
    background-color: #0B2D59;
  }
`;

const Info = styled.div`
  margin-bottom: 8px;
  font-size: 16px;
`;



const StyledImg = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 10px;
  margin: 5px 10px;
`;
const Strong = styled.div`
  font-size:25px;
  font-weight:bold;
  margin:20px 50px;
`;
const Container = styled.div`
  display:flex;
  flex-direction:row;
  width: 100%;
  margin:0 50px;
`;

const TimeSelection = styled.div`
  display:flex;
  align-items:start;
 
  flex-direction:column;
   &:first-of-type {
    border-right: 10px solid black;
  }
`;



const MovieSelection = styled.div`
  display: flex;
  flex-direction: column;
  min-width:200px;
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
  font-size: 15px;
  font-weight: ${({ active }) => (active ? "bold" : "normal")};
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
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  display:flex;
  margin-left:20px;
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
    font-size: 15px;
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



export default ScheduleManagePage;
