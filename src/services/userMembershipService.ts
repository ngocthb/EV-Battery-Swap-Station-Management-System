import api from "@/lib/axios";

export interface CreateUserMembershipRequest {
  membershipId: number;
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
