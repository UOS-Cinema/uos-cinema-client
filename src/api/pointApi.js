import axiosInstance from './axiosInstance';

// 현재 포인트 조회 (/members/points)
export const getCurrentPoints = async () => {
  try {
    const response = await axiosInstance.get('/members/points');
    return response.data;
  } catch (error) {
    console.error('포인트 조회 실패:', error);
    throw error;
  }
};

// 포인트내역 조회 (/members/points/history)
export const getPointHistory = async (page = 0, size = 10) => {
  try {
    const response = await axiosInstance.get('/members/points/history', {
      params: { page, size }
    });
    return response.data;
  } catch (error) {
    console.error('포인트내역 조회 실패:', error);
    throw error;
  }
}; 
