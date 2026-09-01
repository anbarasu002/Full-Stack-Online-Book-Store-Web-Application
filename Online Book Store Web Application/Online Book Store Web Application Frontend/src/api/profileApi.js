import axiosInstance from './axiosInstance'

export const profileApi = {
  getProfile: () => axiosInstance.get('/profile'),
  updateProfile: (data) => axiosInstance.put('/profile', data),
}
