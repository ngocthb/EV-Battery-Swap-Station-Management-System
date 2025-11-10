import api from "@/lib/axios";

export const getAllTransactionAPI = async <T>(params: T) => {
  const res = await api.get("/transaction/all", { params });
  return res.data;
};

export const getAllTransactionByStation = async <T>(params: T) => {
  const res = await api.get("/transaction/by-station", { params });
  return res.data;
};

export const getAllUserTransactionAPI = async <T>(params: T) => {
  const res = await api.get("/transaction/by-user", { params });
  return res.data;
};

export const staffConfirmCashPaymentAPI = async <T>(data: T) => {
  const res = await api.post("/transaction/confirm-cash-payment", data);
  return res.data;
};

export interface PaymentCallbackRequest {
  code: string;
  orderCode: number;
  status: string;
}

export interface PaymentCallbackResponse {
  success: boolean;
  message: string;
}

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
