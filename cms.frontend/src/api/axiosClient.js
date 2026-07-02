import axios from 'axios';

// Khởi tạo một thực thể axios với cấu hình base chung
// API URL được cấu hình qua file .env: REACT_APP_API_URL
const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Gửi kèm Cookie để duy trì phiên đăng nhập
    timeout: 10000, // Thời gian tối đa chờ phản hồi từ server (10 giây)
});

// Giải thích: Interceptor giúp chúng ta can thiệp vào dữ liệu trước khi trả về cho component
axiosClient.interceptors.response.use(
    (response) => {
        // Nếu phản hồi thành công, bóc tách lấy thẳng cục data bên trong dữ liệu JSON
        return response.data;
    },
    (error) => {
        // Chỉ log lỗi thật (5xx, network error), bỏ qua lỗi xác thực 401 (bình thường khi chưa login)
        if (error.response && error.response.status >= 500) {
            console.error('Lỗi kết nối API:', error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
