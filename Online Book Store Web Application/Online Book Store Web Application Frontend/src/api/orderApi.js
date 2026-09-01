import axiosInstance from './axiosInstance'

export const orderApi = {
  placeOrder: (orderData) =>
    axiosInstance.post('/orders', orderData),

  getMyOrders: () =>
    axiosInstance.get('/orders'),

  getOrder: (id) =>
    axiosInstance.get(`/orders/${id}`),
}