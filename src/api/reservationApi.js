import axiosInstance from './axiosInstance';

// 예매내역 조회 (/customers/reservations)
export const getReservationHistory = async (page = 0, size = 10) => {
  try {
    const response = await axiosInstance.get('/customers/reservations', {
      params: { page, size }
    });
    return response.data;
  } catch (error) {
    console.error('예매내역 조회 실패:', error);
    throw error;
  }
};

// 예매 생성 (/reservations)
export const createReservation = async (reservationData) => {
  try {
    const response = await axiosInstance.post('/reservations', reservationData);
    return response.data;
  } catch (error) {
    console.error('예매 생성 실패:', error);
    throw error;
  }
};

// 예매 취소 (/reservations/{id})
export const cancelReservation = async (reservationId) => {
  try {
    const response = await axiosInstance.delete(`/reservations/${reservationId}`);
    return response.data;
  } catch (error) {
    console.error('예매 취소 실패:', error);
    throw error;
  }
}; 
