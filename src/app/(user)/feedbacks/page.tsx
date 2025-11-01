"use client";

import React, { useState, useEffect } from "react";
import FeedbackForm from "./components/FeedbackForm";
import FeedbackList from "./components/FeedbackList";

interface FeedbackPageProps {
  searchParams?: Promise<{
    stationId?: string;
  }>;
}

const FeedbackPage: React.FC<FeedbackPageProps> = ({ searchParams }) => {
  const [stationId, setStationId] = useState<number | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Handle async searchParams (Next.js 15)
  useEffect(() => {
    const loadSearchParams = async () => {
      if (searchParams) {
        const params = await searchParams;
        if (params.stationId) {
          setStationId(parseInt(params.stationId));
        }
      }
      setIsLoading(false);
    };

    loadSearchParams();
  }, [searchParams]);

  const handleFeedbackSuccess = () => {
    // Refresh danh sách sau khi tạo feedback thành công
    setRefreshKey((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Đánh giá trạm sạc
          </h1>
          <p className="text-gray-600">
            Chia sẻ trải nghiệm của bạn và xem đánh giá từ cộng đồng
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Feedback Form */}
          <div className="lg:sticky lg:top-8 h-fit">
            <FeedbackForm
              preSelectedStationId={stationId}
              onSuccess={handleFeedbackSuccess}
            />
          </div>

          {/* Right Column - Feedback List */}
          <div>
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md mb-6">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                    activeTab === "all"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Tất cả đánh giá
                </button>
                <button
                  onClick={() => setActiveTab("my")}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                    activeTab === "my"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Đánh giá của tôi
                </button>
              </div>
            </div>

            {/* Feedback List */}
            <FeedbackList
              key={`${activeTab}-${refreshKey}`}
              preSelectedStationId={stationId}
              showMyFeedbacks={activeTab === "my"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
