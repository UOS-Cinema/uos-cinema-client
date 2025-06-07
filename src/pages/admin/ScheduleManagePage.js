import React, { useState, useMemo } from "react";
import styled, { createGlobalStyle } from "styled-components";
import Navbar from "../../component/common/NavBar";
import TimeTable from "../../component/admin/TimeTable";
import { FaChevronLeft, FaChevronRight, FaPlus } from "react-icons/fa";

// --- 목업 데이터 ---
const sampleMovies = [
    { id: 1, title: "야당", runningTime: 135, ageRating: "15" },
    { id: 2, title: "승부", runningTime: 120, ageRating: "12" },
    { id: 3, title: "바이러스", runningTime: 110, ageRating: "All" },
    { id: 4, title: "플로우즈", runningTime: 95, ageRating: "15" },
    { id: 5, title: "파과", runningTime: 140, ageRating: "18" },
    { id: 6, title: "거룩한 밤", runningTime: 125, ageRating: "18" },
];
const sampleTheaters = [
    { theaterId: 1, name: "C-Language" },
    { theaterId: 2, name: "C++" },
    { theaterId: 3, name: "Kotlin" },
    { theaterId: 4, name: "TS" },
];
// --- 목업 데이터 끝 ---

const ScheduleManagePage = () => {
    const [selectedMovie, setSelectedMovie] = useState(sampleMovies[0]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date()); // 선택된 날짜 상태 추가
    const [selectedTheater, setSelectedTheater] = useState(sampleTheaters[0]);

    // 한 주씩 날짜를 이동하는 함수
    const moveDate = (amount) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(prev.getDate() + amount);
            return newDate;
        });
    };

    // 현재 날짜 기준 7일치 날짜 배열 생성
    const weekDates = useMemo(() => {
        const startOfWeek = new Date(currentDate);
        // Reset time part to compare dates only
        startOfWeek.setHours(0, 0, 0, 0);
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            return date;
        });
    }, [currentDate]);

    return (
        <>
            <GlobalStyle />
            <PageWrapper>
                <Navbar underline={true} />
                <MainContainer>
                    <Header>
                        <Title>상영일정 관리</Title>
                        <SaveButton><FaPlus /> 새 일정 저장</SaveButton>
                    </Header>
                    <ScheduleContainer>
                        {/* 좌측: 영화 목록 */}
                        <LeftPanel>
                            {sampleMovies.map((movie) => (
                                <MovieItem
                                    key={movie.id}
                                    active={selectedMovie?.id === movie.id}
                                    onClick={() => setSelectedMovie(movie)}
                                >
                                    <AgeRating rating={movie.ageRating}>{movie.ageRating}</AgeRating>
                                    {movie.title}
                                </MovieItem>
                            ))}
                        </LeftPanel>

                        {/* 중앙: 날짜 및 상영관 선택 */}
                        <MiddlePanel>
                            <DateSelector>
                                <ArrowButton onClick={() => moveDate(-7)}><FaChevronLeft /></ArrowButton>
                                <MonthLabel>{currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월</MonthLabel>
                                <ArrowButton onClick={() => moveDate(7)}><FaChevronRight /></ArrowButton>
                            </DateSelector>
                            <DateList>
                                {weekDates.map((date, idx) => (
                                    <DateItem key={idx} onClick={() => setSelectedDate(date)} weekday={date.getDay()}>
                                        <div>{['일', '월', '화', '수', '목', '금', '토'][date.getDay()]}</div>
                                        <Day selected={date.toDateString() === selectedDate.toDateString()}>{date.getDate()}</Day>
                                    </DateItem>
                                ))}
                            </DateList>
                            <TheaterList>
                                {sampleTheaters.map((theater) => (
                                    <TheaterItem
                                        key={theater.theaterId}
                                        selected={selectedTheater?.theaterId === theater.theaterId}
                                        onClick={() => setSelectedTheater(theater)}
                                    >
                                        상영관 {theater.theaterId}<span>({theater.name}관)</span>
                                    </TheaterItem>
                                ))}
                            </TheaterList>
                        </MiddlePanel>

                        {/* 우측: 타임테이블 */}
                        <RightPanel>
                            <TimeTable selectedMovie={selectedMovie} />
                        </RightPanel>
                    </ScheduleContainer>
                </MainContainer>
            </PageWrapper>
        </>
    );
};

export default ScheduleManagePage;

// --- STYLED COMPONENTS ---
const primaryBlue = '#1E6DFF';
const red = '#e03131';
const darkGray = '#343a40';
const mediumGray = '#dee2e6';
const lightGray = '#f8f9fa';

const GlobalStyle = createGlobalStyle`body, html { background-color: ${lightGray}; }`;

const PageWrapper = styled.div` min-height: 100vh; `;

const MainContainer = styled.div`
  width: 90%;
  max-width: 1800px;
  margin: 40px auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 900;
  color: ${darkGray};
`;

const SaveButton = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background-color: ${primaryBlue};
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
`;

const ScheduleContainer = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr 350px;
  gap: 24px;
  height: 80vh;
`;

const Panel = styled.div`
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.06);
  padding: 16px;
  overflow-y: auto;
`;

const LeftPanel = styled(Panel)``;
const MiddlePanel = styled(Panel)``;
const RightPanel = styled(Panel)``;

const AgeRating = styled.span`
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 28px;
    height: 28px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 700;
    color: white;
    background-color: ${({ rating }) =>
        rating === "All" ? '#57a773' :
        rating === "12" ? '#4aa7c6' :
        rating === "15" ? '#e6b345' : '#d94b4b'};
`;

const MovieItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  color: ${({ active }) => (active ? primaryBlue : darkGray)};
  background-color: ${({ active }) => (active ? '#eff6ff' : 'transparent')};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${lightGray};
  }
`;

const DateSelector = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px 16px;
`;

const MonthLabel = styled.span`
  font-size: 20px;
  font-weight: 700;
`;

const ArrowButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  color: ${darkGray};
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  line-height: 1;
  &:hover { background-color: ${lightGray}; }
`;

const DateList = styled.div`
  display: flex;
  justify-content: space-around;
  padding-bottom: 20px;
  border-bottom: 1px solid ${mediumGray};
  margin-bottom: 20px;
`;

const DateItem = styled.div`
  text-align: center;
  cursor: pointer;
  
  div:first-child {
      font-size: 14px;
      margin-bottom: 8px;
      color: ${({ weekday }) => {
        if (weekday === 0) return red; // Sunday
        if (weekday === 6) return primaryBlue; // Saturday
        return '#868e96'; // Other days
      }};
  }
`;

const Day = styled.div`
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    font-weight: 700;
    color: ${({ selected }) => (selected ? '#fff' : darkGray)};
    background-color: ${({ selected }) => (selected ? primaryBlue : 'transparent')};
`;

const TheaterList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const TheaterItem = styled.div`
    padding: 16px;
    border-radius: 8px;
    border: 1px solid ${({ selected }) => (selected ? primaryBlue : mediumGray)};
    background-color: ${({ selected }) => (selected ? '#eff6ff' : 'transparent')};
    color: ${({ selected }) => (selected ? primaryBlue : darkGray)};
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;

    span {
        font-weight: 500;
        color: #868e96;
    }
`;
