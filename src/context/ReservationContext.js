import React, { createContext, useContext, useReducer } from 'react';

// 1. counts를 빈 객체 {} 로 수정
const initialState = {
    step: 1,
    selectedScreening: null,
    counts: {}, // 고객 유형에 따라 동적으로 채워질 빈 객체로 시작
    selectedSeats: [],
    screenType: null,
    reservationId: null, // 예매 ID 추가
};

// 액션에 따라 상태를 어떻게 변경할지 정의하는 리듀서 함수
function reservationReducer(state, action) {
    switch (action.type) {
        case 'SET_STEP':
            return { ...state, step: action.payload };
        
        case 'SELECT_SCREENING':
            return { 
                ...state, 
                selectedScreening: action.payload,
                screenType: action.payload ? action.payload.screenType : null,
            };

        case 'SET_COUNTS':
            return { ...state, counts: action.payload };
        case 'SET_SEATS':
            return { ...state, selectedSeats: action.payload };
        
        case 'SET_RESERVATION_ID':
            return { ...state, reservationId: action.payload };
        
        case 'RESET_SELECTION':
            return {
                ...state,
                // 이제 initialState.counts는 빈 객체 {}를 참조하므로 올바르게 초기화됨
                counts: initialState.counts,
                selectedSeats: initialState.selectedSeats,
                screenType: initialState.screenType,
                reservationId: initialState.reservationId,
            };
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

// Context 생성
const ReservationStateContext = createContext();
const ReservationDispatchContext = createContext();

// Provider 컴포넌트
export const ReservationProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reservationReducer, initialState);

    return (
        <ReservationStateContext.Provider value={state}>
            <ReservationDispatchContext.Provider value={dispatch}>
                {children}
            </ReservationDispatchContext.Provider>
        </ReservationStateContext.Provider>
    );
};

// state와 dispatch를 쉽게 사용하기 위한 커스텀 훅
export const useReservationState = () => {
    const context = useContext(ReservationStateContext);
    if (!context) throw new Error('Cannot find ReservationProvider');
    return context;
};

export const useReservationDispatch = () => {
    const context = useContext(ReservationDispatchContext);
    if (!context) throw new Error('Cannot find ReservationProvider');
    return context;
};
