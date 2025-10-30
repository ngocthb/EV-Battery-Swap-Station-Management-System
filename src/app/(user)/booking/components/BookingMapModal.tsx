"use client";

import "./MapBooking.css";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import { getStationById } from "@/services/stationService";
import type { GeoJSON } from "geojson";

interface BookingMapModal {
  stationId: number;
  userLat: number;
  userLng: number;
}

interface Step {
  maneuver: {
    instruction: string;
  };
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

function BookingMapModal({ stationId, userLat, userLng }: BookingMapModal) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [routeData, setRouteData] = useState<any>(null);
  const [direction, setDirection] = useState<any>(null);
  const [stationData, setStationData] = useState(null);

  const handleGetStationId = async () => {
    try {
      const res = await getStationById(stationId);
      console.log("get station by id res", res);
      setStationData(res.data);
    } catch (error) {
      console.log("get station detail error", error);
    }
  };
  useEffect(() => {
    handleGetStationId();
  }, []);

  // fetch user location
  useEffect(() => {
    if (!mapContainerRef.current || !userLat || !userLng) return;

    // Tạo map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [userLng, userLat],
      zoom: 14,
    });
    mapRef.current = map;

    // Marker user
    const userEl = document.createElement("div");
    userEl.className = "user-marker";
    new mapboxgl.Marker({ element: userEl })
      .setLngLat([userLng, userLat])
      .addTo(map);

    return () => map.remove();
  }, [userLat, userLng]);

  // đánh dấu station
  useEffect(() => {
    if (!stationData || !mapRef.current) return;

    const { longitude, latitude } = stationData;

    const stationEl = document.createElement("div");
    stationEl.className = "station-marker";

    new mapboxgl.Marker({ element: stationEl })
      .setLngLat([longitude, latitude])
      .addTo(mapRef.current);

    // di chuyển map để hiển thị cả 2 điểm
    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend([userLng, userLat]);
    bounds.extend([longitude, latitude]);
    mapRef.current.fitBounds(bounds, { padding: 80 });
  }, [stationData]);

  // get đường đi user đến trạm
  useEffect(() => {
    if (!stationData || !userLat || !userLng) return;

    const fetchRoute = async () => {
      const { latitude, longitude } = stationData;

      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${userLng},${userLat};${longitude},${latitude}?geometries=geojson&steps=true&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`;

      const res = await fetch(url);
      const data = await res.json();

      if (!data.routes || data.routes.length === 0) return;

      const route = data.routes[0];
      setRouteData(route.geometry);
      setDirection(route.legs[0]);
    };

    fetchRoute();
  }, [stationData, userLat, userLng]);

  // vẽ đường
  useEffect(() => {
    if (!mapRef.current || !routeData) return;

    const map = mapRef.current;

    const geojson: GeoJSON.Feature = {
      type: "Feature",
      properties: {},
      geometry: routeData as GeoJSON.Geometry,
    };

    if (map.getSource("route")) {
      (map.getSource("route") as mapboxgl.GeoJSONSource).setData(geojson);
    } else {
      map.addSource("route", {
        type: "geojson",
        data: geojson,
      });

      map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#007AFF", "line-width": 6 },
      });
    }
  }, [routeData]);

  return (
    <div className="relative w-[500px] h-[400px] rounded-xl overflow-hidden bg-gray-200">
      <div ref={mapContainerRef} className="w-full h-full" />

      {direction && (
        <div className="absolute top-2 right-2 bg-white rounded-lg shadow-lg p-3 max-h-50 w-[200px] overflow-y-auto text-sm">
          <h3 className="font-bold mb-2">
            Hướng đi: {(direction?.distance / 1000).toFixed(2)}km
          </h3>
          <p className="my-2 text-green-500">
            <strong className="text-black">Thời gian ước tính: </strong>
            <strong>{(direction.duration / 60).toFixed(0)} phút</strong>
          </p>
          <ol className="list-decimal ml-5 space-y-1">
            {direction?.steps?.map((step: Step, index: number) => (
              <li key={index} className="">{step.maneuver.instruction}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

export default BookingMapModal;
