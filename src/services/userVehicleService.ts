import api from "@/lib/axios";

export const getUserVehicleAPI = async () => {
  const res = await api.get(`/user-vehicle/by-user`);
  return res.data;
};

export const createUserVehicleAPI = async <T>(data: T) => {
  const res = await api.post("/user-vehicle", data);
  return res.data;
};

export const deleteUserVehicleAPI = async (id: number) => {
  const res = await api.delete(`/user-vehicle/${id}`);
  return res.data;
};

export const updateUserVehicleAPI = async <T>(id: number, data: T) => {
  const res = await api.patch(`/user-vehicle/${id}`, data);
  return res.data;
};


