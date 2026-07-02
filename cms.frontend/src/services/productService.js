import axiosClient from '../api/axiosClient';

const productService = {
    /**
     * Hàm lấy danh sách sản phẩm có phân trang
     * Endpoint: GET /Products?page=1&pageSize=12
     * Trả về: { items, totalItems, totalPages, currentPage, pageSize }
     */
    getAllProducts: (page = 1, pageSize = 12) => {
        const url = `/Products?page=${page}&pageSize=${pageSize}`;
        return axiosClient.get(url);
    },

    /**
     * Hàm lấy sản phẩm theo danh mục có phân trang
     * Endpoint: GET /Products/categoryproduct/{id}?page=1&pageSize=12
     */
    getProductsByCategory: (id, page = 1, pageSize = 12) => {
        const url = `/Products/categoryproduct/${id}?page=${page}&pageSize=${pageSize}`;
        return axiosClient.get(url);
    },

    /**
     * Hàm lấy chi tiết một sản phẩm theo ID
     * Endpoint: api/Products/{id}
     */
    getProductById: (id) => {
        const url = `/Products/${id}`;
        return axiosClient.get(url);
    },

    /**
     * Hàm lấy 3 sản phẩm mới nhất
     * Endpoint: GET /Products/latest
     */
    getLatestProducts: () => {
        const url = '/Products/latest';
        return axiosClient.get(url);
    },

    /**
     * Hàm lấy 3 sản phẩm bán chạy nhất
     * Endpoint: GET /Products/bestselling
     */
    getBestSellingProducts: () => {
        const url = '/Products/bestselling';
        return axiosClient.get(url);
    }
};

export default productService;
