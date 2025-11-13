"use client";

import {
  getDashboardTopStationBookingAPI,
  getDashboardTopStationRatingAPI,
} from "@/services/dashboardService";
import { Station } from "@/types";
import React, { useEffect, useState } from "react";

export default function StationRate() {
  const [topBookingStation, setTopBookingStation] = useState<Station | null>(
    null
  );

  const [topRatingStation, setTopRatingStation] = useState<Station | null>(
    null
  );
  const fetchStationRate = async () => {
    try {
      const topBooking = await getDashboardTopStationBookingAPI();
      setTopBookingStation(topBooking.data.topMost[0]);

      const topRating = await getDashboardTopStationRatingAPI();
      setTopRatingStation(topRating.data.highest);
      console.log("rate", topRating.data.highest);
    } catch (error) {
      console.log("err", error);
    }
  };
  useEffect(() => {
    fetchStationRate();
  }, []);

  return (
    <div className="col-span-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trạm được đặt nhiều nhất */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
          <h3 className="font-semibold text-lg text-gray-800 mb-4 text-center">
            🚉 Trạm được đặt nhiều nhất
          </h3>
          <div className="flex flex-col items-center">
            <div className="w-full h-44 rounded-xl overflow-hidden mb-3">
              <img
                src={topBookingStation?.image || "/placeholder.png"}
                alt={topBookingStation?.name || "station"}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <p className="font-semibold text-gray-900 text-center text-base">
              {topBookingStation?.name || "Không có dữ liệu"}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Tổng đơn đặt lịch:{" "}
              <span className="font-medium text-blue-600">
                {topBookingStation?.bookingCount || 0}
              </span>
            </p>
          </div>
        </div>

        {/* Trạm đánh giá cao nhất */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
          <h3 className="font-semibold text-lg text-gray-800 mb-4 text-center">
            ⭐ Trạm đánh giá cao nhất
          </h3>
          <div className="flex flex-col items-center">
            <div className="w-full h-44 rounded-xl overflow-hidden mb-3">
              <img
                src={topRatingStation?.image || "/placeholder.png"}
                alt={topRatingStation?.name || "station"}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <p className="font-semibold text-gray-900 text-center text-base">
              {topRatingStation?.name || "Không có dữ liệu"}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Tổng điểm:{" "}
              <span className="font-medium text-emerald-600">
                {topRatingStation?.avgRating || 0}
              </span>{" "}
              • Tổng đánh giá:{" "}
              <span className="font-medium text-blue-600">
                {topRatingStation?.feedbackCount || 0}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
