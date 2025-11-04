import api from "@/lib/axios";

export const getChatRoomByUserId = async () => {
  const res = await api.get(`/chat-rooms/by-userId`);
  return res.data;
};

export const getChatRoomByRoomId = async (id: number) => {
  const res = await api.get(`/chat-rooms/${id}`);
  return res.data;
};

export const getAllChatRoom = async () => {
  const res = await api.get(`/chat-rooms`);
  return res.data;
};

export const sendMessageAPI = async <T>(data: T) => {
  const res = await api.post(`/chat-messages`, data);
  return res.data;
};

export const staffStartChatAPI = async <T>(data: T) => {
  const res = await api.post(`/chat-rooms/staff-start-chat`, data);
  return res.data;
};
