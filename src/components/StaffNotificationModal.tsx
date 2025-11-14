"use client";

import React, { useEffect, useState, useRef } from "react";
import { X, Battery, MapPin, Clock, Bell } from "lucide-react";
import { io, Socket } from "socket.io-client";
import api from "@/lib/axios";
import { LoadingSpinner } from "./LoadingSpinner";

interface BatteryType {
  id: number;
  name: string;
}

interface BatteryInfo {
  id: number;
  model: string;
  currentCycle: number;
  healthScore: number;
  status: string;
  inUse: boolean;
  batteryType: BatteryType;
}

interface Station {
  id: number;
  name: string;
  address: string;
}

interface TransferRequest {
  id: number;
  status: string;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  battery: BatteryInfo;
  currentStation: Station;
  newStation: Station;
}

interface StaffNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  stationId?: number;
  hasNewNotification: boolean;
  onNotificationRead: () => void;
}

export const StaffNotificationModal: React.FC<StaffNotificationModalProps> = ({
  isOpen,
  onClose,
  stationId,
  hasNewNotification,
  onNotificationRead,
}) => {
  const [requests, setRequests] = useState<TransferRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  // Fetch requests from API
  const fetchRequests = async () => {
    if (!stationId) return;

    try {
      setLoading(true);
      const response = await api.get(`/request/station/${stationId}`, {
        params: { page: 1, limit: 10 },
      });
      setRequests(response.data.data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRequests();
      // Mark notifications as read when modal opens
      onNotificationRead();
    }
  }, [isOpen, stationId]);

  // Setup socket connection for real-time updates
  useEffect(() => {
    if (!stationId) return;

    // Connect to socket
    const socket: Socket = io("https://amply.io.vn/request", {
      path: "/socket.io",
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Staff notification socket connected");
    });

    socket.on("request_created", (data: any) => {
      console.log("New request created:", data);
      if (
        data.currentStationId === stationId ||
        data.newStationId === stationId
      ) {
        fetchRequests();
      }
    });

    socket.on("request_updated", (data: any) => {
      console.log("Request updated:", data);
      if (
        data.currentStationId === stationId ||
        data.newStationId === stationId
      ) {
        fetchRequests();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [stationId]);

  if (!isOpen) return null;

  if (!isOpen) return null;

  const getDirectionText = (request: TransferRequest) => {
    if (!stationId) return "";

    if (request.currentStation.id === stationId) {
      return `Bạn cần chuyển pin cho ${request.newStation.name}`;
    } else if (request.newStation.id === stationId) {
      return `Bạn nhận pin từ ${request.currentStation.name}`;
    }
    return "";
  };

  const getDirectionColor = (request: TransferRequest) => {
    if (!stationId) return "text-gray-600";

    if (request.status === "COMPLETED") {
      return "text-gray-600";
    }

    if (request.currentStation.id === stationId) {
      return "text-red-600";
    } else if (request.newStation.id === stationId) {
      return "text-green-600";
    }
    return "text-gray-600";
  };

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 z-50 flex items-start justify-end">
      <div className="bg-white w-full max-w-md h-screen shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Thông báo chuyển pin
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner />
              <span className="ml-2 text-gray-500">Đang tải...</span>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Chưa có yêu cầu chuyển pin</p>
            </div>
          ) : (
            requests.map((request) => (
              <div
                key={request.id}
                className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      request.status === "COMPLETED"
                        ? "bg-gray-400"
                        : request.currentStation.id === stationId
                        ? "bg-red-500"
                        : "bg-green-500"
                    }`}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium ${getDirectionColor(
                        request
                      )}`}
                    >
                      {getDirectionText(request)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Pin {request.battery.model} •{" "}
                      {new Date(request.createdAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Add this to your global CSS for the animation
// @keyframes slide-in-right {
//   from {
//     transform: translateX(100%);
//   }
//   to {
//     transform: translateX(0);
//   }
// }
// .animate-slide-in-right {
//   animation: slide-in-right 0.3s ease-out;
// }
