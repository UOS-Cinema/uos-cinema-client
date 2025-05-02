import React, { useState } from 'react';
import styled from 'styled-components';

const TimeTableWrapper = styled.div`
    disply:flex;
    flex-direction:column;
`;

const TimeSlot = styled.div`

  display: inline-block;
  width: 60px;
  padding: 6px 4px;
  margin-right: 4px;
  text-align: center;
  font-size: 12px;
  cursor: pointer;
  background-color: ${({ selected }) => (selected ? '#007BFF' : '#f5f5f5')};
  color: ${({ selected }) => (selected ? 'white' : 'black')};
  border-radius: 4px;

  &:hover {
    background-color: ${({ selected }) => (selected ? '#0056b3' : '#ddd')};
  }
`;

const formatTime = (index) => {
  const totalMinutes = index * 15;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const TimeTable = () => {
  const [selectedSlots, setSelectedSlots] = useState([]);

  const handleClick = (index) => {
    if (selectedSlots.includes(index)) {
      setSelectedSlots(selectedSlots.filter((i) => i !== index));
    } else {
      setSelectedSlots([...selectedSlots, index]);
    }
  };

  return (
    <TimeTableWrapper>
      {[...Array(96)].map((_, i) => (
        <TimeSlot
          key={i}
          selected={selectedSlots.includes(i)}
          onClick={() => handleClick(i)}
        >
          {formatTime(i)}
        </TimeSlot>
      ))}
    </TimeTableWrapper>
  );
};

export default TimeTable;
