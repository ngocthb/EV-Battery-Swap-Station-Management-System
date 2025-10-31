"use client";

import { useAuth } from "@/hooks/useAuth";
import useFetchList from "@/hooks/useFetchList";
import { UserLayout } from "@/layout/UserLayout";
import { getUserBookingListAPI } from "@/services/bookingService";
import { CalendarDays, CreditCard } from "lucide-react";
import { useState } from "react";
import BookingHistory from "./component/BookingHistory";
import { formatDateHCM } from "@/utils/format";

const ProfilePage: React.FC = () => {
  const { user, refreshProfile } = useAuth();

  console.log("user ", user);

  const [activeTab, setActiveTab] = useState<"payment" | "booking">("booking");

  const { data: bookingList = [], refresh } = useFetchList<[]>(
    getUserBookingListAPI
  );

  return (
    <UserLayout>
      <div className="px-16 py-8 bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-semibold mb-6">Hồ sơ của tôi</h2>

        <div className="grid grid-cols-12 gap-6">
          {/* LEFT SIDEBAR */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white rounded-lg shadow p-6">
              {/* Thẻ thành viên */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gray-200 mb-3 flex items-center justify-center text-xl font-semibold text-gray-500">
                  {user?.fullName?.[0]?.toUpperCase() || "U"}
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {user?.fullName || "Người dùng"}
                </h3>
                <p className="text-sm text-gray-500">{user?.email}</p>

                <div className="w-[300px] mt-4 rounded-xl p-4 text-white bg-gradient-to-r from-blue-500 to-indigo-500 shadow-md">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold">
                      {user?.memberships?.[0]?.membership?.name ??
                        "Chưa có thẻ"}
                    </h3>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                      {user?.memberships?.[0]?.remainingSwaps ?? 0} lần còn lại
                    </span>
                  </div>

                  <p className="text-sm">
                    {user?.memberships?.[0]?.membership?.description ?? ""}
                  </p>

                  <div className="mt-4 border-t border-white/30 pt-3 text-sm">
                    <p className="flex justify-between">
                      <span>Ngày hết hạn:</span>
                      <span className="font-medium">
                        {formatDateHCM(
                          String(user?.memberships?.[0]?.expiredDate)
                        ) ?? ""}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Nút chuyển tab */}
              <div className="space-y-3">
                <button
                  onClick={() => setActiveTab("booking")}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition
                    ${
                      activeTab === "booking"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    }`}
                >
                  <CalendarDays className="w-4 h-4" />
                  Lịch sử đặt lịch
                </button>

                <button
                  onClick={() => setActiveTab("payment")}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition
                    ${
                      activeTab === "payment"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    }`}
                >
                  <CreditCard className="w-4 h-4" />
                  Lịch sử thanh toán
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {activeTab === "booking" && <BookingHistory />}

            {activeTab === "payment" && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Lịch sử thanh toán
                </h3>
                <p className="text-gray-600 text-sm">
                  Hiển thị danh sách các giao dịch của bạn...
                </p>
                {/* TODO: Render payment history list */}
              </div>
            )}
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default ProfilePage;
