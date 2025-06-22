import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import Navbar from "../component/common/NavBar";

// 영화 목업 데이터 (실제 앱에서는 이 목록도 API로 받아올 수 있습니다)
const sampleMovies = [
    { id: 1, title: "야당", runningTime: 135, ageRating: "15" },
    { id: 2, title: "승부", runningTime: 120, ageRating: "12" },
    { id: 3, title: "바이러스", runningTime: 110, ageRating: "All" },
    { id: 4, title: "플로우즈", runningTime: 95, ageRating: "15" },
    { id: 5, title: "파과", runningTime: 140, ageRating: "18" },
    { id: 6, title: "거룩한 밤", runningTime: 125, ageRating: "18" },
];

const SchedulePage = () => {
    // --- 상태 관리 ---
    const [movies] = useState(sampleMovies);
    const [selectedMovieId, setSelectedMovieId] = useState(null); // '전체' 보기를 위해 null로 시작
    const [selectedDate, setSelectedDate] = useState(new Date());
    
    // API로부터 받은 상영 정보를 가공하여 저장할 상태
    const [groupedScreenings, setGroupedScreenings] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // --- 날짜 관련 로직 ---
    const daysKor = ["일", "월", "화", "수", "목", "금", "토"];
    const [dateRange, setDateRange] = useState([]);

    // 컴포넌트가 처음 마운트될 때, 오늘부터 7일간의 날짜 범위를 설정
    useEffect(() => {
        const getInitialDateRange = () => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return Array.from({ length: 7 }, (_, i) => {
                const date = new Date(today);
                date.setDate(today.getDate() + i);
                return date;
            });
        };
        setDateRange(getInitialDateRange());
    }, []);

    // 날짜 이동 핸들러
    const handleDateNav = (direction) => {
        const newStartDate = new Date(dateRange[0]);
        newStartDate.setDate(newStartDate.getDate() + direction);
        setDateRange(Array.from({ length: 7 }, (_, i) => {
            const date = new Date(newStartDate);
            date.setDate(newStartDate.getDate() + i);
            return date;
        }));
    };

    // --- API 연동 로직 ---
    // selectedDate가 변경될 때마다 해당 날짜의 전체 스케줄을 다시 불러옴
    useEffect(() => {
        const fetchAllScreeningsForDate = async () => {
            setLoading(true);
            setError(null);
            setGroupedScreenings({});

            const dateString = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;
            const params = new URLSearchParams({ date: dateString });

            try {
                // movieId 없이 date만 파라미터로 보내 해당 날짜의 모든 상영 정보를 요청
                const response = await fetch(`/screenings?${params.toString()}`);
                if (!response.ok) throw new Error('상영 정보를 불러오는 데 실패했습니다.');
                const responseData = await response.json();

                // 서버에서 받은 데이터를 화면에 표시하기 좋은 형태로 가공 (그룹화)
                // [ { screening1 }, { screening2 }, ... ] 형태의 배열을
                // { movieId: { theaters: { theaterKey: { times: [...] } } } } 형태의 객체로 변환
                const screeningsByMovie = responseData.data.reduce((acc, screening) => {
                    const movie = movies.find(m => m.id === screening.movieId);
                    if (!movie) return acc;

                    // 1. 영화 ID로 1차 그룹화
                    if (!acc[screening.movieId]) {
                        acc[screening.movieId] = {
                            movieId: screening.movieId,
                            movieTitle: screening.movieTitle,
                            ageRating: movie.ageRating,
                            theaters: {}
                        };
                    }
                    
                    // 2. 영화 그룹 내에서 '상영관-타입'으로 2차 그룹화
                    const theaterKey = `${screening.theaterId}-${screening.screenType}`;
                    if (!acc[screening.movieId].theaters[theaterKey]) {
                        acc[screening.movieId].theaters[theaterKey] = {
                            theaterId: screening.theaterId,
                            theaterName: `상영관 ${screening.theaterId}`,
                            screenType: screening.screenType,
                            times: [],
                        };
                    }
                    
                    // 3. 최종 그룹에 시간 정보 추가
                    acc[screening.movieId].theaters[theaterKey].times.push({
                        time: `${screening.startTime[3].toString().padStart(2, '0')}:${screening.startTime[4].toString().padStart(2, '0')}`,
                        availableSeats: screening.availableSeats,
                        totalSeats: screening.totalSeats
                    });
                    return acc;
                }, {});
                
                setGroupedScreenings(screeningsByMovie);
            } catch (err) {
                setError(err.message);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllScreeningsForDate();
    }, [selectedDate, movies]);
    
    // 왼쪽 패널에서 선택된 영화에 따라 보여줄 스케줄을 클라이언트 사이드에서 필터링
    const filteredScreenings = selectedMovieId
        ? (groupedScreenings[selectedMovieId] ? { [selectedMovieId]: groupedScreenings[selectedMovieId] } : {})
        : groupedScreenings;

    return (
        <Container>
            <Navbar underline={false}/>
            <BodyContainer>
                <ScheduleViewContainer>
                    {/* 왼쪽: 영화 선택 패널 */}
                    <MovieSelection>
                        <SectionTitle>영화</SectionTitle>
                        <MovieItem
                            active={selectedMovieId === null}
                            onClick={() => setSelectedMovieId(null)}
                        >
                            전체 영화
                        </MovieItem>
                        {movies.map((movie) => (
                            <MovieItem
                                key={movie.id}
                                active={selectedMovieId === movie.id}
                                onClick={() => setSelectedMovieId(movie.id)}
                            >
                                <StyledImg src={`https://placehold.co/24x24/E8A2A2/FFFFFF?text=${movie.ageRating}`} alt={`${movie.ageRating}세 이용가`} />
                                {movie.title}
                            </MovieItem>
                        ))}
                    </MovieSelection>

                    {/* 오른쪽: 날짜 및 시간 선택 패널 */}
                    <TimeSelection>
                        <DateSelectionWrapper>
                            <MonthLabel>{dateRange[0]?.getFullYear()}년 {dateRange[0]?.getMonth() + 1}월</MonthLabel>
                            <DateList>
                                <ArrowButton onClick={() => handleDateNav(-7)}>{"<"}</ArrowButton>
                                {dateRange.map((date, idx) => (
                                    <DateItem
                                        key={idx}
                                        weekday={daysKor[date.getDay()]}
                                        onClick={() => setSelectedDate(date)}
                                    >
                                        <DateDay active={selectedDate.toDateString() === date.toDateString()}>{date.getDate()}</DateDay>
                                        <DateWeekday>{daysKor[date.getDay()]}</DateWeekday>
                                    </DateItem>
                                ))}
                                <ArrowButton onClick={() => handleDateNav(7)}>{">"}</ArrowButton>
                            </DateList>
                        </DateSelectionWrapper>

                        <MovieListWithTime>
                            {loading ? (
                                <Placeholder>상영 정보를 불러오는 중...</Placeholder>
                            ) : error ? (
                                <Placeholder>{error}</Placeholder>
                            ) : Object.keys(filteredScreenings).length > 0 ? (
                                // 바깥쪽 map: 영화별로 순회
                                Object.values(filteredScreenings).map(movieGroup => movieGroup && (
                                    <div key={movieGroup.movieId}>
                                        {/* 안쪽 map: 한 영화의 상영관/타입별로 순회 */}
                                        {Object.values(movieGroup.theaters).map(group => (
                                            <MovieItemWithTime key={`${movieGroup.movieId}-${group.theaterId}-${group.screenType}`}>
                                                <MovieTitleWithTime>
                                                    <StyledImg src={`https://placehold.co/24x24/E8A2A2/FFFFFF?text=${movieGroup.ageRating}`} alt={`${movieGroup.ageRating}세 이용가`} />
                                                    {movieGroup.movieTitle}
                                                </MovieTitleWithTime>
                                                <Theater>{group.theaterName} • {group.screenType}</Theater>
                                                <TimeList>
                                                    {/* 가장 안쪽 map: 시간대별로 순회 */}
                                                    {group.times.map((screeningTime, index) => (
                                                        <TimeItem key={index}>
                                                            <TimeItemSchedule>{screeningTime.time}</TimeItemSchedule>
                                                            <TimeItemInfo>
                                                                {screeningTime.availableSeats}/{screeningTime.totalSeats}
                                                            </TimeItemInfo>
                                                        </TimeItem>
                                                    ))}
                                                </TimeList>
                                            </MovieItemWithTime>
                                        ))}
                                    </div>
                                ))
                            ) : (
                                <Placeholder>선택하신 날짜에 상영 정보가 없습니다.</Placeholder>
                            )}
                        </MovieListWithTime>
                    </TimeSelection>
                </ScheduleViewContainer>
            </BodyContainer>
        </Container>
    );
};

export default SchedulePage;

// --- STYLED COMPONENTS ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8f9fa;
`;
const BodyContainer = styled.div`
    display: flex;
    flex: 1;
    margin:0 100px;
    padding-top: 20px;
`;
const ScheduleViewContainer = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  width: 100%;
  height: calc(100vh - 100px); 
  animation: ${fadeIn} 0.6s ease-out;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  background-color: #fff;
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
  overflow-y: auto;
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
  flex-shrink: 0;
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
  flex-shrink: 0;
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
  gap: 20px;
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
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
`;
const TimeItemSchedule = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #343a40;
`;
const TimeItemInfo = styled.div`
  font-size: 12px;
  color: #868e96;
`;
const Placeholder = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    font-size: 18px;
    color: #adb5bd;
    font-weight: 500;
    text-align: center;
    animation: ${fadeIn} 0.5s ease;
    background: #fff;
    border-radius: 12px;
    min-height: 200px;
`;