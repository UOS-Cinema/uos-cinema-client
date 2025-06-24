import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useReservationState, useReservationDispatch } from '../../context/ReservationContext';

// --- 추가된 부분: 등급 아이콘 표시를 위한 헬퍼 함수 및 스타일 ---
// 등급 표시 텍스트 변환 함수
const getRatingDisplay = (rating) => {
    switch (rating) {
        case 'ALL':
        case 'All':
        case '전체 관람가':
            return 'All';
        case 'TWELVE':
        case '12':
        case '12세 이상 관람가':
            return '12';
        case 'FIFTEEN':
        case '15':
        case '15세 이상 관람가':
            return '15';
        case 'NINETEEN':
        case '18':
        case '청소년 관람불가':
            return '19';
        default:
            return 'All';
    }
};
// 등급 아이콘 스타일 컴포넌트
const AgeRating = styled.span`
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 28px;
    height: 28px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 700;
    color: white;
    flex-shrink: 0;
    background-color: ${({ rating }) => {
        switch (rating) {
            case 'ALL':
            case 'All':
            case '전체 관람가':
                return '#57a773'; // 초록색
            case 'TWELVE':
            case '12':
            case '12세 이상 관람가':
                return '#4aa7c6'; // 파란색
            case 'FIFTEEN':
            case '15':
            case '15세 이상 관람가':
                return '#e6b345'; // 노란색
            case 'NINETEEN':
            case '18':
            case '청소년 관람불가':
                return '#d94b4b'; // 빨간색
            default:
                return '#868e96'; // 회색
        }
    }};
`;


const Step1 = () => {
    const { selectedScreening } = useReservationState();
    const dispatch = useReservationDispatch();

    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date()); 
    const [groupedScreenings, setGroupedScreenings] = useState({}); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const daysKor = ["일", "월", "화", "수", "목", "금", "토"];
    const [dateRange, setDateRange] = useState([]);

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

    const handleDateNav = (direction) => {
        const newStartDate = new Date(dateRange[0]);
        newStartDate.setDate(newStartDate.getDate() + direction);
        setDateRange(Array.from({ length: 7 }, (_, i) => {
            const date = new Date(newStartDate);
            date.setDate(newStartDate.getDate() + i);
            return date;
        }));
    };
    
    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/movies/ranking?page=0&size=8');
                if (!response.ok) throw new Error('영화 목록을 불러오는 데 실패했습니다.');
                const responseData = await response.json();
                const fetchedMovies = responseData.data?.content || [];
                setMovies(fetchedMovies);
                console.log(responseData.data.content);
                if (fetchedMovies.length > 0) {
                    setSelectedMovie(fetchedMovies[0]);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, []);

    useEffect(() => {
        if (!selectedMovie || !selectedDate) return;

        const fetchScreenings = async () => {
            setLoading(true);
            setError(null);
            setGroupedScreenings({}); 
            dispatch({ type: 'SELECT_SCREENING', payload: null });
            dispatch({ type: 'RESET_SELECTION' });

            const dateString = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;
            const params = new URLSearchParams({ movieId: selectedMovie.id, date: dateString });

            try {
                const response = await fetch(`/screenings?${params.toString()}`);
                if (!response.ok) throw new Error('상영 정보를 불러오는 데 실패했습니다.');
                const responseData = await response.json();
                console.log(responseData.data);
                const screeningsByGroup = (responseData.data || []).reduce((acc, screening) => {
                    const key = `${screening.theaterId}-${screening.screenType}`;
                    if (!acc[key]) {
                        acc[key] = {
                            theaterId: screening.theaterId,
                            theaterName: `상영관 ${screening.theaterId}`,
                            screenType: screening.screenType,
                            times: [],
                        };
                    }
                    acc[key].times.push({
                        id: screening.id,
                        time: `${screening.startTime[3].toString().padStart(2, '0')}:${screening.startTime[4].toString().padStart(2, '0')}`,
                        availableSeats: screening.availableSeats,
                        totalSeats: screening.totalSeats
                    });
                    return acc;
                }, {});
                
                setGroupedScreenings(screeningsByGroup);
                console.log(screeningsByGroup);
            } catch (err) {
                setError(err.message);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchScreenings();
    }, [selectedMovie, selectedDate, dispatch]);

    const handleTimeSelect = (screeningTime, group) => {
        const fullScreeningInfo = {
            ...screeningTime,
            theaterId: group.theaterId,
            theaterName: group.theaterName,
            screenType: group.screenType,
            movieTitle: selectedMovie.title,
            rating: selectedMovie.rating,
            fullDate: selectedDate,
        };
        dispatch({ type: 'SELECT_SCREENING', payload: fullScreeningInfo });
    };

    return (
        <Step1Container>
            <MovieSelection>
                <SectionTitle>영화 선택</SectionTitle>
                {loading && movies.length === 0 ? <PlaceholderText>영화를 불러오는 중...</PlaceholderText> :
                    movies.map((movie) => (
                        <MovieItem
                            key={movie.id}
                            active={selectedMovie?.id === movie.id}
                            onClick={() => setSelectedMovie(movie)}
                        >
                            {/* StyledImg 대신 rating 컴포넌트 사용 */}
                            <AgeRating rating={movie.rating}>{getRatingDisplay(movie.rating)}</AgeRating>
                            {movie.title}
                        </MovieItem>
                    ))
                }
            </MovieSelection>

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
                    ) : Object.keys(groupedScreenings).length > 0 ? (
                        Object.values(groupedScreenings).map(group => (
                            <MovieItemWithTime key={`${group.theaterId}-${group.screenType}`}>
                                <MovieTitleWithTime>
                                    {/* StyledImg 대신 rating 컴포넌트 사용 */}
                                    <AgeRating rating={getRatingDisplay(selectedMovie?.rating)}>{getRatingDisplay(selectedMovie?.rating)}</AgeRating>
                                    {selectedMovie?.title}
                                </MovieTitleWithTime>
                                <Theater>{group.theaterName} • {group.screenType}</Theater>
                                <TimeList>
                                    {group.times.map((screeningTime) => (
                                        <TimeItem
                                            key={screeningTime.id}
                                            active={selectedScreening?.id === screeningTime.id}
                                            onClick={() => handleTimeSelect(screeningTime, group)}
                                        >
                                            <TimeItemSchedule active={selectedScreening?.id === screeningTime.id}>{screeningTime.time}</TimeItemSchedule>
                                            <TimeItemInfo active={selectedScreening?.id === screeningTime.id}>
                                                {screeningTime.availableSeats}/{screeningTime.totalSeats}
                                            </TimeItemInfo>
                                        </TimeItem>
                                    ))}
                                </TimeList>
                            </MovieItemWithTime>
                        ))
                    ) : (
                        <Placeholder>선택하신 날짜에 상영 정보가 없습니다.</Placeholder>
                    )}
                </MovieListWithTime>
            </TimeSelection>
        </Step1Container>
    );
};

export default Step1;

// --- STYLED COMPONENTS ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;
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
// StyledImg는 더 이상 사용되지 않으므로 제거 가능합니다.
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
    background: #fff;
    border-radius: 12px;
    min-height: 200px;
`;
const PlaceholderText = styled.div`
    padding: 20px;
    text-align: center;
    color: #868e96;
`;
