import api from "@/lib/axios";

export const getAllUserListAPI = async <T>(params: T) => {
  const res = await api.get(`/user`, { params });
  return res.data;
};

export const getUserDetailPI = async (id: number) => {
  const res = await api.get(`/user/${id}`);
  return res.data;
};
