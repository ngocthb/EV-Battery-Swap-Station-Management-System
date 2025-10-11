import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setUser,
  setLoading,
  setError,
  logout,
} from "@/store/slices/authSlice";
import authService from "@/services/authService";
import { toast } from "react-toastify";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  // Auto fetch profile khi component mount nếu có token
  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getToken();
      console.log("Auth init - Token exists:", !!token, "User exists:", !!user);

      if (token && !user && !isLoading) {
        dispatch(setLoading(true));
        try {
          console.log("Fetching user profile...");
          const userProfile = await authService.fetchProfile();
          console.log("User profile fetched:", userProfile);
          dispatch(setUser(userProfile));
        } catch (error: any) {
          console.error("Auth init error:", error);
          dispatch(setError(error.message));
          // Nếu token không hợp lệ, logout
          dispatch(logout());
        } finally {
          dispatch(setLoading(false));
        }
      } else if (!token && user) {
        // Nếu không có token nhưng có user trong store, logout
        console.log("No token but user exists, logging out");
        dispatch(logout());
      } else if (!token && !user) {
        // Nếu không có token và không có user, set loading false
        dispatch(setLoading(false));
      }
    };

    initAuth();
  }, [dispatch, user, isLoading]); // Include dependencies to ensure proper updates

  // Login function
  const login = async (formData: any) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const { user: userData } = await authService.login(formData);
      dispatch(setUser(userData));
      toast.success("Đăng nhập thành công!");
      return userData;
    } catch (error: any) {
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Logout function
  const logoutUser = () => {
    authService.logout();
    dispatch(logout());
    toast.success("Đã đăng xuất!");
  };

  // Refresh profile
  const refreshProfile = async () => {
    if (!authService.getToken()) return;

    dispatch(setLoading(true));
    try {
      const userProfile = await authService.fetchProfile();
      dispatch(setUser(userProfile));
    } catch (error: any) {
      dispatch(setError(error.message));
      // Nếu refresh thất bại, có thể token hết hạn
      dispatch(logout());
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated: isAuthenticated || !!user,
    login,
    logout: logoutUser,
    refreshProfile,
    hasToken: !!authService.getToken(),
  };
};
