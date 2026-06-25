import axiosClient from '../api/axiosClient';

const blogService = {
    /**
     * Hàm gọi API lấy toàn bộ các bài viết (Mẹo phối đồ, tin tức thời trang)
     * Endpoint này kết nối tới PostsController trong ASP.NET Core
     */
    getAllPosts: () => {
        const url = '/Posts';
        return axiosClient.get(url);
    },

    /**
     * Hàm lấy chi tiết 1 bài viết theo ID (Phục vụ trang xem chi tiết sau này)
     */
    getPostById: (id) => {
        const url = `/Posts/${id}`;
        return axiosClient.get(url);
    },

    /**
     * BÀI TẬP TỰ LÀM: Hàm lấy danh sách Chuyên mục tin tức (Category)
     * Endpoint kết nối tới CategoriesController trong ASP.NET Core
     */
    getBlogCategories: () => {
        const url = '/Categories';
        return axiosClient.get(url);
    },

    /**
     * Hàm lấy bài viết theo danh mục
     * Endpoint: api/Posts/category/{categoryId}
     */
    getPostsByCategory: (categoryId) => {
        const url = `/Posts/category/${categoryId}`;
        return axiosClient.get(url);
    }
};

export default blogService;
