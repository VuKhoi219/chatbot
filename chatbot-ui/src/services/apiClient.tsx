// src/api/apiClient.ts
import axios, { AxiosInstance } from 'axios';

// Tạo một Axios instance với cấu hình chung
const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // Thay thế bằng URL gốc của API của bạn
  timeout: 10000,                 // Thời gian chờ tối đa (milliseconds)
  headers: {
    'Content-Type': 'application/json',
    // Thêm các header mặc định khác nếu cần thiết (ví dụ: Authorization)
  },
});

// Interceptor cho request (tùy chọn)
apiClient.interceptors.request.use(
  (config) => {
    // Ví dụ: Thêm token vào header trước khi gửi request
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);

    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('user')
      localStorage.removeItem('token');
      window.location.href = '/welcome'; // Redirect về trang login
    }

    return Promise.reject(error);
  }
);

export default apiClient;