import { useDebounce } from "@/hooks/useDebounce";
import useFetchList from "@/hooks/useFetchList";
import useQuery from "@/hooks/useQuery";
import authService from "@/services/authService";
import { getAllUserListAPI, getUserDetailPI } from "@/services/userService";
import { createUserVehicleAPI } from "@/services/userVehicleService";
import { getAllVehicleTypeListForUserAPI } from "@/services/vehicleService";
import { QueryParams, User, Vehicle, VehicleType } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

interface UserDetailProp {
  userId: number | null;
  onClose: () => void;
}

function UserDetailModal({ userId, onClose }: UserDetailProp) {
  const handleGetUserInfomation = async () => {
    try {
      const res = await getUserDetailPI(Number(userId));
      console.log("get user detail res", res.data);
    } catch (error) {
      console.log("get user info err", error);
    }
  };
  
  useEffect(() => {
    handleGetUserInfomation();
  }, [userId]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-fadeIn">
        alo alo
      </div>
    </div>
  );
}

export default UserDetailModal;
