import axios from "axios";
import authService from "./authService";

const API_URL = "https://belakoo-backend.onrender.com"; // Replace with your actual backend URL

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  async (config) => {
    const token = await authService.getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { access } = await authService.refreshToken();
        axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh token fails, logout the user
        await authService.logout();
        // Redirect to login page
        // You might need to use a navigation service or context to handle this redirection
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
