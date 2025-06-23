import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 5000,
});

// 요청 인터셉터 (변경 없음)
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터 (로그아웃 처리 부분 수정)
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const expiredAccessToken = localStorage.getItem('accessToken');
                const response = await axios.post('http://localhost:8080/auth/refresh-token', { 
                    accessToken: expiredAccessToken 
                });

                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;
                
                localStorage.setItem('accessToken', newAccessToken);
                localStorage.setItem('refreshToken', newRefreshToken);

                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);

            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                // 로그아웃은 UserContext가 담당하므로, 여기서는 페이지를 새로고침하여
                // UserContext의 useEffect가 동작하도록 유도합니다.
                alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                window.location.href = '/login'; 
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;