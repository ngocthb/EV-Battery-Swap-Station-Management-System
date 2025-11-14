import {
  getBatteryHistoryByBatteryId,
  getBatteryHistoryByBookingId,
} from "@/services/batteryService";
import { Battery, Zap, X, Pin } from "lucide-react";
import React, { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface BatteryUsedHistoryModalProps {
  bookingId: number;
  onClose: () => void;
}

const BatteryUsedHistoryModal: React.FC<BatteryUsedHistoryModalProps> = ({
  bookingId,
  onClose,
}) => {
  const [batteryHistory, setBatteryHistory] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!bookingId) return;

    (async () => {
      setIsLoading(true);
      try {
        const res = await getBatteryHistoryByBookingId(bookingId);
        const data = Array.isArray(res?.data) ? res.data : [];
        setBatteryHistory(data);
      } catch (error) {
        console.log("get history err", error);
        setBatteryHistory([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [bookingId]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Lịch sử sử dụng pin</h2>
            <p className="text-sm text-gray-500">
              ID đơn đặt: <strong>{bookingId}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="close"
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="mb-4">
          {isLoading ? (
            <div className="flex items-center gap-2 text-gray-600">
              <LoadingSpinner size="md" color="text-gray-600" />
              <span>Đang tải lịch sử...</span>
            </div>
          ) : batteryHistory && batteryHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="p-4 bg-gray-50 rounded-full mb-3">
                <Battery className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-700 font-medium">
                Chưa có lịch sử sử dụng
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Pin này chưa có bản ghi sử dụng nào.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {(batteryHistory || []).map((item: any) => {
                const {
                  id,
                  batteryId,
                  currentCapacity,
                  currentCycle,
                  healthScore,
                  percent,
                  status,
                  updatedAt,
                } = item || {};

                const dateLabel = updatedAt
                  ? new Date(updatedAt).toLocaleString()
                  : "-";

                return (
                  <div
                    key={id ?? `${bookingId}-${Math.random()}`}
                    className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-gray-50">
                        <Battery className="w-6 h-6 text-yellow-500" />
                      </div>
                      <div>
                        {batteryId != null && (
                          <p className="text-xs text-gray-500">
                            ID pin: {batteryId}
                          </p>
                        )}
                        <p className="text-sm font-medium text-gray-800">
                          {dateLabel}
                        </p>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {percent ?? currentCapacity ?? 0}%
                      </p>
                    </div>

                    <div className="text-right">
                      <div
                        className={`${
                          status
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        } inline-block px-3 py-1 rounded-full text-sm font-medium`}
                      >
                        {status ? "Hoạt động" : "Ngưng hoạt động"}
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Chu kỳ: {currentCycle ?? "-"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Sức khỏe: {healthScore ?? "-"}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

// ✅ Dùng memo để tránh re-render không cần thiết
export default React.memo(BatteryUsedHistoryModal);
