import api from "@/lib/axios";
import { User } from "@/types";
import { AxiosError } from "axios";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

class AuthService {
  async login(formData: LoginFormData): Promise<{ token: string; user: User }> {
    try {
      const response = await api.post("auth/login", {
        usernameOrEmail: formData.email,
        password: formData.password,
      });
      console.log("Login response:", response);
      if (!response || !response.data) {
        throw new Error("Đăng nhập thất bại");
      }

      const token = response.data.data.access_token;

      // Save token to localStorage/sessionStorage
      if (formData.rememberMe) {
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }

      // Also save to cookie for middleware access
      document.cookie = `token=${token}; path=/; ${
        formData.rememberMe ? "max-age=604800" : "max-age=86400"
      }; SameSite=Strict`;

      const user = await this.fetchProfile();

      return { token, user };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Đăng nhập thất bại";
      throw new Error(errorMessage);
    }
  }

  async fetchProfile(): Promise<User> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error("Không tìm thấy token");
      }

      const response = await api.get("user/me");

      const backendUser = response.data.data;
      const user: User = {
        id: backendUser.id,
        username: backendUser.username,
        email: backendUser.email,
        fullName: backendUser.fullName,
        avatar: backendUser.avatar,
        role: backendUser.role,
      };

      return user;
    } catch (error: unknown) {
      this.logout();
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Không thể lấy thông tin người dùng";
      throw new Error(errorMessage);
    }
  }

  logout(): void {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    if (typeof window === "undefined") return null; // SSR → trả về null
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  }

  async updateProfile(data: { fullName?: string; avatar?: string }) {
    try {
      const response = await api.patch("user/update-profile", data);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Cập nhật thất bại";
      throw new Error(errorMessage);
    }
  }

  async register(payload: {
    username: string;
    password: string;
    email: string;
  }) {
    try {
      const response = await api.post("auth/register", payload);
      console.log("Register response:", response);
      return response.data;
    } catch (error: unknown) {
      console.log("Register error:", error);
      // Nếu là lỗi Axios
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message || "Đăng ký thất bại";
        throw new Error(errorMessage);
      }

      // Nếu là lỗi khác
      throw new Error("Đăng ký thất bại");
    }
  }

  async changePassword(payload: {
    currentPassword: string;
    newPassword: string;
  }) {
    try {
      const response = await api.patch("user/change-password", payload);
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Đổi mật khẩu thất bại";
      throw new Error(errorMessage);
    }
  }

  async verifyEmail(token: string) {
    try {
      const res = await api.post("auth/verify-email", { token });
      return res.data;
    } catch (error) {
      console.log("Verify email error:", error);
    }
  }

  async resendVerification(email: string) {
    try {
      const res = await api.post("auth/resend-verification", { email });
      return res.data;
    } catch (error) {
      console.log(" resend Verify email error:", error);
    }
  }

  async resetPassword(data: { token: string; newPassword: string }) {
    try {
      const res = await api.post("auth/reset-password", data);
      return res.data;
    } catch (error) {
      console.log(" reset password error:", error);
    }
  }

  async forgotPassword(email: string) {
    try {
      const res = await api.post("auth/forgot-password", { email });
      return res.data;
    } catch (error) {
      console.log(" reset password error:", error);
    }
  }
}

export const authService = new AuthService();
export default authService;
