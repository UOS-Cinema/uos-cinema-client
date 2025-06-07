import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiEdit, FiTrash2 } from "react-icons/fi";

// --- 목업 데이터 ---
const sampleSchedule = [
    { movie: "야당", startTime: "02:45", runningTime: 135 },
    { movie: "파과", startTime: "06:00", runningTime: 120 }
];
// --- 목업 데이터 끝 ---

// 시간 <-> 인덱스 변환 유틸리티
const formatTime = (index) => {
    const hours = Math.floor(index / 4).toString().padStart(2, '0');
    return `${hours}:00`;
};
const getEndTime = (startTime, runningTime) => {
    const [h, m] = startTime.split(':').map(Number);
    const totalEndMinutes = h * 60 + m + runningTime;
    const endHour = Math.floor(totalEndMinutes / 60) % 24;
    const endMinute = totalEndMinutes % 60;
    return `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
};
const timeToIndex = (time) => {
    const [h, m] = time.split(':').map(Number);
    return Math.floor((h * 60 + m) / 15);
};

const TimeTable = ({ selectedMovie }) => {
    const totalSlots = 96; // 24시간 * (60분 / 15분)
    const [schedule, setSchedule] = useState(sampleSchedule);
    const [slotOccupied, setSlotOccupied] = useState([]);
    const [hoverInfo, setHoverInfo] = useState({ start: null, duration: 0 });

    useEffect(() => {
        const occupied = new Array(totalSlots).fill(false);
        schedule.forEach(item => {
            const start = timeToIndex(item.startTime);
            const length = Math.ceil(item.runningTime / 15);
            for (let i = start; i < start + length; i++) {
                if (i < totalSlots) occupied[i] = true;
            }
        });
        setSlotOccupied(occupied);
    }, [schedule]);

    const handleMouseEnter = (startIndex) => {
        if (selectedMovie) {
            const duration = Math.ceil(selectedMovie.runningTime / 15);
            setHoverInfo({ start: startIndex, duration });
        }
    };
    
    const handleMouseLeave = () => setHoverInfo({ start: null, duration: 0 });

    const handleSlotClick = (startIndex) => {
        if (!selectedMovie) {
            alert("먼저 영화를 선택해주세요.");
            return;
        }
        const duration = Math.ceil(selectedMovie.runningTime / 15);
        for (let i = startIndex; i < startIndex + duration; i++) {
            if (slotOccupied[i]) {
                alert("이미 다른 상영 일정이 있는 시간대입니다.");
                return;
            }
        }
        const newSchedule = {
            movie: selectedMovie.title,
            startTime: `${Math.floor(startIndex/4).toString().padStart(2, '0')}:${(startIndex % 4 * 15).toString().padStart(2, '0')}`,
            runningTime: selectedMovie.runningTime
        };
        setSchedule(prev => [...prev, newSchedule].sort((a,b) => timeToIndex(a.startTime) - timeToIndex(b.startTime)));
    };

    return (
        <TimeTableWrapper onMouseLeave={handleMouseLeave}>
            {[...Array(totalSlots)].map((_, i) => (
                <TimeSlotRow key={i}>
                    {i % 4 === 0 && <TimeText>{formatTime(i)}</TimeText>}
                    <SlotBox onMouseEnter={() => handleMouseEnter(i)} onClick={() => handleSlotClick(i)} />
                </TimeSlotRow>
            ))}

            {schedule.map((item, i) => {
                const start = timeToIndex(item.startTime);
                const duration = Math.ceil(item.runningTime / 15);
                const end = getEndTime(item.startTime, item.runningTime);
                const isSelected = selectedMovie && item.movie === selectedMovie.title;

                return (
                    <MovieBlock key={i} startIndex={start} duration={duration} isSelected={isSelected}>
                        <MovieInfo isSelected={isSelected}>
                            <strong>{item.movie}</strong>
                            <span>{item.startTime} ~ {end}</span>
                        </MovieInfo>
                        <MovieBlockButtons>
                            <button><FiEdit /></button>
                            <button><FiTrash2 /></button>
                        </MovieBlockButtons>
                    </MovieBlock>
                );
            })}
            
            {hoverInfo.start !== null && (
                 <MovieBlock as="div" startIndex={hoverInfo.start} duration={hoverInfo.duration} isHover>
                     <MovieInfo>
                        <strong>{selectedMovie.title}</strong>
                     </MovieInfo>
                 </MovieBlock>
            )}
        </TimeTableWrapper>
    );
};

export default TimeTable;


// --- STYLED COMPONENTS ---
const primaryBlue = '#1E6DFF';
const lightBlue = '#a5d8ff';
const darkTextForLightBg = '#1864ab';

const TimeTableWrapper = styled.div`
  position: relative;
  height: 100%;
`;

const TimeSlotRow = styled.div`
  display: flex;
  align-items: center;
  height: 20px; 
`;

const TimeText = styled.div`
  width: 50px;
  font-size: 12px;
  color: #adb5bd;
  text-align: right;
  padding-right: 10px;
  position: relative;
  top: -10px;
`;

const SlotBox = styled.div`
  flex: 1;
  height: 100%;
  border-top: 1px solid #f1f3f5;
  box-sizing: border-box;
  cursor: pointer;
`;

const MovieBlock = styled.div`
  position: absolute;
  left: 50px;
  width: calc(100% - 50px);
  top: ${({ startIndex }) => startIndex * 20}px;
  height: ${({ duration }) => duration * 20 - 2}px;
  margin-top: 1px;
  background-color: ${({ isSelected, isHover }) => 
    isHover ? 'rgba(30, 109, 255, 0.5)' : 
    isSelected ? primaryBlue : lightBlue};
  border-radius: 4px;
  padding: 8px 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: ${({isHover}) => isHover ? 'none' : 'all 0.2s ease'};
  z-index: ${({ isHover }) => isHover ? 5 : 10};
  pointer-events: ${({ isHover }) => isHover ? 'none' : 'auto'};
`;

const MovieInfo = styled.div`
    color: ${({ isSelected }) => (isSelected ? 'white' : darkTextForLightBg)};
    strong {
        font-weight: 700;
        font-size: 14px;
    }
    span {
        display: block;
        font-size: 12px;
        opacity: 0.8;
        margin-top: 4px;
    }
`;

const MovieBlockButtons = styled.div`
    align-self: flex-end;
    display: flex;
    gap: 4px;
    button {
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;
