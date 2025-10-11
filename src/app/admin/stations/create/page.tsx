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

  const handleMapSelect = (lat: number, lng: number) => {
    setMapCoords({ lat, lng });
  };

  const handleAddressGeocode = (lat: number, lng: number) => {
    setMapCoords({ lat, lng });
  };

  return (
    <AdminLayout>
      <div className="h-[calc(100vh-120px)] bg-gray-50">
        <div className="flex h-full">
          <CreateForm
            onMapSelect={handleMapSelect}
            onAddressGeocode={handleAddressGeocode}
            mapCoords={mapCoords}
          />
          <MapPicker onSelect={handleMapSelect} coordinates={mapCoords} />
        </div>
      </div>
    </AdminLayout>
  );
}
