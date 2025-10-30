import api from "@/lib/axios";

export const getAllSlotListAPI = async <T>(params: T) => {
  const res = await api.get("/slot", { params });
  return res.data;
};

export const getSlotByIdAPI = async (id: number) => {
  const res = await api.get(`/slot/${id}`);
  return res.data;
};

export const createSlotAPI = async <T>(data: T) => {
  const res = await api.post("/slot", data);
  return res.data;
};

export const deleteSlotAPI = async (id: number) => {
  const res = await api.delete(`/slot/${id}`);
  return res.data;
};

export const updateSlotAPI = async <T>(id: number, data: T) => {
  const res = await api.patch(`/slot/${id}`, data);
  return res.data;
};

export const restoreSlotAPI = async (id: number) => {
  const res = await api.patch(`/slot/restore/${id}`);
  return res.data;
};
