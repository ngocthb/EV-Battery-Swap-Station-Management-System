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

  // Quan hệ
  users?: User[];
}

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  role: string;
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
  id: string;
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
}

export interface Battery {
  id: string;
  stationId: string;
  batteryLevel: number;
  status: "available" | "charging" | "in_use" | "maintenance";
  health: number;
  lastUsed?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  stationId: string;
  batteryId: string;
  type: "swap" | "return";
  timestamp: string;
  cost: number;
  status: "completed" | "pending" | "failed";
}

export interface Membership {
  id: number;
  name: string;
  description: string;
  duration: number;
  status: boolean;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Slot {
  id: number;
  batteryId: number | null;
  status: string; // "AVAILABLE" | "RESERVED" | "CHARGING" | "SWAPPING" | "MAINTENANCE"
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
}
