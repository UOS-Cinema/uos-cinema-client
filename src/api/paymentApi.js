import axiosInstance from './axiosInstance';

// 결제내역 조회 (/customers/payments)
export const getPaymentHistory = async (page = 0, size = 10) => {
  try {
    const response = await axiosInstance.get('/customers/payments', {
      params: { page, size }
    });
    return response.data;
  } catch (error) {
    console.error('결제내역 조회 실패:', error);
    throw error;
  }
};

// 결제 처리 (/payments)
export const processPayment = async (paymentData) => {
  try {
    const response = await axiosInstance.post('/payments', paymentData);
    return response.data;
  } catch (error) {
    console.error('결제 처리 실패:', error);
    throw error;
  }
}; 
