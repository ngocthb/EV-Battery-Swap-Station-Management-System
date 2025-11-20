import React, { useEffect, useState } from "react";
import { BookingData } from "./BookingModal";
import {
  getCabinetByIdAPI,
  getCabinetsByStationIdAndBatteryTypeId,
} from "@/services/cabinetService";
import { Cabinet } from "@/types";
import { Battery, Check } from "lucide-react";
import {
  getSlotStatusBGAndTextWhiteStyle,
  getSlotStatusBorderAndBgStyle,
  getSlotStatusText,
  getSlotStatusTextStyle,
} from "@/utils/formateStatus";
import { createBookingAPI } from "@/services/bookingService";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

interface BookingSelectBatteryProp {
  bookingData: BookingData;
  batteryTypeId: number | null;
  setBookingStep: (value: 1 | 2) => void;
  setBookingData: React.Dispatch<React.SetStateAction<BookingData>>;
  setOpenBookingModal: (value: boolean) => void;
}

export default function BookingSelectBattery({
  bookingData,
  batteryTypeId,
  setBookingStep,
  setBookingData,
  setOpenBookingModal,
}: BookingSelectBatteryProp) {
  const router = useRouter();

  const [cabinDetail, setCabinDetail] = useState<Cabinet | null>(null);
  const [selectedSlotIds, setSelectedSlotIds] = useState<number[]>([]);

  const fetchCabin = async () => {
    try {
      const res = await getCabinetsByStationIdAndBatteryTypeId(
        bookingData.stationId,
        { batteryTypeId }
      );
      const slot = await getCabinetByIdAPI(res?.data[0]?.id);
      setCabinDetail(slot.data);
    } catch (error) {
      console.log("fetch cabin err", error);
    }
  };

  useEffect(() => {
    if (!bookingData || !batteryTypeId) return;
    fetchCabin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingData.stationId, batteryTypeId]);

  const handleSlotClick = (slot: any) => {
    // Chỉ cho phép chọn slot có status AVAILABLE và có batteryId
    if (slot.status !== "AVAILABLE" || !slot.batteryId) {
      toast.warn("Slot này không khả dụng hoặc chưa có pin");
      return;
    }

    // Kiểm tra xem slot đã được chọn chưa
    const isSelected = selectedSlotIds.includes(slot.id);

    if (isSelected) {
      // Bỏ chọn slot
      const newSelectedIds = selectedSlotIds.filter((id) => id !== slot.id);
      setSelectedSlotIds(newSelectedIds);

      // Cập nhật bookingDetails - xóa pin này khỏi danh sách
      setBookingData((prev) => ({
        ...prev,
        bookingDetails: prev.bookingDetails.filter(
          (detail) => detail.batteryId !== slot.batteryId
        ),
      }));
    } else {
      // Nếu đã chọn 2 cục rồi, không cho chọn thêm
      if (selectedSlotIds.length >= 2) {
        toast.warn("Chỉ có thể chọn tối đa 2 cục pin");
        return;
      }

      // Chọn slot mới
      const newSelectedIds = [...selectedSlotIds, slot.id];
      setSelectedSlotIds(newSelectedIds);

      // Thêm batteryId vào bookingDetails
      setBookingData((prev) => ({
        ...prev,
        bookingDetails: [...prev.bookingDetails, { batteryId: slot.batteryId }],
      }));
    }
  };

  const isBookingDataValid = () => {
    // Kiểm tra có chọn ít nhất 1 pin
    return (
      bookingData?.bookingDetails &&
      bookingData.bookingDetails.length > 0 &&
      bookingData.bookingDetails.some((detail) => detail.batteryId !== 0)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await createBookingAPI(bookingData);
      toast.success(res?.message || "Đặt lịch thành công");
      setBookingData({
        userVehicleId: 0,
        stationId: 0,
        userLat: 0,
        userLng: 0,
        bookingDetails: [],
      });
      setOpenBookingModal(false);
      router.push("/history");
    } catch (error) {
      const err = error as AxiosError<any>;
      console.log("create booking err", err);
      toast.warn(err.response?.data?.message || "Không thể chọn");
    }
  };

  return (
    <div>
      <div className="flex-1 overflow-auto">
        {cabinDetail?.slots && cabinDetail.slots.length > 0 ? (
          <div>
            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-900">
                Chọn tối đa 2 cục pin ({selectedSlotIds.length}/2)
              </p>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {cabinDetail.slots.map((slot) => {
                const isSelected = selectedSlotIds.includes(slot.id);
                const isAvailable =
                  slot.status === "AVAILABLE" && slot.batteryId;

                return (
                  <div
                    key={slot.id}
                    onClick={() => isAvailable && handleSlotClick(slot)}
                    className={`
                      relative rounded-lg border-2 p-4 transition-all cursor-pointer
                      ${getSlotStatusBorderAndBgStyle(slot?.status)}
                      ${
                        isSelected
                          ? "ring-2 ring-green-500 ring-offset-2 shadow-lg"
                          : ""
                      }
                      ${
                        isAvailable
                          ? "hover:shadow-md"
                          : "opacity-60 cursor-not-allowed"
                      }
                    `}
                  >
                    {/* Checkmark for selected */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                        <Check />
                      </div>
                    )}

                    {/* Slot Number */}
                    <div className="text-center mb-2">
                      <div className="text-xs font-medium text-gray-500 mb-1">
                        Slot #{slot.id}
                      </div>
                    </div>

                    {/* Battery Icon */}
                    <div className="flex justify-center mb-2">
                      <Battery
                        className={`w-8 h-8 ${getSlotStatusTextStyle(
                          slot.status
                        )}`}
                      />
                    </div>

                    {/* Status Badge */}
                    <div className="flex justify-center">
                      <span
                        className={`
                          inline-block px-2 py-1 text-xs font-semibold rounded
                          ${getSlotStatusBGAndTextWhiteStyle(slot?.status)}
                        `}
                      >
                        {getSlotStatusText(slot.status)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Battery className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium">Không có slot pin</p>
            <p className="text-sm">Tủ này chưa có slot pin nào</p>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2 mt-2">
        <button
          type="button"
          onClick={() => setBookingStep(1)}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
        >
          Quay lại
        </button>
        <button
          type="button"
          disabled={!isBookingDataValid()}
          onClick={handleSubmit}
          className={`px-4 py-2 rounded-lg text-white transition 
                ${
                  isBookingDataValid()
                    ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );
}
