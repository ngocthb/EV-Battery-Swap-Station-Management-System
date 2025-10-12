import api from "@/lib/axios";

export const getAllStationList = async <T>(params: T) => {
  const res = await api.get("/station", { params });
  return res.data;
};

export const getAllPublicStationList = async <T>(params: T) => {
  const res = await api.get("/station/public", { params });

  return res.data;
};

export const createStation = async (data: {
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  temperature: number;
}): Promise<{
  success: boolean;
  message: string;
}> => {
  const res = await api.post("/station", data);
  const resData = res.data;
  return { success: resData.success, message: resData.message };
};

export const updateStation = async (
  id: number,
  data: {
    name: string;
    description: string;
    address: string;
    latitude: number;
    longitude: number;
    temperature: number;
  }
): Promise<{
  success: boolean;
  message: string;
}> => {
  const res = await api.patch(`/station/${id}`, data);
  const resData = res.data;
  return { success: resData.success, message: resData.message };
};

export const getStationById = async (id: number) => {
  const res = await api.get(`/station/${id}`);
  return res.data;
};

export const deleteStation = async (
  id: string | number
): Promise<{ success: boolean; message: string }> => {
  const res = await api.delete(`/station/${id}`);
  const data = res.data;
  return { success: data.success, message: data.message };
};

export const restoreStation = async (
  id: string | number
): Promise<{ success: boolean; message: string }> => {
  const res = await api.patch(`/station/restore/${id}`);
  const data = res.data;
  return { success: data.success, message: data.message };
};
