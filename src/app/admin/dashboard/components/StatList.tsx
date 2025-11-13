"use client";

import {
  getDashboardActiveMembershipByMonthCountAPI,
  getDashboardBookingCompleteByMonthCountAPI,
  getDashboardStationCountAPI,
  getDashboardUserCountAPI,
} from "@/services/dashboardService";
import { Calendar, Crown, MapPin, Users, ArrowUp } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const StatCard = ({ title, value, icon: Icon, color }: StatCardProps) => {
  const [bgColor, textColor] = color.split(" ");

  return (
    <div
      className={`flex flex-col justify-between rounded-2xl p-4 ${bgColor} ${textColor} shadow-sm border border-transparent hover:shadow-md transition-all duration-200`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-base font-medium opacity-70 mb-2">{title}</p>
          <h3 className="text-3xl font-bold">{value}</h3>
        </div>

        <div className="p-2 rounded-xl bg-white backdrop-blur-sm flex items-center justify-center">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default function StatList() {
  const [userCount, setUserCount] = useState(0);
  const [stationCount, setStationCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [membershipActiveCount, setMembershipActiveCount] = useState(0);
  const now = new Date();
  const [month, setMonth] = useState<number>(now.getMonth() + 1);
  const [year, setYear] = useState<number>(now.getFullYear());

  const monthNames = useMemo(
    () => [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ],
    []
  );

  const fetchDashboardCount = async (m: number, y: number) => {
    try {
      const user = await getDashboardUserCountAPI();
      setUserCount(user.data.countUsers);
      const station = await getDashboardStationCountAPI();
      setStationCount(station.data.countStations);

      const booking = await getDashboardBookingCompleteByMonthCountAPI({
        month: m,
        year: y,
      });
      setBookingCount(booking.data.count ?? 0);
      const membership = await getDashboardActiveMembershipByMonthCountAPI({
        month: m,
        year: y,
      });
      setMembershipActiveCount(membership.data.count ?? 0);
    } catch (error) {
      console.log("fetchDashboardCount err", error);
    }
  };

  useEffect(() => {
    fetchDashboardCount(month, year);
  }, [month, year]);

  return (
    <div className="bg-white p-6 border border-gray-100 rounded-xl">
      {/* Filter row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 mr-2">Lọc theo tháng</span>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="px-3 py-2 rounded-full text-sm font-medium bg-gray-100"
          >
            {monthNames.map((m, idx) => (
              <option key={m} value={idx + 1}>
                {m}
              </option>
            ))}
          </select>
          <p>năm</p>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="px-3 py-2 rounded-full text-sm font-medium bg-gray-100"
          >
            {Array.from({ length: 6 }).map((_, i) => {
              const y = now.getFullYear() - (5 - i);
              return (
                <option key={y} value={y}>
                  {y}
                </option>
              );
            })}
          </select>
        </div>
        <div />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={`Đặt lịch T${monthNames[month - 1].slice(0, 3)}/${year}`}
          value={bookingCount}
          icon={Calendar}
          color="bg-blue-50 text-blue-900"
        />
        <StatCard
          title={`Thành viên mới T${monthNames[month - 1].slice(0, 3)}/${year}`}
          value={membershipActiveCount}
          icon={Crown}
          color="bg-pink-50 text-pink-900"
        />
        <StatCard
          title="Người dùng"
          value={userCount}
          icon={Users}
          color="bg-purple-50 text-purple-900"
        />
        <StatCard
          title="Số trạm"
          value={stationCount}
          icon={MapPin}
          color="bg-green-50 text-green-900"
        />
      </div>
    </div>
  );
}
