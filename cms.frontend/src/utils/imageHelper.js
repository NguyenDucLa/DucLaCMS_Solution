/**
 * Chuyển đổi đường dẫn ảnh tương đối thành URL tuyệt đối
 * Vì ảnh được upload lưu ở Backend nhưng Frontend chạy ở port khác
 * Nên cần thêm base URL để trình duyệt tải ảnh đúng.
 * BASE_URL được cấu hình qua file .env: REACT_APP_IMAGE_BASE_URL
 */
const API_BASE = process.env.REACT_APP_IMAGE_BASE_URL || 'http://localhost:5000';

export const getImageUrl = (url, fallback = null) => {
    if (!url || url.trim() === '') {
        return fallback;
    }
    // Nếu đã là URL đầy đủ (http://, https://, data:), dùng trực tiếp
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
        return url;
    }
    // Nếu là đường dẫn tương đối (bắt đầu bằng /), thêm base URL backend
    if (url.startsWith('/')) {
        return `${API_BASE}${url}`;
    }
    return url;
};
