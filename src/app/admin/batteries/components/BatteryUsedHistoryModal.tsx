import { getBatteryHistoryByBatteryId } from "@/services/batteryService";
import React, { useEffect, useState } from "react";

interface BatteryUsedHistoryModalProps {
  batteryId: number;
  onClose: () => void;
}

const BatteryUsedHistoryModal: React.FC<BatteryUsedHistoryModalProps> = ({
  batteryId,
  onClose,
}) => {
  const [batteryHistory, setBatteryHistory] = useState(null);

  const handleGetBatteryHistory = async () => {
    try {
      const res = await getBatteryHistoryByBatteryId(batteryId);
      console.log("get history res", res.data);
      setBatteryHistory(res?.data);
    } catch (error) {
      console.log("get history err", error);
    }
  };

  useEffect(() => {
    if (!batteryId) {
      return;
    }
    handleGetBatteryHistory();
  }, [batteryId]);
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg">
        <h2 className="text-xl font-bold mb-4">Lịch sử sử dụng pin</h2>

        <p className="text-gray-700 mb-4">
          ID của pin: <strong>{batteryId}</strong>
        </p>

        {/* Fetch dữ liệu lịch sử ở đây nếu cần */}

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
