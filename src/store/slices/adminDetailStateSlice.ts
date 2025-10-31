import { getBatteryById } from "@/services/batteryService";
import { getBatteryTypeById } from "@/services/batteryTypeService";
import { getCabinetByIdAPI } from "@/services/cabinetService";
import { getStationById } from "@/services/stationService";
import { Battery, BatteryType, Cabinet, Station } from "@/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EntityState<T> {
  id: number | null;
  data: T | null;
  loading: boolean;
}

interface AdminDetailState {
  station: EntityState<Station>;
  batteryType: EntityState<BatteryType>;
  battery: EntityState<Battery>;
  cabin: EntityState<Cabinet>;
}

const initialState: AdminDetailState = {
  station: { id: null, data: null, loading: false },
  batteryType: { id: null, data: null, loading: false },
  battery: { id: null, data: null, loading: false },
  cabin: { id: null, data: null, loading: false },
};

// call api
export const fetchStationDetail = createAsyncThunk(
  "adminDetail/fetchStationDetail",
  async (id: number) => {
    const res = await getStationById(id);
    return res.data;
  }
);

export const fetchBatteryTypeDetail = createAsyncThunk(
  "adminDetail/fetchBatteryTypeDetail",
  async (id: number) => {
    const res = await getBatteryTypeById(id);
    return res.data;
  }
);

export const fetchBatteryDetail = createAsyncThunk(
  "adminDetail/fetchBatteryDetail",
  async (id: number) => {
    const res = await getBatteryById(id);
    return res.data;
  }
);

export const fetchCabinDetail = createAsyncThunk(
  "adminDetail/fetchCabinDetail",
  async (id: number) => {
    const res = await getCabinetByIdAPI(id);
    return res.data;
  }
);

const adminDetailStateSlice = createSlice({
  name: "adminDetail",
  initialState,
  reducers: {
    setStationId: (state, action: PayloadAction<number | null>) => {
      state.station.id = action.payload;
    },
    setBatteryTypeId: (state, action: PayloadAction<number | null>) => {
      state.batteryType.id = action.payload;
    },
    setBatteryId: (state, action: PayloadAction<number | null>) => {
      state.battery.id = action.payload;
    },
    setCabinId: (state, action: PayloadAction<number | null>) => {
      state.cabin.id = action.payload;
    },
  },
  extraReducers: (builder) => {
    // station
    builder.addCase(fetchStationDetail.pending, (state) => {
      state.station.loading = true;
    });
    builder.addCase(fetchStationDetail.fulfilled, (state, action) => {
      state.station.loading = false;
      state.station.data = action.payload;
    });
    builder.addCase(fetchStationDetail.rejected, (state) => {
      state.station.loading = false;
    });

    // batteryType
    builder.addCase(fetchBatteryTypeDetail.pending, (state) => {
      state.batteryType.loading = true;
    });
    builder.addCase(fetchBatteryTypeDetail.fulfilled, (state, action) => {
      state.batteryType.loading = false;
      state.batteryType.data = action.payload;
    });
    builder.addCase(fetchBatteryTypeDetail.rejected, (state) => {
      state.batteryType.loading = false;
    });

    // battery
    builder.addCase(fetchBatteryDetail.pending, (state) => {
      state.battery.loading = true;
    });
    builder.addCase(fetchBatteryDetail.fulfilled, (state, action) => {
      state.battery.loading = false;
      state.battery.data = action.payload;
    });
    builder.addCase(fetchBatteryDetail.rejected, (state) => {
      state.battery.loading = false;
    });
    // cabin
    builder.addCase(fetchCabinDetail.pending, (state) => {
      state.cabin.loading = true;
    });
    builder.addCase(fetchCabinDetail.fulfilled, (state, action) => {
      state.cabin.loading = false;
      state.cabin.data = action.payload;
    });
    builder.addCase(fetchCabinDetail.rejected, (state) => {
      state.cabin.loading = false;
    });
  },
});

export const { setStationId, setBatteryTypeId, setCabinId, setBatteryId } =
  adminDetailStateSlice.actions;
export default adminDetailStateSlice.reducer;
