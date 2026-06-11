import axiosClient from '../api/axiosClient';

const blogService = {
    /**
     * Hàm gọi API lấy toàn bộ các bài viết (Mẹo phối đồ, tin tức thời trang)
     * Endpoint này kết nối tới PostsController trong ASP.NET Core
     */
    getAllPosts: () => {
        const url = '/Posts';
        return axiosClient.get(url);
    }
};

export default blogService;
