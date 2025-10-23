import api from "@/lib/axios";
import { User } from "@/types";
import { AxiosError } from "axios";
import { toHttpError } from "./http";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
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

      if (formData.rememberMe) {
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }

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

  async register(formData: {
    username: string;
    email: string;
    password: string;
  }): Promise<{ email: string; message: string }> {
    try {
      const payload = {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };
      const res = await api.post("/auth/register", payload);
      const email = res.data?.data?.email ?? payload.email;
      localStorage.setItem(
        "verifyEmail",
        JSON.stringify({ email, ts: Date.now() })
      );
      return {
        email,
        message:
          res.data?.message ||
          "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.",
      };
    } catch (e) {
      throw toHttpError(e, "Đăng ký thất bại.");
    }
  }

  async verifyEmail(token: string): Promise<string> {
    try {
      const res = await api.post("/auth/verify-email", { token });
      return (
        res.data?.message || "Xác thực email thành công! Bạn có thể đăng nhập."
      );
    } catch (e) {
      throw toHttpError(e, "Xác thực email thất bại.");
    }
  }

  async resendVerification(email: string): Promise<string> {
    const e = (email ?? "").trim().toLowerCase();
    try {
      const res = await api.post("/auth/resend-verification", { email: e });
      return res.data?.message || "Email xác thực đã được gửi lại!";
    } catch (e) {
      throw toHttpError(e, "Không thể gửi lại email xác thực.");
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
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  }
}

export const authService = new AuthService();
export default authService;
