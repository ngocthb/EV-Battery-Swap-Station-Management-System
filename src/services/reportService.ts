import api from "@/lib/axios";

export const getReportByUserBookingAPI = async <T>(params: T) => {
  const res = await api.get(`/report/by-user-booking`, { params });
  return res.data;
};

export const getAllReportByStationAPI = async <T>(params: T) => {
  const res = await api.get(`/report/by-station`, { params });
  return res.data;
};

export const createReportAPI = async <T>(data: T) => {
  const res = await api.post("/report", data);
  return res.data;
};
