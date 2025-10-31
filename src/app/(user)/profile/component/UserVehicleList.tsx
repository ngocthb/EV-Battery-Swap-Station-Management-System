import useFetchList from "@/hooks/useFetchList";
import { getUserVehicleAPI } from "@/services/userVehicleService";
import type { Vehicle } from "@/types";
import { Battery, Bike, Car, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import DeleteConfirmModal from "./DeleteConfirmModal";
import EditVehicleModal from "./EditVehicleModal";

function UserVehicleList() {
  const { data: vehicleList = [], refresh } =
    useFetchList<Vehicle[]>(getUserVehicleAPI);

  const [showModal, setShowModal] = useState<string | null>(null);
  const [editData, setEditData] = useState<Vehicle | null>(null);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium">Phương tiện</h3>

      <div className="space-y-3">
        {vehicleList && vehicleList.length > 0 ? (
          vehicleList.map((vehicle) => {
            const battery = vehicle?.batteries?.[0];
            return (
              <div
                key={vehicle.id}
                className="flex items-center justify-between bg-gray-50 rounded-xl p-5 hover:shadow-md transition"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Bike className="w-5 h-5" />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800">
                      {vehicle.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {vehicle.vehicleType?.model || "Không rõ loại"} —{" "}
                      <span className="text-gray-500 italic">
                        {vehicle.vehicleType?.description || "Không có mô tả"}
                      </span>
                    </p>

                    {battery && (
                      <div className="mt-2 flex items-center space-x-2 text-sm text-gray-700 bg-white p-2 rounded-lg border border-gray-200">
                        <Battery className="w-4 h-4 text-green-600" />
                        <span className="font-medium">{battery.model}</span>
                        <span className="text-gray-500">| Dung lượng:</span>
                        <span>{battery.currentCapacity}%</span>
                        <span className="text-gray-500">| Tình trạng:</span>
                        <span
                          className={`${
                            battery.status === "CHARGING"
                              ? "text-blue-600"
                              : battery.status === "AVAILABLE"
                              ? "text-green-600"
                              : "text-gray-500"
                          } font-medium`}
                        >
                          {battery.status}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => {
                      setEditData(vehicle);
                      setShowModal("update");
                    }}
                    className="text-blue-600 hover:text-blue-900 p-1"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditData(vehicle);
                      setShowModal("delete");
                    }}
                    className="text-red-600 hover:text-red-900 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-sm italic">
            Chưa có phương tiện nào.
          </p>
        )}
      </div>

      {showModal && showModal == "delete" && (
        <DeleteConfirmModal
          vehicle={editData}
          onClose={() => setShowModal(null)}
          onSuccess={() => {
            setShowModal(null);
            refresh();
          }}
        />
      )}

      {showModal && showModal === "update" && (
        <EditVehicleModal
          showModal={showModal}
          editData={editData}
          onClose={() => setShowModal(null)}
          onSuccess={() => {
            setShowModal(null);
            refresh();
          }}
        />
      )}
    </div>
  );
}

export default UserVehicleList;
