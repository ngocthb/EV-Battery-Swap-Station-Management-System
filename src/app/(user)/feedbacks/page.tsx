"use client";

import React, { useState } from "react";
import FeedbackForm from "./components/FeedbackForm";
import FeedbackList from "./components/FeedbackList";
import { User } from "lucide-react";
import { UserLayout } from "@/layout/UserLayout";

interface FeedbackPageProps {
  stationId?: number; // Optional: if provided, will pre-select this station
}

const FeedbackPage: React.FC<FeedbackPageProps> = ({ stationId }) => {
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleFeedbackSuccess = () => {
    // Refresh danh sách sau khi tạo feedback thành công
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-100 rounded-full mb-6">
            <span className="text-sm font-medium text-blue-600">
              Đánh giá & Phản hồi
            </span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Chia sẻ trải nghiệm của bạn về trạm đổi pin
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Giúp chúng tôi cải thiện dịch vụ bằng cách gửi đánh giá và phản hồi
            chân thực từ bạn.
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
