import api from "@/lib/axios";

export const getAllStationList = async <T>(params: T) => {
  const res = await api.get("/station", { params });

  return res;
};

export const getAllPublicStationList = async <T>(params: T) => {
  const res = await api.get("/station/public", { params });

  return res;
};
