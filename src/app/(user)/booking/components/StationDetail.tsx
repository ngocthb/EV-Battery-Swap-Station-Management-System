import { getBatteryById } from "@/services/batteryService";
import { getBatteryTypeById } from "@/services/batteryTypeService";
import { getCabinetsByStationId } from "@/services/cabinetService";
import { getStationById } from "@/services/stationService";
import { Cabinet, Station } from "@/types";
import { isStationOpen } from "@/utils/format";
import { Battery, Clock, MapPin, Star, X } from "lucide-react";
import { useEffect, useState } from "react";

interface BatterySlot {
  id: number;
  level: number;
  label: string;
  swappable: boolean;
}

interface StationDetailProps {
  setOpenStationDetail: React.Dispatch<React.SetStateAction<Station | null>>;
  openStationDetail: Station;
}

function StationDetail({
  setOpenStationDetail,
  openStationDetail,
}: StationDetailProps) {
  const [cabinInStationList, setCabinInStationList] = useState<
    Cabinet[] | null
  >(null);

  const handleGetCabinByStation = async () => {
    try {
      const res = await getCabinetsByStationId(openStationDetail.id);
      console.log("getCabinetsByStationId res", res.data);

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

      console.log("cabinWithBattery res", cabinWithBattery);

      setCabinInStationList(cabinWithBattery);
    } catch (error) {
      console.log("get cabin by station err", error);
    }
  };

  useEffect(() => {
    handleGetCabinByStation();
  }, [openStationDetail]);
  // station detail fake data
  const reviews = [
    {
      id: 1,
      name: "Nguyen Thach",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      date: "2 days ago",
      rating: 5,
      comment:
        "Great service and friendly staff. The swapping process was fast and smooth!",
    },
    {
      id: 2,
      name: "Linh Tran",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      date: "5 days ago",
      rating: 4,
      comment:
        "Good experience overall. The location is a bit hard to find, though.",
    },
  ];

  const batterySlots: BatterySlot[] = [
    { id: 1, level: 100, label: "Slot 1", swappable: true },
    { id: 2, level: 60, label: "Slot 2", swappable: true },
    { id: 3, level: 10, label: "Slot 3", swappable: false },
  ];

  return (
    <div className="absolute top-0 bottom-0 lg:top-4 lg:bottom-4 lg:left-[30.5%] lg:w-[400px] bg-white shadow-lg z-20 border-l border-gray-200 flex flex-col rounded-xl overflow-hidden">
      {/*Image */}
      <div className="relative h-[200px]">
        <img
          src={
            openStationDetail?.image ||
            "https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=612x612&w=0&k=20&c=KuCo-dRBYV7nz2gbk4J9w1WtTAgpTdznHu55W9FjimE="
          }
          alt={openStationDetail?.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60"></div>

        {/* Back Button */}
        <div className="absolute top-4 left-4">
          <button
            onClick={() => setOpenStationDetail(null)}
            className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-white"
          >
            <X size={22} />
          </button>
        </div>

        {/* Status */}
        <div className="absolute bottom-6 left-6 flex gap-2">
          <div
            className={`${
              isStationOpen(
                openStationDetail?.openTime,
                openStationDetail?.closeTime
              )
                ? "text-green-700 bg-green-50"
                : "text-red-700 bg-red-50"
            } px-3 py-1.5 rounded-full flex items-center gap-1`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                isStationOpen(
                  openStationDetail?.openTime,
                  openStationDetail?.closeTime
                )
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            ></div>
            <span className="pb-1">
              {isStationOpen(
                openStationDetail?.openTime,
                openStationDetail?.closeTime
              )
                ? "Mở cửa"
                : "Đóng cửa"}
            </span>
          </div>
          <div
            className={`${
              Number(openStationDetail?.slotAvailable) > 0
                ? "text-orange-700 bg-orange-200"
                : "text-gray-500 bg-gray-100"
            }  px-3 py-1.5 rounded-full flex items-center gap-2`}
          >
            <Battery className="w-4 h-4" />
            <span className="pb-1">
              {Number(openStationDetail?.slotAvailable) > 0
                ? `${openStationDetail?.slotAvailable} Pin`
                : "Hết pin"}{" "}
            </span>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-custom">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {openStationDetail?.name || "Battery Station"}
        </h2>

        {/* Address */}
        <div className="flex items-start gap-3 mb-4">
          <MapPin size={18} className="text-gray-700 mt-0.5" />
          <p className="text-gray-600 text-sm leading-5">
            {openStationDetail?.address ||
              "123 Đường ABC, Quận 1, TP. Hồ Chí Minh"}
          </p>
        </div>

        {/* Time */}
        <div className="flex items-center gap-3 mb-6">
          <Clock size={20} className="text-gray-700" />
          <p className="text-gray-900 text-sm">
            {openStationDetail?.openTime?.slice(0, -3)} -
            {openStationDetail?.closeTime?.slice(0, -3)}
          </p>
        </div>

        {/* Battery Slots */}
        <div className="mt-4">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-1 tracking-wide">
            Pin
          </p>
          {cabinInStationList?.map((cabin, index) => {
            return (
              <div
                key={cabin.id}
                className={`flex items-center justify-between py-4 border-b border-gray-200`}
              >
                <div className="space-y-2 w-full">
                  <p className="font-medium">
                    {cabin.name} - Pin {cabin?.batteryInfo?.name}
                  </p>

                  {cabin?.availablePins && (
                    <div className="flex flex-row justify-between items-center w-full">
                      {/*Pin */}
                      <div className="relative bg-gray-100 w-16 h-8 rounded-xl overflow-hidden">
                        <div
                          className={`absolute w-full h-full ${
                            (cabin?.availablePins ?? 0) > 0
                              ? "bg-green-500"
                              : ""
                          }`}
                        >
                          <p className="absolute w-full h-full text-center top-[2px]">
                            100%
                          </p>
                        </div>
                      </div>
                      {/* info*/}
                      <div className="flex gap-3">
                        <p className="font-semibold">Có thể đổi</p>
                        <div className="bg-green-500 w-7 h-7 rounded-full flex items-center justify-center pb-1">
                          <p className="text-white font-semibold">
                            {cabin?.availablePins}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {cabin?.chargingPins && (
                    <div className="flex flex-row justify-between items-center w-full">
                      {/*pin */}
                      <div className="relative bg-gray-100 w-16 h-8 rounded-xl overflow-hidden">
                        <div
                          className={`absolute w-[70%] h-full ${
                            (cabin?.chargingPins ?? 0) > 0
                              ? "bg-yellow-500"
                              : ""
                          }`}
                        >
                          <p className="absolute w-16 h-full text-center top-[2px]">
                            70%
                          </p>
                        </div>
                      </div>
                      {/* info*/}
                      <div className="flex gap-3">
                        <p className="font-semibold">Đang sạc</p>
                        <div className="bg-yellow-500 w-7 h-7 rounded-full flex items-center justify-center pb-1">
                          <p className="text-white font-semibold">
                            {cabin?.chargingPins}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Reviews */}
        <div className="mt-6">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-3 tracking-wide">
            Đánh giá trạm
          </p>
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-gray-50 p-4 rounded-xl mb-3 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{review.name}</p>
                    <p className="text-xs text-gray-500">{review.date}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        i < review.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                      fill={i < review.rating ? "#FACC15" : "none"}
                    />
                  ))}
                </div>
              </div>

              <p className="text-gray-700 text-sm leading-5">
                {review.comment}
              </p>
            </div>
          ))}

          <button className="text-blue-500 font-medium text-center w-full mt-2">
            Xem thêm
          </button>
        </div>
      </div>
    </div>
  );
}

export default StationDetail;
