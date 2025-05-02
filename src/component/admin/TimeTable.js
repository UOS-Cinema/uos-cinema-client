import React, { useState } from 'react';
import styled from 'styled-components';

const sampleSchedule = [
    {
        movie: "야당",
        startTime: "12:15",
        runningTime: 135
    },
    {
        movie: "파과",
        startTime: "17:45",
        runningTime: 120
    }
];

const formatTime = (index) => {
    const totalMinutes = index * 15;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};
const getEndTime = (startTime, runningTime) => {
    const [h, m] = startTime.split(':').map(Number);
    const totalStartMinutes = h * 60 + m;
    const totalEndMinutes = totalStartMinutes + runningTime;

    const endHour = Math.floor(totalEndMinutes / 60) % 24;
    const endMinute = totalEndMinutes % 60;

    return `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
};
const timeToIndex = (time) => {
    const [h, m] = time.split(':').map(Number);
    return Math.floor((h * 60 + m) / 15);
};

const TimeTable = () => {
    const totalSlots = 96; // 24시간, 15분 단위
    const [selectedMovie, setSelectedMovie] = useState("야당");
    const [hoverStart, setHoverStart] = useState(null);
    const [hoverDuration, setHoverDuration] = useState(null);
    const [hoverText, setHoverText] = useState(null);
    const [schedule, setSchedule] = useState(sampleSchedule); // schedule state
    const [slotOccupied, setSlotOccupied] = useState(() => {
        const occupied = new Array(totalSlots).fill(false);
        schedule.forEach(item => {
            const start = timeToIndex(item.startTime);
            const length = Math.ceil(item.runningTime / 15);
            for (let i = start; i < start + length; i++) {
                occupied[i] = true;
            }
        });
        return occupied;
    });
    const handleMouseEnter = (startIndex, duration, movieTitle) => {
        setHoverStart(startIndex);
        setHoverDuration(duration);
        setHoverText(movieTitle);
    };
    const handleMouseLeave = () => {
        setHoverStart(null);
        setHoverDuration(null);
    };
    const handleSlotClick = (startIndex) => {
       
        const startTime = formatTime(startIndex); // hoverStart를 시간 형식으로 변환
        const duration = Math.ceil(135 / 15);
        for (let i = startIndex; i < startIndex + duration; i++) {
            if (slotOccupied[i]) {
                alert("이미 영화가 존재하는 시간입니다.");
                return;
            }
        }
        const newMovie = {
            movie: "야당",  // 임의로 "야당" 영화 정보 추가
            startTime: startTime,
            runningTime: 135  // 고정된 러닝타임, 예시로 135분
        };
        setSchedule((prevSchedule) => [...prevSchedule, newMovie]); // 새로운 영화 추가
        setSlotOccupied(prev => {
            const updated = [...prev];
            for (let i = startIndex; i < startIndex + duration; i++) {
                updated[i] = true;
            }
            return updated;
        });
    };
    return (
        <TimeTableWrapper>
            <ScheduleColumn>
                {[...Array(totalSlots)].map((_, i) => {
                    const showTime = i % 4 === 0;
                    return (
                        <TimeSlotRow
                            key={i}
                            onMouseEnter={() => handleMouseEnter(i, 9, "야당")}  // 임의로 1슬롯씩 hover
                            onMouseLeave={handleMouseLeave}
                            onClick={() => handleSlotClick(hoverStart)}
                        >
                            <TimeText>{showTime ? formatTime(i) : ''}</TimeText>
                            <SlotBox hoverStart={hoverStart} hoverDuration={hoverDuration} startIndex={i} hoverText={hoverText}/>
                        </TimeSlotRow>
                    );
                })}

                {schedule.map((schedule, i) => {
                    const startIndex = timeToIndex(schedule.startTime);
                    const duration = Math.ceil(schedule.runningTime / 15);
                    const endTime = getEndTime(schedule.startTime, schedule.runningTime);
                    return (
                        <MovieBlock
                            key={i}
                            isSelected={selectedMovie === schedule.movie}
                            startIndex={startIndex}
                            duration={duration}
                        >
                            <div>{schedule.movie}</div>
                            <div>{schedule.startTime}~{endTime}</div>
                        </MovieBlock>
                    );
                })}
            </ScheduleColumn>

        </TimeTableWrapper>
    );
};



const TimeTableWrapper = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
`;







const ScheduleColumn = styled.div`
  position: relative;
  width: 200px;
`;

const TimeSlotRow = styled.div`
  display: flex;
  align-items: center;
  height: 15px;
  position: relative;
`;

const TimeText = styled.div`
  width: 50px;
  font-size: 11px;
  color: #666;
  text-align: right;
  padding-right: 5px;
`;


const SlotBox = styled.div`
  flex: 1;
  height: 100%;

  position: relative;
  background-color: ${({ hoverStart, hoverDuration, startIndex, duration }) =>
        hoverStart !== null && hoverStart <= startIndex && hoverStart + hoverDuration > startIndex
            ? "rgba(255, 99, 71, 0.7)"  // hover 시 색상 변화
            : "transparent"};
  border: ${({ hoverStart, hoverDuration, startIndex, duration }) =>
        hoverStart !== null && hoverStart <= startIndex && hoverStart + hoverDuration > startIndex
            ? "none"  // hover 시 색상 변화
            : "1px solid #eee"};
  &::after {
    content: ${({ hoverText, hoverStart,startIndex }) => hoverText&&hoverStart===startIndex ? `"${hoverText}"` : '""'};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 12px;
    font-weight: bold;
  }
`;

const MovieBlock = styled.div`
  position: absolute;
  left: 55px; /* 시간 텍스트 너비 + padding 고려 */
  width: calc(100% - 55px);
  height: ${({ duration }) => duration * 15}px;
  top: ${({ startIndex }) => startIndex * 15}px;
  background-color:${({ isSelected }) => (isSelected ? "#1E6DFF" : "rgba(128, 128, 128, 0.6)")};

  color: white;
  font-size: 12px;


  border-radius: 4px;
  box-sizing: border-box;
`;

export default TimeTable;
