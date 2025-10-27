import { getStationById } from "@/services/stationService";
import { Station } from "@/types";
import { isStationOpen } from "@/utils/format";
import { Battery, Clock, MapPin, Star, X } from "lucide-react";
import { useState } from "react";

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
  const [stations] = useState<Station[]>([
    {
      id: "1",
      name: "Brewery Electric Motorcycle Repair & Co",
      description: "Electric motorcycle repair and battery swap station",
      address:
        "Jl. Mega Kuningan Barat No.3, RW.2, Kuningan, Kuningan Timur, Jakarta Selatan",
      latitude: 10.7769,
      longitude: 106.7017,
      status: true,
      batteryCount: 8,
      temperature: "26.5",
      openTime: "Monday, 10:00 - 21:00",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      swappableBatteries: 2,
    },
    {
      id: "2",
      name: "District 3 Station",
      description: "Central district battery swap station",
      address: "123 Vo Van Tan, District 3, Ho Chi Minh City",
      latitude: 10.7834,
      longitude: 106.6934,
      status: false,
      batteryCount: 5,
      temperature: "24.0",
      openTime: "Monday, 08:00 - 22:00",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      swappableBatteries: 1,
    },
    {
      id: "3",
      name: "Binh Thanh Station",
      description: "Binh Thanh district battery swap station",
      address: "456 Xo Viet Nghe Tinh, Binh Thanh, Ho Chi Minh City",
      latitude: 10.8008,
      longitude: 106.7122,
      status: true,
      batteryCount: 12,
      temperature: "25.0",
      openTime: "Monday, 06:00 - 23:00",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      swappableBatteries: 3,
    },
    {
      id: "4",
      name: "Tan Binh Station",
      description: "Tan Binh district battery swap station",
      address: "789 Cong Hoa, Tan Binh, Ho Chi Minh City",
      latitude: 10.8142,
      longitude: 106.6438,
      status: true,
      batteryCount: 7,
      temperature: "26.0",
      openTime: "Monday, 07:00 - 21:00",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      swappableBatteries: 2,
    },
    {
      id: "5",
      name: "Go Vap Station",
      description: "Go Vap district battery swap station",
      address: "321 Nguyen Oanh, Go Vap, Ho Chi Minh City",
      latitude: 10.8376,
      longitude: 106.6676,
      status: false,
      batteryCount: 0,
      temperature: "0.0",
      openTime: "Monday, 08:00 - 20:00",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      swappableBatteries: 0,
    },
    {
      id: "6",
      name: "Thu Duc Station",
      description: "Thu Duc district battery swap station",
      address: "654 Vo Van Ngan, Thu Duc, Ho Chi Minh City",
      latitude: 10.8525,
      longitude: 106.7517,
      status: true,
      batteryCount: 15,
      temperature: "27.5",
      openTime: "Monday, 06:00 - 22:00",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      swappableBatteries: 4,
    },
  ]);
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

  const getBatteryColor = (level: number): string => {
    if (level >= 80) return "#22C55E";
    if (level >= 30) return "#F59E0B";
    return "#EF4444";
  };
  // end station detail fake data

  return (
    <div className="absolute top-0 bottom-0 lg:top-4 lg:bottom-4 lg:left-[30.5%] lg:w-[400px] bg-white shadow-lg z-20 border-l border-gray-200 flex flex-col rounded-xl overflow-hidden">
      {/*Image */}
      <div className="relative h-[200px]">
        <img
          src={
            openStationDetail?.image ||
            "https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=612x612&w=0&k=20&c=KuCo-dRBYV7nz2gbk4J9w1WtTAgpTdznHu55W9FjimE="
          }
          alt={stations[0]?.name}
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
          <p className="text-xs font-semibold text-gray-500 uppercase mb-3 tracking-wide">
            Pin
          </p>
          {batterySlots.map((slot, index) => (
            <div
              key={slot.id}
              className={`flex items-center justify-between py-4 ${
                index < batterySlots.length - 1
                  ? "border-b border-gray-100"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="relative w-16 h-8 bg-gray-100 rounded-md overflow-hidden">
                  <div
                    style={{
                      width: `${slot.level}%`,
                      backgroundColor: getBatteryColor(slot.level),
                    }}
                    className="h-full"
                  />
                  <span
                    className={`absolute inset-0 text-center leading-8 text-xs font-bold ${
                      slot.level < 30 ? "text-white" : "text-black"
                    }`}
                  >
                    {slot.level}%
                  </span>
                </div>
                <span className="text-gray-900 font-medium">{slot.label}</span>
              </div>

              {slot.swappable ? (
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 font-medium">Swappable</span>
                  <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                    ⚡
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-400">
                  <span>Not Swappable</span>
                  <div className="w-6 h-6 rounded-full bg-gray-200" />
                </div>
              )}
            </div>
          ))}
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
