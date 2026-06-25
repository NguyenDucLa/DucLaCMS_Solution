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
    }
};

export default productService;
