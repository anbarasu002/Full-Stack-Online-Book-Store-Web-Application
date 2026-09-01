import axiosInstance from './axiosInstance'

export const cartApi = {
  getCart: () => axiosInstance.get('/cart'),
  addItem: (bookId, quantity = 1) => axiosInstance.post('/cart', { bookId, quantity }),
  updateItem: (bookId, quantity) => axiosInstance.put(`/cart/${bookId}`, null, { params: { quantity } }),
  removeItem: (bookId) => axiosInstance.delete(`/cart/${bookId}`),
  clearCart: () => axiosInstance.delete('/cart'),
}
