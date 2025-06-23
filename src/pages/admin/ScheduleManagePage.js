import React, { useState, useMemo, useEffect, useContext } from "react";
import styled, { createGlobalStyle } from "styled-components";
import Navbar from "../../component/common/NavBar";
import TimeTable from "../../component/admin/TimeTable";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { UserContext } from "../../context/UserContext";

const ScheduleManagePage = () => {
    const { user } = useContext(UserContext);

    const [movies, setMovies] = useState([]);
    const [theaters, setTheaters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedMovie, setSelectedMovie] = useState(null);
    const [selectedTheater, setSelectedTheater] = useState(null);
    const [selectedScreenType, setSelectedScreenType] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [moviesResponse, theatersResponse] = await Promise.all([
                    fetch('/movies/ranking?page=0&size=4'),
                    fetch('/theaters')
                ]);

                if (!moviesResponse.ok || !theatersResponse.ok) {
                    throw new Error('영화 또는 상영관 정보를 불러오는 데 실패했습니다.');
                }

                const moviesData = await moviesResponse.json();
                const theatersData = await theatersResponse.json();

                const fetchedMovies = moviesData.data?.content || [];
                const fetchedTheaters = theatersData.data || [];

                setMovies(fetchedMovies);
                setTheaters(fetchedTheaters);

                if (fetchedMovies.length > 0) setSelectedMovie(fetchedMovies[0]);
                if (fetchedTheaters.length > 0) {
                    setSelectedTheater(fetchedTheaters[0]);
                    if (fetchedTheaters[0].screenTypes?.length > 0) {
                        setSelectedScreenType(fetchedTheaters[0].screenTypes[0]);
                    }
                }
            } catch (err) {
                setError(err.message);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // --- !! 수정된 부분 !! ---
    // 상영관이 변경될 때만 이 효과가 실행되도록 하여, 불필요한 재실행을 방지하고 상태를 안정화합니다.
    useEffect(() => {
        if (selectedTheater && selectedTheater.screenTypes?.length > 0) {
            setSelectedScreenType(selectedTheater.screenTypes[0]);
        }
    }, [selectedTheater]);
    

    const moveDate = (amount) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(prev.getDate() + amount);
            return newDate;
        });
    };

    const weekDates = useMemo(() => {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setHours(0, 0, 0, 0);
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            return date;
        });
    }, [currentDate]);

    if (loading) return <StatusText>데이터를 불러오는 중...</StatusText>;
    if (error) return <StatusText error>{error}</StatusText>;

    return (
        <>
            <GlobalStyle />
            <PageWrapper>
                <Navbar underline={true} />
                <MainContainer>
                    <Header><Title>상영일정 관리</Title></Header>
                    <ScheduleContainer>
                        <LeftPanel>
                            {movies.map((movie) => (
                                <MovieItem key={movie.id} active={selectedMovie?.id === movie.id} onClick={() => setSelectedMovie(movie)}>
                                    <AgeRating rating={movie.rating}>{movie.rating}</AgeRating>
                                    {movie.title}
                                </MovieItem>
                            ))}
                        </LeftPanel>
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
                                {theaters.map((theater) => (
                                    <TheaterItem key={theater.id} selected={selectedTheater?.number === theater.number} onClick={() => setSelectedTheater(theater)}>
                                        상영관 {theater.id}<span>({theater.name})</span>
                                    </TheaterItem>
                                ))}
                            </TheaterList>
                            <ScreenTypeSelector>
                                {selectedTheater && selectedTheater.screenTypes?.map(type => (
                                    <ScreenTypeItem key={type} selected={selectedScreenType === type} onClick={() => setSelectedScreenType(type)}>
                                        {type}
                                    </ScreenTypeItem>
                                ))}
                            </ScreenTypeSelector>
                        </MiddlePanel>
                        <RightPanel>
                            <TimeTable 
                                selectedMovie={selectedMovie} 
                                selectedTheater={selectedTheater}
                                selectedDate={selectedDate}
                                selectedScreenType={selectedScreenType}
                                user={user}
                            />
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
const StatusText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  font-size: 20px;
  color: ${props => props.error ? red : darkGray};
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
    width: auto;
    min-width: 28px;
    height: 28px;
    padding: 0 4px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 700;
    color: white;
    background-color: ${({ rating }) =>
        rating === "ALL" ? '#57a773' :
        rating === "TWELVE" ? '#4aa7c6' :
        rating === "FIFTEEN" ? '#e6b345' : '#d94b4b'};
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
const ScreenTypeSelector = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid ${mediumGray};
`;
const ScreenTypeItem = styled.button`
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    border: 1.5px solid ${({ selected }) => (selected ? primaryBlue : mediumGray)};
    background-color: ${({ selected }) => (selected ? primaryBlue : '#fff')};
    color: ${({ selected }) => (selected ? '#fff' : darkGray)};
    transition: all 0.2s ease;

    &:hover {
        border-color: ${primaryBlue};
    }
`;
