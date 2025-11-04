import api from "@/lib/axios";

export interface Feedback {
  id: number;
  userId: number;
  stationId: number;
  content: string;
  rating: number;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeedbackDto {
  stationId: number;
  content: string;
  rating: number;
}

export interface UpdateFeedbackDto {
  content?: string;
  rating?: number;
}

export interface FeedbackResponse {
  success: boolean;
  message: string;
  data?: Feedback[];
}

export interface CreateFeedbackResponse {
  success: boolean;
  message: string;
}

const feedbackService = {
  // Tạo phản hồi mới
  createFeedback: async (
    data: CreateFeedbackDto
  ): Promise<CreateFeedbackResponse> => {
    const response = await api.post("/feedback", data);
    return response.data;
  },

  // Lấy phản hồi của người dùng hiện tại
  getMyFeedbacks: async (
    page: number = 1,
    limit: number = 10,
    stationId?: number
  ): Promise<FeedbackResponse> => {
    const params: any = { page, limit };
    if (stationId) params.stationId = stationId;

    const response = await api.get("/feedback/my", { params });
    return response.data;
  },

  // Lấy tất cả phản hồi của một trạm
  getStationFeedbacks: async (
    stationId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<FeedbackResponse> => {
    const response = await api.get(`/feedback/station/${stationId}`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Cập nhật phản hồi
  updateFeedback: async (
    feedbackId: number,
    data: UpdateFeedbackDto
  ): Promise<CreateFeedbackResponse> => {
    const response = await api.patch(`/feedback/${feedbackId}`, data);
    return response.data;
  },
};

export default feedbackService;
