import axiosClient from '../api/axiosClient';

const productService = {
    /**
     * Hàm lấy toàn bộ danh sách sản phẩm thời trang từ Backend
     * Endpoint này kết nối tới ProductsController trong ASP.NET Core
     */
    getAllProducts: () => {
        const url = '/Products';
        return axiosClient.get(url);
    },

    /**
     * Hàm lấy sản phẩm theo danh mục
     * Endpoint: api/Products/categoryproduct/{categoryProductId}
     */
    getProductsByCategory: (id) => {
        const url = `/Products/categoryproduct/${id}`;
        return axiosClient.get(url);
    }
};

export default productService;
