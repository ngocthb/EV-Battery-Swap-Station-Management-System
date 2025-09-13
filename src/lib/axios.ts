import axios from "axios";
import { toast } from "react-toastify";

// Tạo instance chung
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage (client-side) hoặc cookies
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Xử lý lỗi chung (401, 403, 500...)
    if (error.response?.status === 401) {
      toast.error("Lỗi xác thực. Vui lòng đăng nhập lại.");
      // Có thể redirect về /login hoặc refresh token
    }

    return Promise.reject(error);
  }
);

export default api;
