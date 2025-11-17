"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
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
  healthScore: number;
}

interface Request {
  id: number;
  status: string;
  requestedQuantity: number;
  approvedQuantity: number | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  batteryType: BatteryType | null;
  batteries: BatteryInfo[];
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
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);
  const [highlightedRequests, setHighlightedRequests] = useState<
    Record<number, "accepted" | "rejected">
  >({});
  const socketRef = useRef<Socket | null>(null);

  const latestRequestId = useMemo(() => {
    if (!requests || requests.length === 0) return null;
    const latest = requests.reduce((a, b) =>
      new Date(a.createdAt) > new Date(b.createdAt) ? a : b
    );
    return latest.id;
  }, [requests]);

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
      // clear highlighted requests when user opens modal
      setHighlightedRequests({});
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

    // helper to extract ids from various payload shapes
    const extractRequestId = (data: any) => {
      return (
        data?.requestId ||
        data?.id ||
        data?.request?.id ||
        data?.payload?.requestId ||
        null
      );
    };
    const extractStationId = (data: any) => {
      return (
        data?.stationId || data?.station?.id || data?.payload?.stationId || null
      );
    };

    socket.on("request_created", (data: any) => {
      console.log("New request created (socket):", data);
      const sid = extractStationId(data);
      if (sid === stationId) {
        fetchRequests();
      }
    });

    // support both snake_case and camelCase event names (backend may vary)
    const handleAccepted = (data: any) => {
      console.log("Request accepted (socket):", data);
      const sid = extractStationId(data);
      const rid = extractRequestId(data);
      if (sid === stationId && rid) {
        fetchRequests();
        setHighlightedRequests((prev) => ({ ...prev, [rid]: "accepted" }));
      }
    };
    const handleRejected = (data: any) => {
      console.log("Request rejected (socket):", data);
      const sid = extractStationId(data);
      const rid = extractRequestId(data);
      if (sid === stationId && rid) {
        fetchRequests();
        setHighlightedRequests((prev) => ({ ...prev, [rid]: "rejected" }));
      }
    };

    socket.on("request_accepted", handleAccepted);
    socket.on("requestAccepted", handleAccepted);
    socket.on("request_rejected", handleRejected);
    socket.on("requestRejected", handleRejected);

    socket.on("request_updated", (data: any) => {
      console.log("Request updated (socket):", data);
      const sid = extractStationId(data);
      if (sid === stationId) {
        fetchRequests();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [stationId]);

  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500";
      case "TRANSFERRING":
        return "bg-blue-500";
      case "COMPLETED":
        return "bg-gray-400";
      case "CANCELLED":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Chờ duyệt";
      case "TRANSFERRING":
        return "Đang chuyển";
      case "COMPLETED":
        return "Hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "PENDING":
        return "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800";
      case "TRANSFERRING":
        return "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800";
      case "CANCELLED":
        return "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800";
      default:
        return "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700";
    }
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
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${request.id === latestRequestId ? getStatusColor(request.status) : 'bg-gray-300'}`} />
                  {/* Red highlight dot for accepted/rejected events */}
                      {highlightedRequests[request.id] && (
                    <div className="ml-1 mt-1">
                      <span
                        title={
                          highlightedRequests[request.id] === "accepted"
                            ? "Yêu cầu đã được duyệt"
                            : "Yêu cầu đã bị từ chối"
                        }
                        className="inline-block w-3 h-3 rounded-full bg-red-500"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900">
                        Yêu cầu pin {request.batteryType?.name || "N/A"}
                      </p>
                      {(() => {
                        const badgeClass =
                          request.id === latestRequestId
                            ? getStatusClasses(request.status)
                            : "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500";

                        return <span className={badgeClass}>{getStatusLabel(request.status)}</span>;
                      })()}
                    </div>
                    <p className="text-xs text-gray-600">
                      Số lượng yêu cầu: {request.requestedQuantity}
                    </p>
                    {request.approvedQuantity !== null && (
                      <p className="text-xs text-gray-600">
                        Số lượng được duyệt: {request.approvedQuantity}
                      </p>
                    )}
                    {request.note && (
                      <p className="text-xs text-gray-500 mt-1 italic">
                        {request.note}
                      </p>
                    )}

                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(
                        new Date(request.createdAt).getTime() +
                          7 * 60 * 60 * 1000
                      ).toLocaleString("vi-VN", { hour12: false })}
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
