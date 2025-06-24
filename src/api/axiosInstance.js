import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 10000, // 타임아웃을 10초로 증가
    withCredentials: false, // CORS 문제 방지
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// 요청 인터셉터 (토큰 검증 강화)
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        console.log('axiosInstance 요청 인터셉터 - 토큰 확인:', accessToken ? `토큰 있음 (길이: ${accessToken.length})` : '토큰 없음');
        
        if (accessToken && accessToken.trim() !== '') {
            // Bearer 토큰 형식으로 설정
            config.headers['Authorization'] = `Bearer ${accessToken}`;
            console.log('Authorization 헤더 설정됨:', config.headers['Authorization'].substring(0, 30) + '...');
        } else {
            console.warn('토큰이 없거나 빈 문자열이어서 Authorization 헤더가 설정되지 않음');
            // Authorization 헤더가 있다면 제거
            delete config.headers['Authorization'];
        }
        
        console.log('요청 URL:', config.baseURL + config.url);
        console.log('요청 헤더 확인:', {
            'Authorization': config.headers['Authorization'] ? config.headers['Authorization'].substring(0, 30) + '...' : 'None',
            'Content-Type': config.headers['Content-Type']
        });
        
        return config;
    },
    (error) => {
        console.error('요청 인터셉터 오류:', error);
        return Promise.reject(error);
    }
);

// 응답 인터셉터 (로그아웃 처리 부분 수정)
axiosInstance.interceptors.response.use(
    (response) => {
        console.log('API 응답 성공:', response.config.url, response.status);
        return response;
    },
    async (error) => {
        console.error('API 응답 오류:', error.config?.url, error.response?.status, error.message);
        
        // 네트워크 오류인 경우 특별 처리
        if (!error.response) {
            console.error('네트워크 오류 또는 서버 연결 실패:', error.message);
            // 토큰이 없거나 만료된 경우일 수 있으므로 토큰 확인
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                console.log('토큰이 없어서 로그인 페이지로 리다이렉트');
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(error);
            }
        }
        
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            console.log('401 오류 발생, 토큰 갱신 시도');

            try {
                const expiredAccessToken = localStorage.getItem('accessToken');
                if (!expiredAccessToken) {
                    throw new Error('갱신할 토큰이 없습니다');
                }
                
                console.log('토큰 갱신 API 호출');
                const response = await axios.post('http://localhost:8080/auth/refresh-token', { 
                    accessToken: expiredAccessToken 
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;
                
                console.log('토큰 갱신 성공');
                localStorage.setItem('accessToken', newAccessToken);
                localStorage.setItem('refreshToken', newRefreshToken);

                // 기본 헤더와 요청 헤더 모두 업데이트
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                
                console.log('갱신된 토큰으로 원래 요청 재시도');
                return axiosInstance(originalRequest);

            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                // 토큰 갱신 실패 시 모든 토큰 정리
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                
                alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                window.location.href = '/login'; 
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
