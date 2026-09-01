import axiosInstance from './axiosInstance'

export const adminApi = {
  createBook: (data) => axiosInstance.post('/admin/books', data),
  updateBook: (id, data) => axiosInstance.put(`/admin/books/${id}`, data),
  deleteBook: (id) => axiosInstance.delete(`/admin/books/${id}`),
  getAllOrders: () => axiosInstance.get('/admin/orders'),
  updateOrderStatus: (id, status) => axiosInstance.patch(`/admin/orders/${id}/status`, { status }),
  getAllUsers: () => axiosInstance.get('/admin/users'),
}
