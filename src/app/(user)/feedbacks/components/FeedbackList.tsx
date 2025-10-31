"use client";

import React, { useEffect, useState } from "react";
import { useFeedback } from "../hooks/useFeedback";
import { Feedback } from "@/services/feedbackService";
import { getAllPublicStationList } from "@/services/stationService";

interface Station {
  id: number;
  name: string;
  address: string;
}

interface FeedbackListProps {
  preSelectedStationId?: number;
  showMyFeedbacks?: boolean;
}

const FeedbackList: React.FC<FeedbackListProps> = ({
  preSelectedStationId,
  showMyFeedbacks = false,
}) => {
  const {
    feedbacks,
    loading,
    getMyFeedbacks,
    getStationFeedbacks,
    updateFeedback,
  } = useFeedback();
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStationId, setSelectedStationId] = useState<number | null>(
    preSelectedStationId || null
  );
  const [loadingStations, setLoadingStations] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editRating, setEditRating] = useState(5);

  useEffect(() => {
    loadStations();
  }, []);

  useEffect(() => {
    if (selectedStationId) {
      loadFeedbacks();
    }
  }, [selectedStationId, showMyFeedbacks]);

  const loadStations = async () => {
    try {
      setLoadingStations(true);
      const response = await getAllPublicStationList({ page: 1, limit: 100 });
      setStations(response.data || []);

      // Auto-select first station if no pre-selected station
      if (!preSelectedStationId && response.data?.length > 0) {
        setSelectedStationId(response.data[0].id);
      }
    } catch (error) {
      console.error("Failed to load stations:", error);
    } finally {
      setLoadingStations(false);
    }
  };

  const loadFeedbacks = async () => {
    if (!selectedStationId) return;

    if (showMyFeedbacks) {
      await getMyFeedbacks(1, 10, selectedStationId);
    } else {
      await getStationFeedbacks(selectedStationId, 1, 10);
    }
  };

  const handleEdit = (feedback: Feedback) => {
    setEditingId(feedback.id);
    setEditContent(feedback.content);
    setEditRating(feedback.rating);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent("");
    setEditRating(5);
  };

  const handleSaveEdit = async (feedbackId: number) => {
    try {
      await updateFeedback(feedbackId, {
        content: editContent,
        rating: editRating,
      });
      setEditingId(null);
      await loadFeedbacks();
    } catch (error) {
      console.error("Failed to update feedback:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderStars = (
    rating: number,
    isEditing: boolean = false,
    onRate?: (r: number) => void
  ) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => isEditing && onRate && onRate(star)}
            disabled={!isEditing}
            className={`focus:outline-none ${
              isEditing ? "cursor-pointer" : "cursor-default"
            }`}
          >
            <svg
              className={`w-5 h-5 ${
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-200 text-gray-200"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {showMyFeedbacks ? "Đánh giá của tôi" : "Tất cả đánh giá"}
      </h2>

      {/* Station Selector */}
      {!preSelectedStationId && (
        <div className="mb-6">
          <label
            htmlFor="station-filter"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Lọc theo trạm
          </label>
          {loadingStations ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <select
              id="station-filter"
              value={selectedStationId || ""}
              onChange={(e) => setSelectedStationId(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- Chọn trạm --</option>
              {stations.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.name}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {!selectedStationId ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p className="mt-4 text-gray-500">
            Vui lòng chọn trạm để xem đánh giá
          </p>
        </div>
      ) : loading && feedbacks.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <p className="mt-4 text-gray-500">Chưa có đánh giá nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {editingId === feedback.id ? (
                // Edit Mode
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Đánh giá
                    </label>
                    {renderStars(editRating, true, setEditRating)}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nội dung
                    </label>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveEdit(feedback.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                    >
                      Lưu
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {renderStars(feedback.rating)}
                      <span className="text-sm text-gray-600">
                        ({feedback.rating} sao)
                      </span>
                    </div>
                    {showMyFeedbacks && (
                      <button
                        onClick={() => handleEdit(feedback)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Chỉnh sửa
                      </button>
                    )}
                  </div>
                  <p className="text-gray-800 mb-2">{feedback.content}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>User ID: {feedback.userId}</span>
                    <span>{formatDate(feedback.createdAt)}</span>
                  </div>
                  {feedback.createdAt !== feedback.updatedAt && (
                    <p className="text-xs text-gray-400 mt-1">(Đã chỉnh sửa)</p>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackList;
