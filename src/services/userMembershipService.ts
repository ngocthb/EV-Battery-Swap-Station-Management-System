import api from "@/lib/axios";
import { Membership } from "@/types/index"; // Import from your main types file

export interface CreateUserMembershipRequest {
  membershipId: number;
  paymentId: number;
}

export interface UpgradeUserMembershipRequest {
  newMembershipId: number;
  paymentId: number;
}

export interface UserMembershipData {
  paymentUrl: string;
}

export interface UserMembershipResponse {
  success: boolean;
  message: string;
  data: UserMembershipData;
}

// Remove the Membership interface from here since we're importing it

export interface UserMembership {
  id: number;
  userId: number;
  expiredDate: string;
  paymentExpireAt: string | null;
  remainingSwaps: number;
  status: "ACTIVE" | "CANCELLED" | "EXPIRED" | "PENDING";
  createdAt: string;
  membership: Membership; // Uses the imported Membership type
  paymentUrl: string | null;
}

export interface GetUserMembershipsResponse {
  success: boolean;
  message: string;
  data: UserMembership[];
}

export interface GetCurrentMembershipResponse {
  success: boolean;
  message: string;
  data: UserMembership | null;
}

/**
 * Create a new user membership subscription
 * @param data - Membership and payment information
 * @returns Promise with user membership response including payment URL
 * @note Authentication token is automatically added by axios interceptor
 */
export const createUserMembership = async (
  data: CreateUserMembershipRequest
): Promise<UserMembershipResponse> => {
  try {
    const response = await api.post<UserMembershipResponse>(
      "/user-membership",
      data
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Không thể tạo gói thành viên"
    );
  }
};

/**
 * Upgrade user membership to a higher tier
 * @param data - New membership ID and payment information
 * @returns Promise with user membership response including payment URL
 * @note Authentication token is automatically added by axios interceptor
 */
export const upgradeUserMembership = async (
  data: UpgradeUserMembershipRequest
): Promise<UserMembershipResponse> => {
  try {
    const response = await api.post<UserMembershipResponse>(
      "/user-membership/upgrade",
      data
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Không thể nâng cấp gói thành viên"
    );
  }
};

/**
 * Get all user memberships with pagination
 * @param page - Page number (default: 1)
 * @param limit - Number of items per page (default: 10)
 * @returns Promise with list of user memberships
 * @note Authentication token is automatically added by axios interceptor
 */
export const getUserMemberships = async (
  page: number = 1,
  limit: number = 10
): Promise<GetUserMembershipsResponse> => {
  try {
    const response = await api.get<GetUserMembershipsResponse>(
      "/user-membership/by-user",
      {
        params: { page, limit },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Không thể lấy danh sách gói thành viên"
    );
  }
};

/**
 * Get current active user membership
 * @returns Promise with current active membership or null if no active membership
 * @note Authentication token is automatically added by axios interceptor
 */
export const getCurrentUserMembership =
  async (): Promise<GetCurrentMembershipResponse> => {
    try {
      const response = await api.get<GetUserMembershipsResponse>(
        "/user-membership/by-user",
        {
          params: { page: 1, limit: 10 },
        }
      );

      // Find the active membership from the list
      const activeMembership = response.data.data.find(
        (membership) => membership.status === "ACTIVE"
      );

      return {
        success: true,
        message: activeMembership
          ? "Lấy thông tin gói thành viên hiện tại thành công"
          : "Không có gói thành viên đang hoạt động",
        data: activeMembership || null,
      };
    } catch (error: any) {
      // If user has no memberships, return null instead of throwing error
      if (error.response?.status === 404) {
        return {
          success: true,
          message: "Không có gói thành viên đang hoạt động",
          data: null,
        };
      }
      throw new Error(
        error.response?.data?.message ||
          "Không thể lấy thông tin gói thành viên hiện tại"
      );
    }
  };
