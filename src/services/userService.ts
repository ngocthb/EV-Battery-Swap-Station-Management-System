// src/services/userService.ts
import api from "@/lib/axios";
import { User } from "@/types";
import { AxiosResponse } from "axios";

type UpdateProfilePayload = {
  fullName?: string;
  avatar?: string;
};

class UserService {
  private async _requestWrapper<T>(
    apiCall: () => Promise<AxiosResponse<T>>,
    errorMessage: string
  ): Promise<T> {
    try {
      const response = await apiCall();
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || errorMessage);
    }
  }

  async me(): Promise<User> {
    return this._requestWrapper(
      () => api.get<User>("/user/me"),
      "Không lấy được thông tin người dùng."
    );
  }

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

  async updateProfile(data: UpdateProfilePayload): Promise<User> {
    return this._requestWrapper(
      () => api.patch<User>("/user/update-profile", data),
      "Cập nhật thông tin thất bại."
    );
  }
}

export const userService = new UserService();
export default userService;
