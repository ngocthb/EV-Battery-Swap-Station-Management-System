import api from "@/lib/axios";

export const getBatteryById = async (id: number) => {
  const res = await api.get(`/battery/${id}`);
  return res.data;
};

export const getAllBatteryListAPI = async <T>(params: T) => {
  const res = await api.get("/battery", { params });
  return res.data;
};

export const createBatteryAPI = async <T>(data: T) => {
  const res = await api.post("/battery", data);
  return res.data;
};

export const deleteBatteryAPI = async (id: number) => {
  const res = await api.delete(`/battery/${id}`);
  return res.data;
};

export const updateBatteryAPI = async <T>(id: number, data: T) => {
  const res = await api.patch(`/battery/${id}`, data);
  return res.data;
};

export const restoreBatteryAPI = async (id: number) => {
  const res = await api.patch(`/battery/restore/${id}`);
  return res.data;
};
