// battery
export const getBatteryStatusStyle = (status?: string) => {
  switch (status) {
    case "AVAILABLE":
      return "bg-green-50 text-green-700";
    case "CHARGING":
      return "bg-yellow-50 text-yellow-700";
    case "IN_USE":
      return "bg-blue-50 text-blue-700";
    case "MAINTENANCE":
      return "bg-orange-50 text-orange-700";
    case "RESERVED":
      return "bg-purple-50 text-purple-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export const getBatteryStatusBackground = (status?: string) => {
  switch (status) {
    case "AVAILABLE":
      return "bg-green-100 text-green-800";
    case "MAINTENANCE":
      return "bg-red-100 text-red-800";
    case "CHARGING":
      return "bg-yellow-100 text-yellow-800";
    case "IN_USE":
      return "bg-blue-100 text-blue-800";
    case "RESERVED":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getBatteryStatusText = (status?: string) => {
  switch (status) {
    case "AVAILABLE":
      return "Sẵn sàng";
    case "CHARGING":
      return "Đang sạc";
    case "IN_USE":
      return "Đang sử dụng";
    case "MAINTENANCE":
      return "Bảo trì";
    case "RESERVED":
      return "Đã đặt trước";
    default:
      return "Không xác định";
  }
};

// battery type
export const getBatteryTypeStatusBackground = (status: boolean) => {
  switch (status) {
    case true:
      return "bg-green-100 text-green-800";
    case false:
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getBatteryTypeStatusText = (status: boolean) => {
  switch (status) {
    case true:
      return "Hoạt động";
    case false:
      return "Đã ẩn";
    default:
      return "Không xác định";
  }
};
// slot
export const getSlotStatusText = (status?: string) => {
  switch (status) {
    case "AVAILABLE":
      return "Sẵn sàng";
    case "RESERVED":
      return "Đã đặt trước";
    case "CHARGING":
      return "Đang sạc";
    case "SWAPPING":
      return "Đang đổi pin";
    case "MAINTENANCE":
      return "Bảo trì";
    case "DAMAGED_BATTERY":
      return "Bảo trì";
    case "EMPTY":
      return "Trống";
    default:
      return "Không xác định";
  }
};

export const getSlotStatusStyle = (status?: string) => {
  switch (status) {
    case "AVAILABLE":
      return "bg-green-50 text-green-700";
    case "RESERVED":
      return "bg-blue-50 text-blue-700";
    case "CHARGING":
      return "bg-yellow-50 text-yellow-700";
    case "SWAPPING":
      return "bg-purple-50 text-purple-700";
    case "MAINTENANCE":
      return "bg-orange-50 text-orange-700";
    case "EMPTY":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-50 text-gray-500";
  }
};

export const getSlotStatusBGAndTextWhiteStyle = (status?: string) => {
  switch (status) {
    case "AVAILABLE":
      return "bg-green-600 text-white";
    case "RESERVED":
      return "bg-blue-600 text-white";
    case "CHARGING":
      return "bg-yellow-600 text-white";
    case "SWAPPING":
      return "bg-purple-600 text-white";
    case "MAINTENANCE":
      return "bg-orange-600 text-white";
    case "DAMAGED_BATTERY":
      return "bg-orange-600 text-white";
    case "EMPTY":
      return "bg-gray-400 text-white";
    default:
      return "bg-gray-600 text-white";
  }
};

export const getSlotStatusTextStyle = (status?: string) => {
  switch (status) {
    case "AVAILABLE":
      return "text-green-600";
    case "RESERVED":
      return "text-blue-600";
    case "CHARGING":
      return "text-yellow-600";
    case "SWAPPING":
      return "text-purple-600";
    case "MAINTENANCE":
      return "text-orange-600";
    case "DAMAGED_BATTERY":
      return "text-orange-600";
    case "EMPTY":
      return "text-gray-400";
    default:
      return "text-gray-500";
  }
};

export const getSlotStatusBorderAndBgStyle = (status?: string) => {
  switch (status) {
    case "AVAILABLE":
      return "bg-green-50 border-green-500";
    case "RESERVED":
      return "bg-blue-50 border-blue-500";
    case "CHARGING":
      return "bg-yellow-50 border-yellow-500";
    case "SWAPPING":
      return "bg-purple-50 border-purple-500";
    case "MAINTENANCE":
      return "bg-orange-50 border-orange-500";
    case "DAMAGED_BATTERY":
      return "bg-orange-50 border-orange-500";
    case "EMPTY":
      return "bg-gray-100 border-gray-400";
    default:
      return "bg-gray-50 border-gray-500";
  }
};

// booking
export const getBookingStatusStyle = (status: string) => {
  switch (status) {
    case "RESERVED":
      return "bg-blue-100 text-blue-800";
    case "PENDING_PAYMENT":
      return "bg-yellow-100 text-yellow-800";
    case "IN_PROGRESS":
      return "bg-purple-100 text-purple-800";
    case "COMPLETED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    case "EXPIRED":
      return "bg-gray-200 text-gray-800";
    default:
      return "bg-gray-100 text-gray-500";
  }
};

export const getBookingStatusLabel = (status: string) => {
  switch (status) {
    case "RESERVED":
      return "Đã giữ chỗ";
    case "PENDING_PAYMENT":
      return "Chờ thanh toán";
    case "IN_PROGRESS":
      return "Đang thực hiện";
    case "COMPLETED":
      return "Hoàn thành";
    case "CANCELLED":
      return "Đã hủy";
    case "EXPIRED":
      return "Hết hạn";
    default:
      return "Không xác định";
  }
};

// Transaction
export const getTransactionStatusStyle = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800"; // Đang xử lý
    case "SUCCESS":
      return "bg-green-100 text-green-800"; // Thành công
    case "FAILED":
      return "bg-red-100 text-red-800"; // Thất bại
    case "CANCELLED":
      return "bg-gray-200 text-gray-800"; // Đã hủy
    default:
      return "bg-gray-100 text-gray-500"; // Không xác định
  }
};

export const getTransactionStatusLabel = (status: string) => {
  switch (status) {
    case "PENDING":
      return "Đang xử lý";
    case "SUCCESS":
      return "Thành công";
    case "FAILED":
      return "Thất bại";
    case "CANCELLED":
      return "Đã hủy";
    default:
      return "Không xác định";
  }
};

// User
export const getUserRoleColor = (role: string) => {
  switch (role) {
    case "AMIN":
      return "bg-purple-100 text-purple-800";
    case "STAFF":
      return "bg-blue-100 text-blue-800";
    case "USER":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getUserRoleText = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "Quản lý";
    case "STAFF":
      return "Nhân viên";
    case "USER":
      return "Khách hàng";
    default:
      return "Unknown";
  }
};

export const getUserStatusText = (status: string) => {
  switch (status) {
    case "VERIFIED":
      return "Đã xác thực";
    case "PENDING_VERIFICATION":
      return "Chưa xác thực";
    case "INACTIVE":
      return "Chưa kích hoạt";
    default:
      return "Unknown";
  }
};

export const getUserStatusColor = (status: string) => {
  switch (status) {
    case "VERIFIED":
      return "bg-green-100 text-green-800";
    case "PENDING_VERIFICATION":
      return "bg-yellow-100 text-yellow-800";
    case "INACTIVE":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getMembershipColor = (type: string) => {
  switch (type) {
    case "premium":
      return "bg-yellow-100 text-yellow-800";
    case "standard":
      return "bg-blue-100 text-blue-800";
    case "basic":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
