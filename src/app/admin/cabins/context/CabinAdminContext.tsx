"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getStationById } from "@/services/stationService";
import { Station } from "@/types";

interface CabinAdminContextType {
  stationId: number | null;
  setStationId: (id: number | null) => void;
  station: Station | null;
  loading: boolean;
}

const CabinAdminContext = createContext<CabinAdminContextType | undefined>(
  undefined
);

export const CabinAdminProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [stationId, setStationId] = useState<number | null>(1);
  const [station, setStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!stationId) return;

    const fetchStation = async () => {
      setLoading(true);
      try {
        const res = await getStationById(stationId);
        if (res.success) setStation(res.data);
      } catch (error) {
        console.error("Failed to fetch station:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStation();
  }, [stationId]);

  return (
    <CabinAdminContext.Provider
      value={{ stationId, setStationId, station, loading }}
    >
      {children}
    </CabinAdminContext.Provider>
  );
};

export const useCabinAdmin = () => {
  const context = useContext(CabinAdminContext);
  if (!context) {
    return {
      stationId: null,
      setStationId: () => {},
      station: null,
      loading: false,
    };
  }
  return context;
};
