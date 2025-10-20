import api from "@/lib/axios";
import { User } from "@/types";

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
      console.log("API response:", response.data);

      // Transform backend data to User format
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
}

export const authService = new AuthService();
export default authService;
