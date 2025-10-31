import { useState } from "react";
import { toast } from "react-toastify";
import feedbackService, {
  CreateFeedbackDto,
  UpdateFeedbackDto,
  Feedback,
} from "@/services/feedbackService";

export const useFeedback = () => {
  const [loading, setLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  // Tạo phản hồi mới
  const createFeedback = async (data: CreateFeedbackDto) => {
    setLoading(true);
    try {
      const response = await feedbackService.createFeedback(data);
      toast.success(response.message || "Gửi phản hồi thành công!");
      return response;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Không thể gửi phản hồi. Vui lòng thử lại.";
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Lấy phản hồi của người dùng
  const getMyFeedbacks = async (page = 1, limit = 10, stationId?: number) => {
    setLoading(true);
    try {
      const response = await feedbackService.getMyFeedbacks(
        page,
        limit,
        stationId
      );
      setFeedbacks(response.data || []);
      return response;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Không thể tải phản hồi. Vui lòng thử lại.";
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Lấy phản hồi của trạm
  const getStationFeedbacks = async (
    stationId: number,
    page = 1,
    limit = 10
  ) => {
    setLoading(true);
    try {
      const response = await feedbackService.getStationFeedbacks(
        stationId,
        page,
        limit
      );
      setFeedbacks(response.data || []);
      return response;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Không thể tải phản hồi. Vui lòng thử lại.";
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật phản hồi
  const updateFeedback = async (
    feedbackId: number,
    data: UpdateFeedbackDto
  ) => {
    setLoading(true);
    try {
      const response = await feedbackService.updateFeedback(feedbackId, data);
      toast.success(response.message || "Cập nhật phản hồi thành công!");
      return response;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Không thể cập nhật phản hồi. Vui lòng thử lại.";
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    feedbacks,
    createFeedback,
    getMyFeedbacks,
    getStationFeedbacks,
    updateFeedback,
  };
};
