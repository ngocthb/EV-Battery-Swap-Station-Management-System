"use client";

import React, { useState, useEffect } from "react";
import { useFeedback } from "../hooks/useFeedback";
import { getAllPublicStationList } from "@/services/stationService";

interface Station {
  id: number;
  name: string;
  address: string;
  description: string;
  image: string;
  slotAvailable: number;
  slotCharging: number;
}

interface FeedbackFormProps {
  preSelectedStationId?: number;
  onSuccess?: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({
  preSelectedStationId,
  onSuccess,
}) => {
  const { createFeedback, loading } = useFeedback();
  const [stations, setStations] = useState<Station[]>([]);
  const [loadingStations, setLoadingStations] = useState(true);
  const [selectedStationId, setSelectedStationId] = useState<number | null>(
    preSelectedStationId || null
  );
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    loadStations();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      return;
    }

    if (!selectedStationId) {
      return;
    }

    try {
      await createFeedback({
        stationId: selectedStationId,
        content: content.trim(),
        rating,
      });

      // Reset form
      setContent("");
      setRating(5);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    }
  };

  const selectedStation = stations.find((s) => s.id === selectedStationId);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Đánh giá trạm</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Station Selector */}
        <div>
          <label
            htmlFor="station"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Chọn trạm
          </label>
          {loadingStations ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <select
                id="station"
                value={selectedStationId || ""}
                onChange={(e) => setSelectedStationId(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!!preSelectedStationId}
                required
              >
                <option value="">-- Chọn trạm --</option>
                {stations.map((station) => (
                  <option key={station.id} value={station.id}>
                    {station.name}
                  </option>
                ))}
              </select>

              {/* Station Info Preview */}
              {selectedStation && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    {selectedStation.image && (
                      <img
                        src={selectedStation.image}
                        alt={selectedStation.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {selectedStation.name}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {selectedStation.address}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Trống: {selectedStation.slotAvailable}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                          Đang sạc: {selectedStation.slotCharging}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        {/* Rating Stars */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Đánh giá của bạn
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <svg
                  className={`w-8 h-8 ${
                    star <= (hoveredRating || rating)
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
            <span className="ml-2 text-sm text-gray-600">({rating} sao)</span>
          </div>
        </div>

        {/* Content Textarea */}
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nội dung đánh giá
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Chia sẻ trải nghiệm của bạn về trạm..."
            required
          />
          <p className="mt-1 text-sm text-gray-500">{content.length} ký tự</p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !content.trim() || !selectedStationId}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Đang gửi...
            </span>
          ) : (
            "Gửi đánh giá"
          )}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
