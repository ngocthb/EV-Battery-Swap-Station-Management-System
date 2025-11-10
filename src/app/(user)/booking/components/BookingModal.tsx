import useFetchList from "@/hooks/useFetchList";
import { getUserVehicleAPI } from "@/services/userVehicleService";
import { BatteryType, Cabinet, Vehicle } from "@/types";
import React, { useEffect, useState } from "react";
import BookingMapModal from "./BookingMapModal";
import mapboxgl from "mapbox-gl";
import { mockGeocodeAddress, reverseGeocode } from "@/utils/geocoding";
import { createBookingAPI } from "@/services/bookingService";
import { toast } from "react-toastify";
import { getCabinetsByStationId } from "@/services/cabinetService";
import { getBatteryTypeById } from "@/services/batteryTypeService";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

interface BookingDetail {
  batteryId: number;
}

export interface BookingData {
  userVehicleId: number;
  stationId: number;
  userLat: number;
  userLng: number;
  bookingDetails: BookingDetail[];
}

interface BookingModalProps {
  openBookingModal: boolean;
  setOpenBookingModal: React.Dispatch<React.SetStateAction<boolean>>;
  bookingData: BookingData;
  setBookingData: React.Dispatch<React.SetStateAction<BookingData>>;
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const BookingModal: React.FC<BookingModalProps> = ({
  openBookingModal,
  setOpenBookingModal,
  bookingData,
  setBookingData,
}) => {
  const router = useRouter();
  const [userAddress, setUserAddress] = useState<string>("");
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [userVehicleBattery, setUserVehicleBattery] =
    useState<BatteryType | null>(null);
  const [bookingMessage, setBookingMessage] = useState<string>("");

  const { data: vehicleList = [], refresh } =
    useFetchList<Vehicle[]>(getUserVehicleAPI);

  const [cabinInStationList, setCabinInStationList] = useState<
    Cabinet[] | null
  >(null);

  // 1. get cabin theo stationId từ booking data
  const handleGetCabinByStation = async () => {
    try {
      const res = await getCabinetsByStationId(bookingData?.stationId);

      // 1.2 thêm type pin vô cabin để so sánh và show để bt cabin theo loại nào
      const cabinWithBattery = await Promise.all(
        res?.data?.map(async (cabin: Cabinet) => {
          if (!cabin.batteryTypeId) return cabin;
          try {
            const batteryRes = await getBatteryTypeById(cabin.batteryTypeId);
            return {
              ...cabin,
              batteryInfo: batteryRes.data,
            };
          } catch {
            return cabin;
          }
        })
      );
      console.log("cabinWithBattery res modal", cabinWithBattery);

      setCabinInStationList(cabinWithBattery);
    } catch (error) {
      console.log("get cabin by station err", error);
    }
  };

  useEffect(() => {
    handleGetCabinByStation();
  }, [bookingData]);
  // end 1. get cabin theo stationId từ booking data

  // 2. khi user click chọn xe goi thg này lấy pin từ xe để so sánh vs trạm coi pin còn ko
  const handleGetBatteryByUserVehicle = async () => {
    try {
      const res = await getBatteryTypeById(
        bookingData?.bookingDetails[0]?.batteryId
      );

      console.log("get battery detail by user vehicle res", res.data);
      setUserVehicleBattery(res.data);

      const userBatteryId = bookingData?.bookingDetails?.[0]?.batteryId;

      const hasMatchingCabinet = cabinInStationList?.some(
        (cabinet) => cabinet.batteryTypeId === userBatteryId
      );
      if (hasMatchingCabinet) {
        setBookingMessage("Hãy nhanh chóng đặt pin nhé!");
      } else {
        setBookingMessage("Trạm KHÔNG có loại pin phù hợp để đổi.");
      }
    } catch (error) {
      console.log("get battery detail by user vehicle err", error);
    }
  };

  useEffect(() => {
    if (bookingData?.userVehicleId == 0) {
      return;
    }
    handleGetBatteryByUserVehicle();
  }, [bookingData]);
  // end 2. khi user click chọn xe goi thg này lấy pin để so sánh vs trạm

  // phuc vu address
  useEffect(() => {
    const fetchAddress = async () => {
      setLoadingAddress(true);
      if (!bookingData.userLat || !bookingData.userLng) return;
      const addr = await reverseGeocode(
        bookingData.userLat,
        bookingData.userLng
      );
      if (addr) setUserAddress(addr);
      setLoadingAddress(false);
    };
    fetchAddress();
  }, [bookingData.userLat, bookingData.userLng]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserAddress(e.target.value);
  };

  // address => lat lng
  const handleAddressBlur = async () => {
    if (!userAddress.trim()) return;
    setLoadingAddress(true);

    const result = await mockGeocodeAddress(userAddress);
    if (result) {
      setBookingData((prev) => ({
        ...prev,
        userLat: result.lat,
        userLng: result.lng,
      }));
    }

    setLoadingAddress(false);
  };
  // end phuc vu address

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "userVehicleId") {
      const selectedVehicle = vehicleList.find((v) => v.id === Number(value));

      setBookingData((prev) => {
        const updatedDetails = [...prev.bookingDetails];
        updatedDetails[0] = {
          ...updatedDetails[0],
          batteryId: selectedVehicle?.vehicleType?.batteryTypeId || 0,
        };

        return {
          ...prev,
          userVehicleId: Number(value),
          bookingDetails: updatedDetails,
        };
      });
    } else {
      setBookingData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
        bookingDetails: [{ batteryId: 0 }],
      });
      setOpenBookingModal(false);
      router.push("/history");
    } catch (error) {
      const err = error as AxiosError<any>;
      console.log("create booking err", err);
      toast.warn(err.response?.data?.message || "Không thể chọn");
    }
  };

  // Kiểm tra dữ liệu booking data
  const isBookingDataValid = () => {
    const { userVehicleId, stationId, userLat, userLng, bookingDetails } =
      bookingData;
    const hasBattery =
      bookingDetails?.[0]?.batteryId && bookingDetails[0].batteryId !== 0;
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

  if (!openBookingModal) return null;

  return (
    <div
      onClick={() => setOpenBookingModal(false)}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-6 rounded-xl shadow-lg"
      >
        <h2 className="text-lg font-bold mb-4 text-gray-800">
          Đặt lịch đổi pin
        </h2>

        <div className="flex flex-row gap-4">
          <form className="space-y-5">
            {/*Pin in station info */}
            <div className="bg-gray-100 p-2 rounded-lg">
              <h3 className="font-semibold border-b border-gray-200 pb-2">
                Thông tin pin tại trạm
              </h3>

              <div className="max-h-[120px] overflow-y-auto scrollbar-custom">
                {/*show cabin và pin */}
                {cabinInStationList?.map((cabin, index) => {
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
                onClick={handleSubmit}
                className={`px-4 py-2 rounded-lg text-white transition 
                ${
                  isBookingDataValid()
                    ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Xác nhận
              </button>
            </div>
          </form>

          {/*map */}
          <BookingMapModal
            stationId={bookingData.stationId}
            userLat={bookingData.userLat}
            userLng={bookingData.userLng}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
