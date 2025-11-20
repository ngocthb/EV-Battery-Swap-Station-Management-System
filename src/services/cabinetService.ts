import api from "@/lib/axios";

export const getCabinetsById = async (id: number) => {
  const res = await api.get(`/cabinet/${id}`);
  return res.data;
};

export const getCabinetsByStationId = async (id: number) => {
  const res = await api.get(`/cabinet/public/by-station/${id}`);
  return res.data;
};

export const getCabinetsByStationIdAndBatteryTypeId = async <T>(
  id: number,
  params: T
) => {
  const res = await api.get(`/cabinet/public/by-station-and-type/${id}`, {
    params,
  });
  return res.data;
};

export const getAllCabinetListAPI = async <T>(params: T) => {
  const res = await api.get("/cabinet", { params });
  return res.data;
};

export const getCabinetByIdAPI = async (id: number) => {
  const res = await api.get(`/cabinet/${id}`);
  return res.data;
};
export const createCabinetAPI = async <T>(data: T) => {
  const res = await api.post("/cabinet", data);
  return res.data;
};

export const deleteCabinetAPI = async (id: number) => {
  const res = await api.delete(`/cabinet/${id}`);
  return res.data;
};

export const updateCabinetAPI = async <T>(id: number, data: T) => {
  const res = await api.patch(`/cabinet/${id}`, data);
  return res.data;
};

export const restoreCabinetAPI = async (id: number) => {
  const res = await api.patch(`/cabinet/restore/${id}`);
  return res.data;
};
