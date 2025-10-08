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
  stations: Station[];
  handleGetDirection: (
    start: [number, number],
    end: [number, number]
  ) => Promise<any>;
}

function AsideStation({
  setOpenStationDetail,
  stations,
  handleGetDirection,
}: AsideStationProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStations = stations.filter(
    (station) =>
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
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
                <button
                  onClick={() =>
                    handleGetInstructionDirection(
                      station.latitude,
                      station.longitude
                    )
                  }
                  className="flex-1 py-2.5 px-4 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-full hover:bg-blue-50 transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                >
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
