import {
  Battery,
  BatteryType,
  Cabinet,
  Slot,
  Station,
  User,
  VehicleType,
} from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isOpen: boolean;
  data:
    | Cabinet
    | Station
    | Battery
    | BatteryType
    | VehicleType
    | Slot
    | User
    | null;
  loading: boolean;
}

interface AdminModalState {
  deleteModal: ModalState;
  restoreModal: ModalState;
}

const initialState: AdminModalState = {
  deleteModal: {
    isOpen: false,
    data: null,
    loading: false,
  },
  restoreModal: {
    isOpen: false,
    data: null,
    loading: false,
  },
};

const adminModalSlice = createSlice({
  name: "adminModal",
  initialState,
  reducers: {
    // delete
    openDeleteModal: (
      state,
      action: PayloadAction<
        Cabinet | Station | Battery | BatteryType | VehicleType | Slot | User
      >
    ) => {
      state.deleteModal = {
        isOpen: true,
        data: action.payload,
        loading: false,
      };
    },
    closeDeleteModal: (state) => {
      state.deleteModal = { isOpen: false, data: null, loading: false };
    },
    setDeleteLoading: (state, action: PayloadAction<boolean>) => {
      state.deleteModal.loading = action.payload;
    },

    // restore
    openRestoreModal: (
      state,
      action: PayloadAction<
        Cabinet | Station | Battery | BatteryType | VehicleType | Slot | User
      >
    ) => {
      state.restoreModal = {
        isOpen: true,
        data: action.payload,
        loading: false,
      };
    },
    closeRestoreModal: (state) => {
      state.restoreModal = { isOpen: false, data: null, loading: false };
    },
    setRestoreLoading: (state, action: PayloadAction<boolean>) => {
      state.restoreModal.loading = action.payload;
    },
  },
});

export const {
  openDeleteModal,
  closeDeleteModal,
  setDeleteLoading,
  openRestoreModal,
  closeRestoreModal,
  setRestoreLoading,
} = adminModalSlice.actions;

export default adminModalSlice.reducer;
