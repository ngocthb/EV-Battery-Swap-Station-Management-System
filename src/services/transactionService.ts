import api from "@/lib/axios";

export interface PaymentCallbackRequest {
  code: string;
  orderCode: number;
  status: string;
}

export interface PaymentCallbackResponse {
  success: boolean;
  message: string;
}

/**
 * Send payment callback to update transaction status
 * @param data - Payment callback data from PayOS
 * @returns Promise with callback response
 */
export const sendPaymentCallback = async (
  data: PaymentCallbackRequest
): Promise<PaymentCallbackResponse> => {
  try {
    const response = await api.post<PaymentCallbackResponse>(
      "/transaction/payos-callback",
      data
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Không thể cập nhật trạng thái thanh toán"
    );
  }
};
