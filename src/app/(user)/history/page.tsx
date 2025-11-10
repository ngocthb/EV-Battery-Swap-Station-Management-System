"use client";

import { useAuth } from "@/hooks/useAuth";
import useFetchList from "@/hooks/useFetchList";
import { UserLayout } from "@/layout/UserLayout";
import { getUserBookingListAPI } from "@/services/bookingService";
import { CalendarDays, CreditCard, Crown, Star } from "lucide-react";
import { useState } from "react";
import BookingHistory from "./component/BookingHistory";
import { formatDateHCM } from "@/utils/format";
import TransactionHistory from "./component/TransactionHistory";
import { useRouter } from "next/navigation";

type TabKey = "booking" | "payment" | "membership" | "feedback";

const tabs: {
  key: TabKey;
  label: string;
  icon: any;
  onClick?: () => void;
}[] = [
  {
    key: "booking",
    label: "Lịch sử đặt lịch",
    icon: CalendarDays,
  },
  {
    key: "payment",
    label: "Lịch sử thanh toán",
    icon: CreditCard,
  },
  {
    key: "membership",
    label: "Xem gói thành viên",
    icon: Crown,
  },
  {
    key: "feedback",
    label: "Xem đánh giá của trạm",
    icon: Star,
  },
];

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();

  const [activeTab, setActiveTab] = useState<
    "payment" | "booking" | "membership" | "feedback"
  >("booking");

  return (
    <UserLayout>
      <div className="px-16 py-8 bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-semibold mb-6">Lịch sử</h2>

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
                    {user?.memberships?.[0]?.membership?.name !== "VIP" && (
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                        {user?.memberships?.[0]?.remainingSwaps ?? 0} lần còn
                        lại
                      </span>
                    )}
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
              <div className="space-y-2 mt-4">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.key;

                  const handleClick = () => {
                    if (tab.key === "membership") {
                      router.push("/membership");
                    } else if (tab.key === "feedback") {
                      router.push("/feedbacks");
                    } else {
                      setActiveTab(tab.key);
                    }
                  };

                  return (
                    <button
                      key={tab.key}
                      onClick={handleClick}
                      className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-full text-sm font-medium transition-all duration-200
                                  ${
                                    isActive
                                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md scale-[1.02]"
                                      : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                                  }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? "text-white" : "text-gray-500"
                        }`}
                      />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {activeTab === "booking" && <BookingHistory />}

            {activeTab === "payment" && <TransactionHistory />}
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default ProfilePage;
