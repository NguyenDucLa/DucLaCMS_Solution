const API_BASE = 'http://localhost:5000';

/**
 * Chuyển đổi đường dẫn ảnh tương đối thành URL tuyệt đối
 * Vì ảnh được upload lưu ở Backend (localhost:5000) nhưng Frontend chạy ở localhost:3000
 * Nên cần thêm base URL để trình duyệt tải ảnh đúng.
 */
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
