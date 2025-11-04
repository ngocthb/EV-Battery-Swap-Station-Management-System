import api from "@/lib/axios";

export const getAllStationStaffAPI = async <T>(params: T) => {
  const res = await api.get("/station-staff", { params });
  return res.data;
};

export const getAllStationStaffByStation = async <T>(params: T) => {
  const res = await api.get("/station-staff/by-station", { params });
  return res.data;
};

export const createStationStaffAPI = async <T>(data: T) => {
  const res = await api.post("/station-staff/create-account", data);
  return res.data;
};
