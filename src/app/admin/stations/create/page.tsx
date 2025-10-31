"use client";

import { AdminLayout } from "@/layout/AdminLayout";
import CreateForm from "./components/CreateForm";
import MapPicker from "../components/MapPicker";
import { useState } from "react";

export default function CreateStationPage() {
  const [mapCoords, setMapCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [address, setAddress] = useState<string>("");

  const handleMapSelect = (lat: number, lng: number) => {
    setMapCoords({ lat, lng });
  };

  const handleAddressGeocode = (lat: number, lng: number) => {
    setMapCoords({ lat, lng });
  };

  const handleAddressChange = (newAddress: string) => {
    setAddress(newAddress);
  };

  return (
    <AdminLayout>
      <div className="h-[calc(100vh-120px)] bg-gray-50 overflow-y-hidden">
        <div className="flex h-full">
          <CreateForm
            onMapSelect={handleMapSelect}
            onAddressGeocode={handleAddressGeocode}
            mapCoords={mapCoords}
            initialAddress={address}
          />
          <MapPicker
            onSelect={handleMapSelect}
            coordinates={mapCoords}
            onAddressChange={handleAddressChange}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
