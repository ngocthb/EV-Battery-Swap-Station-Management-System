import api from "@/lib/axios";

export const getUserBookingListAPI = async <T>(params: T) => {
  const res = await api.get(`/booking/my`, { params });
  return res.data;
};

export const getAllBookingListAPI = async <T>(params: T) => {
  const res = await api.get(`/booking`, { params });
  return res.data;
};

export const createBookingAPI = async <T>(data: T) => {
  const res = await api.post("/booking", data);
  return res.data;
};

// export const deleteBookingAPI = async (id: number) => {
//   const res = await api.delete(`/booking/${id}`);
//   return res.data;
// };

// export const updateBookingAPI = async <T>(id: number, data: T) => {
//   const res = await api.patch(`/booking/${id}`, data);
//   return res.data;
// };
