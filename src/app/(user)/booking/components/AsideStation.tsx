import { useDebounce } from "@/hooks/useDebounce";
import useFetchList from "@/hooks/useFetchList";
import useQuery from "@/hooks/useQuery";
import { getAllPublicStationList } from "@/services/stationService";
import { QueryParams, Station } from "@/types";
import { isStationOpen } from "@/utils/format";
import {
  Battery,
  Calendar,
  Clock,
  Loader,
  MapPin,
  Navigation,
  Search,
  X,
} from "lucide-react";
import React, { memo, useMemo, useState } from "react";
import BookingModal from "./BookingModal";

interface AsideStationProps {
  setOpenStationDetail: React.Dispatch<React.SetStateAction<Station | null>>;
  handleGetDirection: (
    start: [number, number],
    end: [number, number]
  ) => Promise<unknown>;
}

function AsideStation({
  setOpenStationDetail,
  handleGetDirection,
}: AsideStationProps) {
  const [openBookingModal, setOpenBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    userVehicleId: 0,
    stationId: 0,
    userLat: 0,
    userLng: 0,
    bookingDetails: [{ batteryId: 0 }],
  });

  // query
  const { query, updateQuery, resetQuery } = useQuery<QueryParams>({
    page: 1,
    limit: 100,
    search: "",
    order: "asc",
  });

  const debouncedSearch = useDebounce(query.search, 1500);
  const debouncedQuery = useMemo(
    () => ({ ...query, search: debouncedSearch }),
    [debouncedSearch]
  );

  // fetch all station
  const { data: stationList = [], loading } = useFetchList<
    Station[],
    QueryParams
  >(getAllPublicStationList, debouncedQuery);

  const handleSearch = (data: string) => {
    updateQuery({ search: data });
  };

  // phuc vu map
  const handleGetInstructionDirection = async (lat: number, long: number) => {
    if (!navigator.geolocation) {
      alert("Không tìm thấy vị trí của bạn");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        await handleGetDirection([userLng, userLat], [long, lat]);
      },
      () => alert("Không lấy được vị trí"),
      { enableHighAccuracy: true }
    );
  };

  // lay vi tri hien tai
  const getCurrentPosition = async (): Promise<{
    lat: number;
    lng: number;
  }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Trình duyệt không hỗ trợ định vị");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => reject("Không thể lấy vị trí hiện tại"),
        { enableHighAccuracy: true }
      );
    });
  };

  const handleOpenBooking = async (station: Station) => {
    try {
      const { lat, lng } = await getCurrentPosition();

      setBookingData({
        userVehicleId: 0, // sau này thay bằng vehicle thật
        stationId: Number(station.id),
        userLat: lat,
        userLng: lng,
        bookingDetails: [{ batteryId: 0 }],
      });

      setOpenBookingModal(true);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <div className="w-full max-h-[calc(70vh-64px)] lg:max-h-none lg:w-[30%] bg-white shadow-lg overflow-hidden flex flex-col">
        {/*search */}
        <div className="p-6 py-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900 mb-4">
            Tìm trạm đổi pin
          </h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Điền địa chỉ đang ở hoặc khu vực cần tìm"
              value={query.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {query.search && (
              <X
                onClick={resetQuery}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 cursor-pointer"
              />
            )}
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Loader className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-lg">Đang tải...</p>
          </div>
        )}

        {/*Station list */}
        <div className="flex-1 overflow-y-auto scrollbar-custom">
          <div className="p-4 space-y-4">
            {stationList.map((station) => (
              <div
                key={station?.id}
                className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow p-4"
              >
                {/*img & name & status */}
                <div className="flex space-x-4 mb-4">
                  <div className="flex-shrink-0">
                    <img
                      src={
                        station?.image ||
                        "https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=612x612&w=0&k=20&c=KuCo-dRBYV7nz2gbk4J9w1WtTAgpTdznHu55W9FjimE="
                      }
                      alt={station?.name}
                      className="w-24 h-24 rounded-xl object-cover bg-gray-100"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/*Status */}
                    <div className="flex items-center space-x-2 mb-2">
                      <span
                        className={`inline-flex items-center space-x-1 text-xs font-medium ${
                          isStationOpen(station?.openTime, station?.closeTime)
                            ? "text-green-700 bg-green-50"
                            : "text-red-700 bg-red-50"
                        }  px-2 py-1 rounded-full`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            isStationOpen(station?.openTime, station?.closeTime)
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                        <span>
                          {isStationOpen(station?.openTime, station?.closeTime)
                            ? "Mở cửa"
                            : "Đóng cửa"}
                        </span>
                      </span>
                      <span
                        className={`inline-flex items-center space-x-1 text-xs font-medium ${
                          Number(station?.slotAvailable) > 0
                            ? "text-orange-700 bg-orange-50"
                            : "text-gray-500 bg-gray-100"
                        } px-2 py-1 rounded-full`}
                      >
                        <Battery className="w-3 h-3" />
                        <span>
                          {Number(station?.slotAvailable) > 0
                            ? `${station?.slotAvailable} Pin`
                            : "Hết pin"}
                        </span>
                      </span>
                    </div>
                    {/*Name */}
                    <h3
                      className="text-lg font-bold text-gray-900 mb-0.5 cursor-pointer hover:underline"
                      title="Chi tiết"
                      onClick={() => setOpenStationDetail(station)}
                    >
                      {station?.name}
                    </h3>
                  </div>
                </div>

                <div className="flex items-start space-x-2 mb-2">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {station?.address}
                  </p>
                </div>

                {/*Time */}
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    {station?.openTime?.slice(0, -3)} -
                    {station?.closeTime?.slice(0, -3)}
                  </p>
                </div>

                {/*Button */}
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      handleGetInstructionDirection(
                        station?.latitude,
                        station?.longitude
                      )
                    }
                    className="flex-1 py-2.5 px-4 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-full hover:bg-blue-50 transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Tìm đường đi</span>
                  </button>
                  <button
                    onClick={() => handleOpenBooking(station)}
                    className="flex-1 py-2.5 px-4 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Đặt lịch</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {stationList.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <MapPin className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-lg">Không tìm thấy trạm nào</p>
              <p className="text-sm mt-2">Vui lòng thử từ khóa khác</p>
            </div>
          )}
        </div>
      </div>

      {openBookingModal && (
        <BookingModal
          openBookingModal={openBookingModal}
          setOpenBookingModal={setOpenBookingModal}
          bookingData={bookingData}
          setBookingData={setBookingData}
        />
      )}
    </>
  );
}

export default memo(AsideStation);
