import axiosClient from '../api/axiosClient';

const searchService = {
    /**
     * Tìm kiếm sản phẩm theo từ khóa
     * GET /api/Products/search?keyword=...&page=1&pageSize=12
     */
    search: (keyword, page = 1, pageSize = 12) => {
        const url = `/Products/search?keyword=${encodeURIComponent(keyword)}&page=${page}&pageSize=${pageSize}`;
        return axiosClient.get(url);
    },

    /**
     * Lọc sản phẩm theo khoảng giá và danh mục
     * GET /api/Products/filter?minPrice=...&maxPrice=...&categoryId=...&page=1&pageSize=12
     */
    filter: (params = {}, page = 1, pageSize = 12) => {
        const query = new URLSearchParams();
        if (params.minPrice) query.append('minPrice', params.minPrice);
        if (params.maxPrice) query.append('maxPrice', params.maxPrice);
        if (params.categoryId !== null && params.categoryId !== undefined) query.append('categoryId', params.categoryId);
        query.append('page', page);
        query.append('pageSize', pageSize);
        const url = `/Products/filter?${query.toString()}`;
        return axiosClient.get(url);
    }
};

export default searchService;
