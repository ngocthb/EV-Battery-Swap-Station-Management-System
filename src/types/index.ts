import { RoleName } from "@/enums/role.enum";

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
}

export interface Role {
  id: number;
  name: RoleName;
  description: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  users?: User[];
}

export interface UserMemberShip {
  id: number;
  expiredDate?: string;
  remainingSwaps?: number;
  membership?: Membership;
}

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  role: string;
  memberships?: UserMemberShip[];
  status: string;
  stationId: number;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// API Response Types
export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface UserProfileResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

// Permission Check Types
export interface UsePermissionsReturn {
  hasRole: (roles: string | string[]) => boolean;
  hasPermission: (resource: string, action: string) => boolean;
  canAccess: (path: string) => boolean;
  user: User | null;
  isLoading: boolean;
}

// Route Protection Types
export interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
  permissions?: string[];
  fallback?: React.ReactNode;
  requireAuth?: boolean;
}

// API Error Types
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: ApiError;
}

// Navigation Types
export interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  children?: NavigationItem[];
}

// Station Management Types (for EV system)
export interface Station {
  id: number;
  name: string;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
  status: boolean;
  batteryCount: number;
  temperature: string;
  openTime: string;
  closeTime?: string;
  image?: string;
  swappableBatteries: number;
  slotAvailable?: number;
  bookingCount?: number;
  avgRating?: number;
  feedbackCount?: number;
}

export interface Battery {
  id: string;
  model: string;
  capacity: number;
  currentCapacity?: number;
  currentCycle: number;
  price: string;
  stationId?: string;
  batteryType?: BatteryType;
  batteryLevel?: number;
  status:
    | "AVAILABLE"
    | "CHARGING"
    | "IN_USE"
    | "MAINTENANCE"
    | "RESERVED"
    | "DAMAGED_BATTERY";
  health?: number;
  lastUsed?: string;
  slotId?: number;
  userVehicleId?: number;
  slot?: Slot;
  batteryTypeId?: number;
  lastChargeTime?: string;
  healthScore?: number;
  estimatedFullChargeTime?: string;
  station?: Station;
  inUse?: boolean;
}

export interface BatteryType {
  id: number;
  name: string;
  description?: string;
  capacityKWh?: number;
  pricePerSwap?: string;
  status?: boolean;
  cycleLife?: number;
  chargeRate?: number;
}

export interface VehicleType {
  id: number;
  model: string;
  description?: string;
  batteryTypeName?: string;
  status?: boolean;
  batteryTypeId?: number;
}

export interface Vehicle {
  id?: number;
  name?: string;
  vehicleType?: VehicleType;
  batteries?: Battery[];
}

export interface Payment {
  id: number;
  name: string;
  description?: string;
}

export interface Transaction {
  id: number | string;
  booking?: Booking | number;
  bookingId?: number;
  orderCode?: number | null;
  payment?: Payment;
  status?: "SUCCESS" | "PENDING" | "FAILED" | "CANCELLED";
  dateTime?: string;
  totalPrice?: string;
  userMembership?: UserMemberShip;
  paymentUrl?: string | null;
  description?: string;
  paymentMethod?: number;
}

export interface Membership {
  id: number;
  name: string;
  description: string;
  duration?: number;
  status?: boolean;
  price?: number;
  createdAt?: string;
  updatedAt?: string;
  swapLimit?: number | null;
}

export interface Slot {
  id: number;
  batteryId: number | null;
  status:
    | "AVAILABLE"
    | "RESERVED"
    | "CHARGING"
    | "SWAPPING"
    | "MAINTENANCE"
    | "DAMAGED_BATTERY"
    | "EMPTY";
  name?: string;
  cabinetId?: string;
  cabinet: Cabinet;
  battery?: Battery;
}

export interface StationStaff {
  id: number;
  isHead: boolean;
  station: Station;
  status: boolean;
  user: User;
}

export interface StationHistoryRecord {
  id: number;
  stationStaffId: number;
  date: string;
  status: boolean;
  user: User;
  currentStation: Station;
  newStation: Station;
  createdAt: string;
}

export interface Cabinet {
  id: number;
  name: string;
  stationId: number;
  temperature: number;
  status: boolean;
  station?: Station;
  slots?: Slot[];
  // aggregate/status counts returned by API
  availablePins?: number;
  chargingPins?: number;
  emptySlots?: number;
  createdAt?: string;
  updatedAt?: string;
  slotCount?: number;
  batteryTypeId?: number;
  batteryInfo: BatteryType;
}

export interface UserVehicle {
  id: number;
  name: string;
  batteries?: Battery[];
}

export interface BookingDetail {
  id: number;
  batteryId: number;
  price?: number | string | null;
  status: string;
  bookingId?: number;
  reports?: any[];
}

export interface Booking {
  id: number;
  status?: string;
  station?: Station | null;
  isFree?: boolean;
  expectedPickupTime?: string | null;
  createdAt?: string;
  user?: User;
  userVehicle?: UserVehicle;
  bookingDetails: BookingDetail[];
  transaction?: Transaction;
  userMembership?: UserMemberShip;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  order?: string;
  status?: boolean | string;
  inUse?: boolean | string | null;
  stationId?: string | number | boolean | null | undefined;
  month?: number;
  year?: number;
  cabinetId?: number;
  lat?: number;
  lng?: number;
  role?: string;
  isHead?: boolean | null;
}

export interface MembershipResponse {
  success: boolean;
  message: string;
  data: Membership[];
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface FeedBack {
  id?: number;
  userId?: number;
  stationId?: number;
  content?: string;
  rating?: number;
  status?: boolean;
  createdAt?: string;
}

export interface Report {
  id?: number;
  bookingDetail?: BookingDetail;
  description?: string;
  faultyBatteryId?: number;
  status?: "PENDING";
  user?: User;
}
