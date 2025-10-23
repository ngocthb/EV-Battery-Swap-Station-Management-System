// src/services/userService.ts
import api from "@/lib/axios";
import { User } from "@/types";
import { AxiosResponse } from "axios";

type UpdateProfilePayload = {
  fullName?: string;
  avatar?: string;
};

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data: T;
};

class UserService {
  private async _requestWrapper<T>(
    apiCall: () => Promise<AxiosResponse<ApiEnvelope<T>>>,
    errorMessage: string
  ): Promise<T> {
    try {
      const res = await apiCall();

      return res.data?.data as T;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        errorMessage;
      throw new Error(msg);
    }
  }

  async me(): Promise<User> {
    return this._requestWrapper<User>(
      () => api.get<ApiEnvelope<User>>("/user/me"),
      "Không lấy được thông tin người dùng."
    );
  }

  async meNoCache(): Promise<User> {
    return this._requestWrapper<User>(
      () =>
        api.get<ApiEnvelope<User>>("/user/me", {
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
    return this._requestWrapper<User>(
      () => api.patch<ApiEnvelope<User>>("/user/update-profile", data),
      "Cập nhật thông tin thất bại."
    );
  }
}

export const userService = new UserService();
export default userService;
