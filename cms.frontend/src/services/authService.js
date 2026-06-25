import axiosClient from '../api/axiosClient';

const authService = {
    /**
     * Đăng nhập
     * POST /api/auth/login
     */
    login: (credentials) => {
        return axiosClient.post('/auth/login', credentials);
    },

    /**
     * Đăng ký tài khoản mới
     * POST /api/auth/register
     */
    register: (data) => {
        return axiosClient.post('/auth/register', data);
    },

    /**
     * Lấy thông tin người dùng hiện tại
     * GET /api/auth/me
     */
    getMe: () => {
        return axiosClient.get('/auth/me');
    },

    /**
     * Đăng xuất
     * POST /api/auth/logout
     */
    logout: () => {
        return axiosClient.post('/auth/logout');
    }
};

export default authService;
