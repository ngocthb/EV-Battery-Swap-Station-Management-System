import api from "@/lib/axios";

export const getBatteryTypeById = async (id: number) => {
  const res = await api.get(`/battery-type/${id}`);
  return res.data;
};

export const getPublicBatteryTypeListAPI = async <T>(params: T) => {
  const res = await api.get("/battery-type/public", { params });
  return res.data;
};

export const getAllBatteryTypeListAPI = async <T>(params: T) => {
  const res = await api.get("/battery-type", { params });

  console.log("getAllBatteryTypeListAPI", res.data);
  return res.data.data;
};

export const createBatteryTypeAPI = async <T>(data: T) => {
  const res = await api.post("/battery-type", data);
  return res.data;
};

export const deleteBatteryTypeAPI = async (id: number) => {
  const res = await api.delete(`/battery-type/${id}`);
  return res.data;
};

export const updateBatteryTypeAPI = async <T>(id: number, data: T) => {
  const res = await api.patch(`/battery-type/${id}`, data);
  return res.data;
};

export const restoreBatteryTypeAPI = async (id: number) => {
  const res = await api.patch(`/battery-type/restore/${id}`);
  return res.data;
};
