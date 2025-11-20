"use client";

import { StaffLayout } from "@/layout/StaffLayout";
import { getStationById } from "@/services/stationService";
import { RootState } from "@/store";
import { Station } from "@/types";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import dynamic from "next/dynamic";

export default function StaffDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [station, setStation] = useState<Station | null>(null);
  const socketRef = useRef<any>(null);

  const handleStartConnectSocket = async () => {
    try {
      // Kết nối socket
      const socket = io("https://amply.io.vn/chat", {
        transports: ["websocket"],
        withCredentials: true,
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("Connected:", socket.id);
        // socket.emit("joinRoom", { roomId: roomData.id });
      });
    } catch (err) {
      console.error("Lỗi khi bắt đầu chat:", err);
    }
  };

  const fetchStationData = async () => {
    try {
      const stationResponse = await getStationById(Number(user?.stationId));

      if (stationResponse.success) {
        setStation(stationResponse.data);
      }
    } catch (error: unknown) {
      console.error("Error fetching station or cabinets:", error);
    }
  };

  useEffect(() => {
    if (!socketRef.current) {
      handleStartConnectSocket();
    }

    fetchStationData();
  }, [user]);

  const StaffTransactionChart = dynamic(
    () => import("./chart/StaffTransactionChart"),
    {
      ssr: false,
    }
  );
  const StaffRevenueChart = dynamic(() => import("./chart/StaffRevenueChart"), {
    ssr: false,
  });

  return (
    <StaffLayout>
      <div className="min-h-screen space-y-4">
        {/*Overall */}
        <div className="w-full bg-white/90 rounded-3xl p-10 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-blue-700 mb-2">
                Nhân viên {station?.name}
              </h1>
              <p className="text-lg text-gray-600 mb-2">
                Chào mừng đến trang quản lý
              </p>
            </div>
          </div>
        </div>

        {/*Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 gap-4 grid grid-cols-1">
          <StaffRevenueChart />
          <div className="grid grid-cols-3 gap-4">
            <StaffTransactionChart />
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}
