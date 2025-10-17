// src/services/userService.ts
import api from "@/lib/axios";
import { User } from "@/types";
import { AxiosResponse } from "axios";

type UpdateProfilePayload = {
  fullName?: string;
  avatar?: string;
};

class UserService {
  /**
   * ✅ Private helper để bọc các API call và xử lý lỗi tập trung.
   */
  private async _requestWrapper<T>(
    // Sửa lại kiểu dữ liệu của apiCall
    apiCall: () => Promise<AxiosResponse<T>>,
    errorMessage: string
  ): Promise<T> {
    try {
      const response = await apiCall();
      return response.data; // <-- Sửa ở đây, chỉ trả về response.data
    } catch (error: any) {
      // Ném ra lỗi đã được chuẩn hóa
      throw new Error(error?.response?.data?.message || errorMessage);
    }
  }

  /**
   * Lấy thông tin user hiện tại.
   */
  async me(): Promise<User> {
    return this._requestWrapper(
      () => api.get<User>("/user/me"),
      "Không lấy được thông tin người dùng."
    );
  }

  /**
   * Bản no-cache để revalidate UI.
   */
  async meNoCache(): Promise<User> {
    return this._requestWrapper(
      () =>
        api.get<User>("/user/me", {
          params: { t: Date.now() },
          headers: {
            "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
            Pragma: "no-cache",
          },
        }),
      "Không lấy được thông tin người dùng (no-cache)."
    );
  }

  /**
   * Cập nhật profile hiện tại.
   */
  async updateProfile(data: UpdateProfilePayload): Promise<User> {
    return this._requestWrapper(
      () => api.patch<User>("/user/update-profile", data),
      "Cập nhật thông tin thất bại."
    );
  }
}

export const userService = new UserService();
export default userService;
