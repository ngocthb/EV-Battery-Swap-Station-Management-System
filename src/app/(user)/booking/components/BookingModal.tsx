import useFetchList from "@/hooks/useFetchList";
import { getUserVehicleAPI } from "@/services/userVehicleService";
import { BatteryType, Cabinet, Vehicle } from "@/types";
import React, { useEffect, useState } from "react";
import BookingMapModal from "./BookingMapModal";
import mapboxgl from "mapbox-gl";
import { mockGeocodeAddress, reverseGeocode } from "@/utils/geocoding";

import { getCabinetsByStationId } from "@/services/cabinetService";
import { getBatteryTypeById } from "@/services/batteryTypeService";

import BookingForm from "./BookingForm";
import BookingSelectBattery from "./BookingSelectBattery";

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
  const [userAddress, setUserAddress] = useState<string>("");
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [bookingStep, setBookingStep] = useState<1 | 2>(1);
  const [batteryTypeId, setBatteryTypeId] = useState<number | null>(null);

  // lấy đc battery type từ xe user rồi tìm cabin từ battery type = cho user select pin
  const [userVehicleBattery, setUserVehicleBattery] =
    useState<BatteryType | null>(null);
  const [bookingMessage, setBookingMessage] = useState<string>("");

  const { data: vehicleList = [] } = useFetchList<Vehicle[]>(getUserVehicleAPI);

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
      const res = await getBatteryTypeById(Number(batteryTypeId));
      setUserVehicleBattery(res.data);

      const userBatteryId = batteryTypeId;

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

      setBatteryTypeId(selectedVehicle?.vehicleType?.batteryTypeId || 0);
      setBookingData((prev) => {
        const updatedDetails = [...prev.bookingDetails];
        updatedDetails[0] = {
          ...updatedDetails[0],
        };

        return {
          ...prev,
          userVehicleId: Number(value),
        };
      });
    } else {
      setBookingData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
          {bookingStep == 1 ? "Đặt lịch đổi pin" : "Chọn 1-2 pin"}
        </h2>

        <div className="flex flex-row gap-4">
          {bookingStep == 1 ? (
            <BookingForm
              cabinInStationList={cabinInStationList}
              loadingAddress={loadingAddress}
              handleAddressChange={handleAddressChange}
              userAddress={userAddress}
              handleAddressBlur={handleAddressBlur}
              bookingData={bookingData}
              userVehicleBattery={userVehicleBattery}
              handleChange={handleChange}
              vehicleList={vehicleList}
              bookingMessage={bookingMessage}
              setOpenBookingModal={setOpenBookingModal}
              setBookingStep={setBookingStep}
              batteryTypeId={batteryTypeId}
            />
          ) : (
            <BookingSelectBattery
              setOpenBookingModal={setOpenBookingModal}
              setBookingData={setBookingData}
              bookingData={bookingData}
              batteryTypeId={batteryTypeId}
              setBookingStep={setBookingStep}
            />
          )}

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
