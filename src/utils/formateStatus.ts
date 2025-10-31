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
