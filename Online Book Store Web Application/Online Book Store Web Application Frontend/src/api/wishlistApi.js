import axiosInstance from './axiosInstance'

export const wishlistApi = {
  getWishlist: () => axiosInstance.get('/wishlist'),
  addItem: (bookId) => axiosInstance.post(`/wishlist/${bookId}`),
  removeItem: (bookId) => axiosInstance.delete(`/wishlist/${bookId}`),
}
