"use client";

import React from "react";
import { AdminLayout } from "@/layout/AdminLayout";
import UpdateForm from "./components/UpdateForm";
import MapPicker from "../../components/MapPicker";
import { useState, use, useCallback } from "react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditStationPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const [mapCoords, setMapCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [address, setAddress] = useState<string>("");

  const handleMapSelect = useCallback((lat: number, lng: number) => {
    setMapCoords({ lat, lng });
  }, []);

  const handleAddressGeocode = useCallback((lat: number, lng: number) => {
    setMapCoords({ lat, lng });
  }, []);

  const handleAddressChange = useCallback((newAddress: string) => {
    setAddress(newAddress);
  }, []);

  return (
    <AdminLayout>
      <div className="h-[calc(100vh-120px)] bg-gray-50">
        <div className="flex h-full">
          <UpdateForm
            stationId={parseInt(resolvedParams.id)}
            onMapSelect={handleMapSelect}
            onAddressGeocode={handleAddressGeocode}
            mapCoords={mapCoords}
            initialAddress={address}
          />
          <MapPicker
            coordinates={mapCoords}
            onSelect={handleMapSelect}
            onAddressChange={handleAddressChange}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
