import { useDebounce } from "@/hooks/useDebounce";
import useFetchList from "@/hooks/useFetchList";
import useQuery from "@/hooks/useQuery";
import { getAllUserListAPI } from "@/services/userService";
import { createUserVehicleAPI } from "@/services/userVehicleService";
import { getAllVehicleTypeListForUserAPI } from "@/services/vehicleService";
import { QueryParams, User, Vehicle, VehicleType } from "@/types";
import { memo, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

interface AddVehicleModalProps {
  onClose: () => void;
}

function AddVehicleModal({ onClose }: AddVehicleModalProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [createForm, setCreateForm] = useState({
    userNameOrEmail: "",
    vehicleTypeId: 0,
    name: "",
  });

  const { query, updateQuery, resetQuery } = useQuery<QueryParams>({
    page: 1,
    limit: 0,
    search: "",
    order: "asc",
    status: "VERIFIED",
    role: "USER",
  });

  const debouncedSearch = useDebounce(query.search, 500);
  const debouncedQuery = useMemo(
    () => ({ ...query, search: debouncedSearch }),
    [
      query.page,
      query.limit,
      query.order,
      query.status,
      query.stationId,
      debouncedSearch,
    ]
  );

  const { data: userList = [] } = useFetchList<User[], QueryParams>(
    getAllUserListAPI,
    debouncedQuery
  );

  const [loading, setLoading] = useState(false);

  const { data: vehicleTypeList = [] } = useFetchList<VehicleType[]>(
    getAllVehicleTypeListForUserAPI
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await createUserVehicleAPI(createForm);
      toast.success(res?.message || "Tạo phương tiện thành công");
      setCreateForm({
        userNameOrEmail: "",
        vehicleTypeId: 0,
        name: "",
      });
    } catch (err) {
      console.error("create vehicle err", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setCreateForm((prev) => ({
      ...prev,
      [name]: name === "vehicleTypeId" ? Number(value) : value,
    }));

    // Nếu là ô tìm user thì gọi API search
    if (name === "userNameOrEmail") {
      updateQuery({ search: value });
      setShowDropdown(true);
    }
  };

  const handleSelectUser = (user: any) => {
    setCreateForm((prev) => ({
      ...prev,
      userNameOrEmail: user.username,
    }));
    setShowDropdown(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-fadeIn">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Thêm phương tiện mới
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/*user */}
          <div className="relative">
            <label className="text-sm font-medium text-gray-700">
              Tài khoản người dùng
            </label>
            <input
              type="text"
              name="userNameOrEmail"
              className=" mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Nhập email/username/tên"
              onChange={(e) => handleChange(e)}
              value={createForm.userNameOrEmail}
              onFocus={() => query.search && setShowDropdown(true)}
            />

            {showDropdown && userList.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                {userList.map((user) => (
                  <li
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700"
                  >
                    <div className="font-medium">{user.username}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </li>
                ))}
              </ul>
            )}

            {/* Không có kết quả */}
            {showDropdown && userList.length === 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow p-3 text-sm text-gray-500 italic">
                Không tìm thấy người dùng
              </div>
            )}
          </div>

          {/*Vehicle name */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Tên phương tiện
            </label>
            <input
              type="text"
              name="name"
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ví dụ: Vinfast Evo 200"
              onChange={(e) => handleChange(e)}
              value={createForm.name}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Loại phương tiện
            </label>
            <select
              name="vehicleTypeId"
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={createForm.vehicleTypeId}
              onChange={(e) => handleChange(e)}
            >
              <option value={0}>Chọn loại phương tiện</option>
              {vehicleTypeList.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.model}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default memo(AddVehicleModal);
