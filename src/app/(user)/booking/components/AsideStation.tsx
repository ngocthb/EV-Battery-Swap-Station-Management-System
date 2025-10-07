
import { Station } from "@/types";
import {
  Battery,
  Calendar,
  Clock,
  MapPin,
  Navigation,
  Search,
} from "lucide-react";
import { memo, useState } from "react";

interface AsideStationProps {
  setOpenStationDetail: React.Dispatch<React.SetStateAction<string | null>>;
}

function AsideStation({ setOpenStationDetail }: AsideStationProps) {
  const [stations] = useState<Station[]>([
    {
      id: "1",
      name: "Brewery Electric Motorcycle Repair & Co",
      address:
        "Jl. Mega Kuningan Barat No.3, RW.2, Kuningan, Kuningan Timur, Jakarta Selatan",
      latitude: 10.7769,
      longitude: 106.7017,
      status: "available",
      batteryCount: 8,
      openTime: "Monday, 10:00 - 21:00",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      swappableBatteries: 2,
    },
    {
      id: "2",
      name: "District 3 Station",
      address: "123 Vo Van Tan, District 3, Ho Chi Minh City",
      latitude: 10.7834,
      longitude: 106.6934,
      status: "occupied",
      batteryCount: 5,
      openTime: "Monday, 08:00 - 22:00",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      swappableBatteries: 1,
    },
    {
      id: "3",
      name: "Binh Thanh Station",
      address: "456 Xo Viet Nghe Tinh, Binh Thanh, Ho Chi Minh City",
      latitude: 10.8008,
      longitude: 106.7122,
      status: "available",
      batteryCount: 12,
      openTime: "Monday, 06:00 - 23:00",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      swappableBatteries: 3,
    },
    {
      id: "4",
      name: "Tan Binh Station",
      address: "789 Cong Hoa, Tan Binh, Ho Chi Minh City",
      latitude: 10.8142,
      longitude: 106.6438,
      status: "available",
      batteryCount: 7,
      openTime: "Monday, 07:00 - 21:00",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      swappableBatteries: 2,
    },
    {
      id: "5",
      name: "Go Vap Station",
      address: "321 Nguyen Oanh, Go Vap, Ho Chi Minh City",
      latitude: 10.8376,
      longitude: 106.6676,
      status: "occupied",
      batteryCount: 0,
      openTime: "Monday, 08:00 - 20:00",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      swappableBatteries: 0,
    },
    {
      id: "6",
      name: "Thu Duc Station",
      address: "654 Vo Van Ngan, Thu Duc, Ho Chi Minh City",
      latitude: 10.8525,
      longitude: 106.7517,
      status: "available",
      batteryCount: 15,
      openTime: "Monday, 06:00 - 22:00",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      swappableBatteries: 4,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredStations = stations.filter(
    (station) =>
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full lg:w-[30%] bg-white shadow-lg overflow-hidden flex flex-col">
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/*Station list */}
      <div className="flex-1 overflow-y-auto scrollbar-custom">
        <div className="p-4 space-y-4">
          {filteredStations.map((station) => (
            <div
              key={station.id}
              className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow p-4"
            >
              {/*img & name & status */}
              <div className="flex space-x-4 mb-4">
                <div className="flex-shrink-0">
                  <img
                    src={station.image}
                    alt={station.name}
                    className="w-24 h-24 rounded-xl object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  {/*Status */}
                  <div className="flex items-center space-x-2 mb-2">
                    <span
                      className={`inline-flex items-center space-x-1 text-xs font-medium ${
                        station.status == "available"
                          ? "text-green-700 bg-green-50"
                          : "text-red-700 bg-red-50"
                      }  px-2 py-1 rounded-full`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          station.status == "available"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                      <span>
                        {station.status.charAt(0).toUpperCase() +
                          station.status.slice(1)}
                      </span>
                    </span>
                    <span className="inline-flex items-center space-x-1 text-xs font-medium text-orange-700 bg-orange-50 px-2 py-1 rounded-full">
                      <Battery className="w-3 h-3" />
                      <span>
                        {station.swappableBatteries} Batteries Swappable
                      </span>
                    </span>
                  </div>

                  <h3
                    className="text-lg font-bold text-gray-900 mb-0.5 cursor-pointer hover:underline"
                    title="Chi tiết"
                    onClick={() => setOpenStationDetail(station?.id)}
                  >
                    {station.name}
                  </h3>
                </div>
              </div>

              <div className="flex items-start space-x-2 mb-2">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600 line-clamp-2">
                  {station.address}
                </p>
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <Clock className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-600">{station.openTime}</p>
              </div>
              {/*Button */}
              <div className="flex space-x-2">
                <button className="flex-1 py-2.5 px-4 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-full hover:bg-blue-50 transition-colors flex items-center justify-center space-x-1 cursor-pointer">
                  <Navigation className="w-4 h-4" />
                  <span>Tìm đường đi</span>
                </button>
                <button className="flex-1 py-2.5 px-4 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1 cursor-pointer">
                  <Calendar className="w-4 h-4" />
                  <span>Đặt lịch</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredStations.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <MapPin className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-lg">Không tìm thấy trạm nào</p>
            <p className="text-sm mt-2">Vui lòng thử từ khóa khác</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(AsideStation);
