"use client";

import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { X } from "lucide-react";
import { LoadingSpinner } from "./LoadingSpinner";
import api from "@/lib/axios";

interface Request {
  id: number;
  status: string;
  requestedQuantity: number;
  approvedQuantity: number | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  batteryType: {
    id: number;
    name: string;
  } | null;
  station: {
    id: number;
    name: string;
    address: string;
  } | null;
  requester: {
    id: number;
    username: string;
    fullName: string;
  } | null;
  batteries: Array<{
    id: number;
    model: string;
    healthScore: number;
  }>;
}

interface AdminNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminNotificationModal: React.FC<AdminNotificationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);

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

  // Fetch all requests for admin
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await api.get("/request", {
        params: { page: 1, limit: 50 },
      });
      const result = response.data;
      if (result.data) {
        setRequests(result.data);
      }
    } catch (error) {
      console.error("Error fetching admin requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRequests();

      // Connect to socket

      const newSocket = io(`https://amply.io.vn/request`, {
        transports: ["websocket"],
        auth: {
          token: localStorage.getItem("accessToken"),
        },
      });

      newSocket.on("connect", () => {
        console.log("Admin socket connected to /request namespace");
      });

      // Listen for new staff requests
      newSocket.on("request_created", (data) => {
        console.log("Admin received request_created:", data);
        fetchRequests();
      });

      // Listen for request updates (accept/reject)
      newSocket.on("request_updated", (data) => {
        console.log("Admin received request_updated:", data);
        fetchRequests();
      });

      newSocket.on("disconnect", () => {
        console.log("Admin socket disconnected from /request");
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0  bg-black/40 bg-opacity-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md h-screen bg-white shadow-2xl flex flex-col overflow-hidden animate-slide-in-right">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Thông báo yêu cầu pin
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner />
              <span className="ml-2 text-gray-500">Đang tải...</span>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <X className="w-5 h-5 text-gray-300" />
              </div>
              <p>Chưa có yêu cầu nào</p>
            </div>
          ) : (
            <div className="border-t border-gray-200">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getStatusColor(
                        request.status
                      )}`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {request.station?.name || "Không rõ trạm"}
                        </p>
                        <span className={getStatusClasses(request.status)}>
                          {getStatusLabel(request.status)}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 mt-1">
                        {request.batteryType?.name || "N/A"} • Yêu cầu{" "}
                        {request.requestedQuantity}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(
                          new Date(request.createdAt).getTime() +
                            7 * 60 * 60 * 1000
                        ).toLocaleString("vi-VN", { hour12: false })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotificationModal;
