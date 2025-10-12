import api from "@/lib/axios";

export const getAllMembershipList = async <T>(params: T) => {
  const res = await api.get("/membership", { params });
  return res.data;
};

export const createMembership = async (data: {
  name: string;
  description: string;
  duration: number;
  price: number;
}): Promise<{
  success: boolean;
  message: string;
}> => {
  const res = await api.post("/membership", data);
  const resData = res.data;
  return { success: resData.success, message: resData.message };
};

export const updateMembership = async (
  id: number,
  data: {
    name: string;
    description: string;
    duration: number;
    price: number;
  }
): Promise<{
  success: boolean;
  message: string;
}> => {
  const res = await api.patch(`/membership/${id}`, data);
  const resData = res.data;
  return { success: resData.success, message: resData.message };
};

export const getMembershipById = async (id: number) => {
  const res = await api.get(`/membership/${id}`);
  return res.data;
};

export const deleteMembership = async (
  id: string | number
): Promise<{ success: boolean; message: string }> => {
  const res = await api.delete(`/membership/${id}`);
  const data = res.data;
  return { success: data.success, message: data.message };
};

export const restoreMembership = async (
  id: string | number
): Promise<{ success: boolean; message: string }> => {
  const res = await api.patch(`/membership/restore/${id}`);
  const data = res.data;
  return { success: data.success, message: data.message };
};
