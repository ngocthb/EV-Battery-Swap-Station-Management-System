import api from "@/lib/axios";

export const getAllTransactionAPI = async <T>(params: T) => {
  const res = await api.get("/transaction/all", { params });
  return res.data;
};

export const getAllTransactionByStation = async <T>(params: T) => {
  const res = await api.get("/transaction/by-station", { params });
  return res.data;
};

export const staffConfirmCashPaymentAPI = async <T>(data: T) => {
  const res = await api.post("/transaction/confirm-cash-payment", data);
  return res.data;
};
