import axiosClient from '../api/axiosClient';

const orderService = {
    createOrder: (checkoutData) => {
        const url = '/Orders';
        return axiosClient.post(url, checkoutData);
    }
};

export default orderService;
