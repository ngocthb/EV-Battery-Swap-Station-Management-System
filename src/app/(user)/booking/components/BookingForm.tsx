import { BatteryType, Cabinet, Vehicle } from "@/types";
import React from "react";
import { BookingData } from "./BookingModal";

interface BookingFormProp {
  cabinInStationList: Cabinet[] | null;
  loadingAddress: boolean;
  handleAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  userAddress: string;
  handleAddressBlur: () => void;
  bookingData: BookingData;
  userVehicleBattery: BatteryType | null;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  vehicleList: Vehicle[];
  bookingMessage: string;
  setOpenBookingModal: (value: boolean) => void;
  setBookingStep: (value: 1 | 2) => void;
  batteryTypeId: number | null;
}

export default function BookingForm({
  cabinInStationList,
  loadingAddress,
  handleAddressChange,
  userAddress,
  handleAddressBlur,
  bookingData,
  userVehicleBattery,
  handleChange,
  vehicleList,
  bookingMessage,
  setOpenBookingModal,
  setBookingStep,
  batteryTypeId,
}: BookingFormProp) {
  const isBookingDataValid = () => {
    const { userVehicleId, stationId, userLat, userLng } = bookingData;
    const hasBattery = batteryTypeId && batteryTypeId !== 0;
    const hasMessage = bookingMessage?.includes("Hãy"); // nếu có từ "Hãy" mới hợp lệ
    return (
      userVehicleId !== 0 &&
      stationId !== 0 &&
      userLat !== 0 &&
      userLng !== 0 &&
      hasBattery &&
      hasMessage
    );
  };

  return (
    <form className="space-y-5">
      {/*Pin in station info */}
      <div className="bg-gray-100 p-2 rounded-lg">
        <h3 className="font-semibold border-b border-gray-200 pb-2">
          Thông tin pin tại trạm
        </h3>

        <div className="max-h-[120px] overflow-y-auto scrollbar-custom">
          {/*show cabin và pin */}
          {cabinInStationList?.map((cabin) => {
            return (
              <div
                key={cabin.id}
                className={`py-2 flex items-center justify-between border-b border-gray-200`}
              >
                <div className="space-y-2 w-full">
                  <p className="font-medium text-sm">
                    {cabin.name} - Pin {cabin?.batteryInfo?.name}
                  </p>

                  {cabin?.availablePins && (
                    <div className="flex flex-row justify-between items-center w-full">
                      {/* info*/}
                      <div className="flex gap-3">
                        <div className="bg-green-500 w-7 h-7 rounded-full flex items-center justify-center pb-1">
                          <p className="text-white font-semibold">
                            {cabin?.availablePins}
                          </p>
                        </div>
                        <p className="font-semibold text-green-500">
                          Có thể đổi
                        </p>
                      </div>
                    </div>
                  )}

                  {cabin?.chargingPins !== 0 && (
                    <div className="flex flex-row justify-between items-center w-full">
                      {/* info*/}
                      <div className="flex gap-3">
                        <div className="bg-yellow-500 w-7 h-7 rounded-full flex items-center justify-center pb-1">
                          <p className="text-white font-semibold">
                            {cabin?.chargingPins}
                          </p>
                        </div>
                        <p className="font-semibold text-yellow-500">
                          Đang sạc
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Địa chỉ hiện tại */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Vị trí của bạn
        </label>
        <div className="relative">
          <input
            name="userAddress"
            placeholder="VD: 230 Pasteur, Quận 3, TP.HCM"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            value={loadingAddress ? "Đang tải..." : userAddress}
            onChange={handleAddressChange}
            onBlur={handleAddressBlur}
            disabled={loadingAddress}
          />
          {loadingAddress && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg
                className="w-5 h-5 text-blue-500 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Toạ độ */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Vĩ độ (Lat)
          </label>
          <input
            name="userLat"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
            value={bookingData.userLat || ""}
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Kinh độ (Lng)
          </label>
          <input
            name="userLng"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
            value={bookingData.userLng || ""}
            readOnly
          />
        </div>
      </div>

      {/* Phương tiện */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <span>Phương tiện của bạn - </span>
          {userVehicleBattery && (
            <span>Pin của bạn: {userVehicleBattery?.name}</span>
          )}
        </label>
        <select
          name="userVehicleId"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          value={bookingData.userVehicleId}
          onChange={handleChange}
        >
          <option value={0}>Chọn phương tiện</option>
          {vehicleList.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
      </div>

      {bookingMessage && (
        <div
          className={`
                    mt-3 px-4 py-2 rounded-lg text-sm font-medium border
                    ${
                      bookingMessage.includes("Hãy")
                        ? "bg-green-100 border-green-500 text-green-700"
                        : "bg-yellow-100 border-yellow-500 text-yellow-700"
                    }
                  `}
        >
          {bookingMessage}
        </div>
      )}

      {/* Nút hành động */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => setOpenBookingModal(false)}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
        >
          Hủy
        </button>
        <button
          type="button"
          disabled={!isBookingDataValid()}
          onClick={() => setBookingStep(2)}
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
    </form>
  );
}
