import api from "@/lib/axios";

export interface PaymentMethod {
  id: number;
  name: string;
  description: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  data: PaymentMethod[];
}

/**
 * Fetch all available payment methods
 * @param params - Pagination parameters (page, limit)
 * @returns Promise with payment methods response
 */
export const getPaymentMethods = async (params: {
  page?: number;
  limit?: number;
}): Promise<PaymentResponse> => {
  try {
    const response = await api.get<PaymentResponse>("/payment", {
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Không thể tải danh sách phương thức thanh toán"
    );
  }
};
