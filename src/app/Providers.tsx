"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { AuthProvider } from "@/components/AuthProvider";
import { CabinAdminProvider } from "./admin/cabins/context/CabinAdminContext";
import { BatteryAdminProvider } from "./admin/batteries/context/BatteryAdminContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        <CabinAdminProvider>
          <BatteryAdminProvider>{children}</BatteryAdminProvider>
        </CabinAdminProvider>
      </AuthProvider>
    </Provider>
  );
}
