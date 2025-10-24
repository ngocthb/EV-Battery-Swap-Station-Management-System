"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { BatteryType } from "@/types";
import { getBatteryTypeById } from "@/services/batteryTypeService";

interface BatteryAdminContextType {
  batteryTypeId: number | null;
  setBatteryTypeId: (id: number | null) => void;
  batteryType: BatteryType | null;
  loading: boolean;
}

const BatteryAdminContext = createContext<BatteryAdminContextType | undefined>(
  undefined
);

export const BatteryAdminProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [batteryTypeId, setBatteryTypeId] = useState<number | null>(0);
  const [batteryType, setBatteryType] = useState<BatteryType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!batteryTypeId) return;

    const fetchBatteryType = async () => {
      setLoading(true);
      try {
        const res = await getBatteryTypeById(batteryTypeId);
        if (res.success) setBatteryType(res.data);
      } catch (error) {
        console.error("Failed to fetch battery type:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBatteryType();
  }, [batteryTypeId]);

  return (
    <BatteryAdminContext.Provider
      value={{ batteryTypeId, setBatteryTypeId, batteryType, loading }}
    >
      {children}
    </BatteryAdminContext.Provider>
  );
};

export const useBatteryAdmin = () => {
  const context = useContext(BatteryAdminContext);
  if (!context) {
    return {
      batteryTypeId: null,
      setBatteryTypeId: () => {},
      batteryType: null,
      loading: false,
    };
  }
  return context;
};
