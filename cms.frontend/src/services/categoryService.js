import axiosClient from '../api/axiosClient';

const categoryService = {
    getAllCategories: () => {
        const url = '/Categories';
        return axiosClient.get(url);
    }
};

export default categoryService;
