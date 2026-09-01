import axiosInstance from './axiosInstance'

export const bookApi = {
  getBooks: (params) => axiosInstance.get('/books', { params }),
  getBookById: (id) => axiosInstance.get(`/books/${id}`),
  getCategories: () => axiosInstance.get('/books/categories'),
}
