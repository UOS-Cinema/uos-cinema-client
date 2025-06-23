import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiEdit, FiTrash2 } from "react-icons/fi";

// 시간 <-> 인덱스 변환 유틸리티 (변경 없음)
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

// --- 서버 응답 데이터를 프론트엔드 형식으로 변환하는 함수 ---
const transformScreeningData = (screening) => {
    if (!screening || !screening.startTime || screening.startTime.length < 5) {
        return null;
    }
    const hour = screening.startTime[3].toString().padStart(2, '0');
    const minute = screening.startTime[4].toString().padStart(2, '0');

    return {
        id: screening.id,
        movie: screening.movieTitle,
        startTime: `${hour}:${minute}`,
        runningTime: screening.duration,
    };
};


const TimeTable = ({ selectedMovie, selectedTheater, selectedDate, selectedScreenType, user }) => {
    const totalSlots = 96;
    const [schedule, setSchedule] = useState([]);
    const [slotOccupied, setSlotOccupied] = useState([]);
    const [hoverInfo, setHoverInfo] = useState({ start: null, duration: 0 });

    useEffect(() => {
        if (!selectedMovie || !selectedTheater || !selectedDate) {
            setSchedule([]);
            return;
        }

        const fetchSchedule = async () => {
            const year = selectedDate.getFullYear();
            const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
            const day = selectedDate.getDate().toString().padStart(2, '0');
            const dateString = `${year}-${month}-${day}`;
            console.log(selectedMovie);
            console.log(selectedTheater);
            const params = new URLSearchParams({
                // movieId는 이제 필수 파라미터가 아닐 수 있으므로, API 명세에 따라 조절
                movieId: selectedMovie.id,
                theaterId: selectedTheater.number,
                // date: dateString,
            });
            console.log(params);
            try {
                // API 엔드포인트는 /screenings/{theaterId}?date=... 와 같은 형태일 수 있습니다.
                const response = await fetch(`/screenings?${params.toString()}`);
                if (!response.ok) throw new Error('상영 정보를 불러오는 데 실패했습니다.');
                
                const data = await response.json();
                console.log(data);
                // --- 데이터 변환 로직 수정 ---
                const formattedSchedule = data.data.map(transformScreeningData).filter(Boolean); // null인 경우 필터링
                setSchedule(formattedSchedule);
                console.log(formattedSchedule);
            } catch (error) {
                console.error("Error fetching schedule:", error);
                setSchedule([]);
            }
        };

        fetchSchedule();
    }, [selectedMovie, selectedTheater, selectedDate]);

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

    const handleSlotClick = async (startIndex) => {
        if (!selectedMovie || !selectedTheater || !selectedScreenType || !selectedDate) {
            alert("영화, 상영관, 상영 타입, 날짜를 모두 선택해주세요.");
            return;
        }
        const duration = Math.ceil(selectedMovie.runningTime / 15);
        for (let i = startIndex; i < startIndex + duration; i++) {
            if (i >= totalSlots || slotOccupied[i]) {
                alert("이미 다른 상영 일정이 있거나, 상영 시간이 24시를 초과합니다.");
                return;
            }
        }
        if (!user || !user.accessToken) {
            alert("로그인이 필요합니다.");
            return;
        }

        const newStartTime = `${Math.floor(startIndex/4).toString().padStart(2, '0')}:${(startIndex % 4 * 15).toString().padStart(2, '0')}`;
        const [hours, minutes] = newStartTime.split(':');
        const finalStartTime = new Date(selectedDate);
        finalStartTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

        const requestBody = {
            movieId: selectedMovie.id,
            theaterId: selectedTheater.theaterId,
            screenType: selectedScreenType,
            startTime: finalStartTime.toISOString(),
        };

        try {
            const response = await fetch('/admin/screenings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.accessToken}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                alert('새로운 상영 일정이 성공적으로 등록되었습니다.');
                // --- POST 성공 후 응답 데이터로 상태 업데이트 ---
                const newScreeningFromServer = await response.json();
                const newScheduleItem = transformScreeningData(newScreeningFromServer);
                
                if (newScheduleItem) {
                    setSchedule(prev => [...prev, newScheduleItem].sort((a,b) => timeToIndex(a.startTime) - timeToIndex(b.startTime)));
                }
            } else {
                const errorData = await response.json();
                alert(`일정 저장에 실패했습니다: ${errorData.message || '서버 오류'}`);
            }
        } catch (error) {
            console.error("Error saving schedule:", error);
            alert("일정 저장 중 오류가 발생했습니다.");
        }
    };

    const handleDelete = async (itemToDelete) => {
        if (!user || !user.accessToken) {
            alert("로그인이 필요합니다.");
            return;
        }
        if(window.confirm(`'${itemToDelete.movie}' (${itemToDelete.startTime}) 상영 일정을 삭제하시겠습니까?`)) {
            try {
                const response = await fetch(`/admin/screenings/${itemToDelete.id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${user.accessToken}` },
                });

                if (response.ok) {
                    alert('일정이 성공적으로 삭제되었습니다.');
                    setSchedule(prev => prev.filter(item => item.id !== itemToDelete.id));
                } else {
                    const errorData = await response.json();
                    alert(`삭제에 실패했습니다: ${errorData.message || '서버 오류'}`);
                }
            } catch (error) {
                console.error("Error deleting schedule:", error);
                alert("일정 삭제 중 오류가 발생했습니다.");
            }
        }
    };

    return (
        <TimeTableWrapper onMouseLeave={handleMouseLeave}>
            {[...Array(totalSlots)].map((_, i) => (
                <TimeSlotRow key={i}>
                    {i % 4 === 0 && <TimeText>{formatTime(i)}</TimeText>}
                    <SlotBox onMouseEnter={() => handleMouseEnter(i)} onClick={() => handleSlotClick(i)} />
                </TimeSlotRow>
            ))}

            {schedule.map((item) => {
                const start = timeToIndex(item.startTime);
                const duration = Math.ceil(item.runningTime / 15);
                const end = getEndTime(item.startTime, item.runningTime);
                
                return (
                    <MovieBlock key={item.id} startIndex={start} duration={duration}>
                        <MovieInfo>
                            <strong>{item.movie}</strong>
                            <span>{item.startTime} ~ {end}</span>
                        </MovieInfo>
                        <MovieBlockButtons>
                            <button><FiEdit /></button>
                            <button onClick={() => handleDelete(item)}><FiTrash2 /></button>
                        </MovieBlockButtons>
                    </MovieBlock>
                );
            })}
            
            {hoverInfo.start !== null && selectedMovie && (
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


// --- STYLED COMPONENTS (이전과 동일) ---
const primaryBlue = '#1E6DFF';
const lightBlue = '#a5d8ff';
const darkTextForLightBg = '#1864ab';

const TimeTableWrapper = styled.div`
  position: relative;
  height: 100%;
  overflow-y: auto; /* 타임라인이 길어질 경우 스크롤 */
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
  width: calc(100% - 60px); /* 스크롤바 공간 확보 */
  top: ${({ startIndex }) => startIndex * 20}px;
  height: ${({ duration }) => duration * 20 - 2}px;
  margin-top: 1px;
  background-color: ${({ isHover }) => 
    isHover ? 'rgba(30, 109, 255, 0.5)' : lightBlue};
  border-radius: 4px;
  padding: 8px 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: ${({isHover}) => isHover ? 'none' : 'all 0.2s ease'};
  z-index: ${({ isHover }) => isHover ? 5 : 10};
  pointer-events: ${({ isHover }) => isHover ? 'none' : 'auto'};
  overflow: hidden;
`;

const MovieInfo = styled.div`
    color: ${darkTextForLightBg};
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
    position: absolute;
    bottom: 4px;
    right: 8px;
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
        opacity: 0;
        transition: opacity 0.2s ease;

        &:hover {
            background: rgba(255,255,255,0.4);
        }
    }

    ${MovieBlock}:hover & button {
        opacity: 1;
    }
`;