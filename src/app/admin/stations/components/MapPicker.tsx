"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { MapPin, Crosshair, Info } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface Props {
  onSelect?: (lat: number, lng: number) => void;
  onAddressChange?: (address: string) => void;
  initial?: { lat: number; lng: number } | null;
  coordinates?: { lat: number; lng: number } | null;
}

const MapPicker: React.FC<Props> = ({
  onSelect,
  onAddressChange,
  initial = null,
  coordinates = null,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [selectedCoords, setSelectedCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(initial);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Helper function to safely format coordinates
  const formatCoordinate = (value: any): string => {
    if (typeof value === "number" && !isNaN(value)) {
      return value.toFixed(6);
    }
    return "N/A";
  };

  // Reverse geocoding function to get address from coordinates
  const reverseGeocode = async (lng: number, lat: number) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const address = data.features[0].place_name;
        if (onAddressChange) {
          onAddressChange(address);
        }
        return address;
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
    }
    return null;
  };

  // Helper function to create a marker
  const createMarker = (lng: number, lat: number, color: string = "red") => {
    if (!mapRef.current) {
      return null;
    }

    // Create a more visible marker
    const el = document.createElement("div");
    el.innerHTML = `
      <div style="
        width: 40px;
        height: 40px;
        background-color: ${color === "red" ? "#dc2626" : "#2563eb"};
        border: 4px solid white;
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        position: relative;
        transform: translate(-20px, -20px);
      ">
        <div style="
          width: 16px;
          height: 16px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>
    `;

    if (markerRef.current) {
      markerRef.current.remove();
    }

    markerRef.current = new mapboxgl.Marker({
      element: el,
      anchor: "center",
    })
      .setLngLat([lng, lat])
      .addTo(mapRef.current);
    return markerRef.current;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: initial ? [initial.lng, initial.lat] : [106.7009, 10.7769],
      zoom: initial ? 14 : 11,
    });

    mapRef.current.on("load", () => {
      setMapLoaded(true);
    });

    // Add navigation controls
    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // show initial marker
    if (initial && mapRef.current) {
      createMarker(initial.lng, initial.lat, "red");
    }

    mapRef.current.on("click", async (e) => {
      const lng = e.lngLat.lng;
      const lat = e.lngLat.lat;

      console.log("Map clicked at:", { lng, lat });
      setSelectedCoords({ lat, lng });
      createMarker(lng, lat, "red");

      // Get address from coordinates
      await reverseGeocode(lng, lat);

      if (onSelect) onSelect(lat, lng);
    });

    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, []);

  // Update marker when coordinates prop changes (from geocoding)
  useEffect(() => {
    if (!coordinates || !mapRef.current || !mapLoaded) return;

    setSelectedCoords(coordinates);
    createMarker(coordinates.lng, coordinates.lat, "blue");

    // Pan to the new location smoothly
    mapRef.current.flyTo({
      center: [coordinates.lng, coordinates.lat],
      zoom: 15,
      duration: 1000,
    });
  }, [coordinates, mapLoaded]);

  return (
    <div className="w-1/2 relative bg-gray-100">
      {/* Map Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white bg-opacity-95 backdrop-blur-sm border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 mb-1 bg-blue-100 rounded-lg">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">
              Chọn vị trí trạm sạc
            </h2>
            <p className="text-sm text-gray-600">
              Click vào bản đồ để chọn vị trí chính xác
            </p>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Loading Overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-20">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-gray-600">Đang tải bản đồ...</p>
          </div>
        </div>
      )}

      {/* Coordinate Display */}
      {selectedCoords && (
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg border border-gray-200 p-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Crosshair className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Vị trí đã chọn</h3>
                <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                  <div>
                    <span className="text-gray-600">Latitude:</span>
                    <span className="ml-2 font-mono text-gray-900">
                      {formatCoordinate(selectedCoords?.lat)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Longitude:</span>
                    <span className="ml-2 font-mono text-gray-900">
                      {formatCoordinate(selectedCoords?.lng)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!selectedCoords && mapLoaded && (
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div>
                <p className="text-sm text-amber-800">
                  <strong>Hướng dẫn:</strong> Click vào bất kỳ vị trí nào trên
                  bản đồ để chọn làm vị trí trạm sạc
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPicker;
