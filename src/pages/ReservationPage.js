import React, { useState } from "react";
import styled from "styled-components";
import StepIndicator from "../component/reservationpage/StepIndicator";
import Navbar from "../component/common/NavBar";
const BookingPage = () => {
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    const movies = ["야당", "승부", "바이러스", "플로우즈"];
    const dates = ["21", "22", "23", "24", "25", "26", "27"];
    const times = ["14:45", "15:40", "16:30", "17:20", "18:25"];

    return (
        <Container>
            <Navbar />
            <BodyContainer>
                <StepIndicator />
                <ContentArea>
                    <MovieSelection>
                        <Title>영화</Title>
                        {movies.map((movie, idx) => (
                            <MovieItem
                                key={idx}
                                active={selectedMovie === movie}
                                onClick={() => setSelectedMovie(movie)}
                            >
                                {movie}
                            </MovieItem>
                        ))}
                    </MovieSelection>
                    <TimeSelection>
                        <Title>시간</Title>
                        <DateList>
                            {dates.map((date, idx) => (
                                <DateItem
                                    key={idx}
                                    active={selectedDate === date}
                                    onClick={() => setSelectedDate(date)}
                                >
                                    {date}
                                </DateItem>
                            ))}
                        </DateList>
                        <TimeList>
                            {times.map((time, idx) => (
                                <TimeItem
                                    key={idx}
                                    active={selectedTime === time}
                                    onClick={() => setSelectedTime(time)}
                                >
                                    {time}
                                </TimeItem>
                            ))}
                        </TimeList>
                    </TimeSelection>
                </ContentArea>

            </BodyContainer>

        </Container>
    );
};

export default BookingPage;

// 스타일
const Container = styled.div`
  display: flex;
  flex-direction:column;
`;

const BodyContainer = styled.div`
    display:flex;
`;
const ContentArea = styled.div`
  display: flex;
  flex: 1;
  padding: 20px;
  gap: 40px;
`;

const MovieSelection = styled.div`
  flex: 1;
`;

const TimeSelection = styled.div`
  flex: 1;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const MovieItem = styled.div`
  padding: 10px;
  margin-bottom: 10px;
  background: ${({ active }) => (active ? "#ffe5e5" : "#fff")};
  border: 1px solid #ccc;
  cursor: pointer;
`;

const DateList = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const DateItem = styled.div`
  padding: 10px;
  background: ${({ active }) => (active ? "#ffe5e5" : "#fff")};
  border: 1px solid #ccc;
  cursor: pointer;
`;

const TimeList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const TimeItem = styled.div`
  padding: 10px;
  background: ${({ active }) => (active ? "#ffe5e5" : "#fff")};
  border: 1px solid #ccc;
  cursor: pointer;
`;

