import api from "@/lib/axios";

export const getVehicleTypeById = async (id: number) => {
  const res = await api.get(`/vehicle-type/${id}`);
  return res.data;
};

export const getAllVehicleTypeListAPI = async <T>(params: T) => {
  const res = await api.get("/vehicle-type", { params });
  return res.data;
};

export const createVehicleTypeAPI = async <T>(data: T) => {
  const res = await api.post("/vehicle-type", data);
  return res.data;
};

export const deleteVehicleTypeAPI = async (id: number) => {
  const res = await api.delete(`/vehicle-type/${id}`);
  return res.data;
};

export const updateVehicleTypeAPI = async <T>(id: number, data: T) => {
  const res = await api.patch(`/vehicle-type/${id}`, data);
  return res.data;
};

export const restoreVehicleTypeAPI = async (id: number) => {
  const res = await api.patch(`/vehicle-type/restore/${id}`);
  return res.data;
};
