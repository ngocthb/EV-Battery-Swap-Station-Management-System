"use client";

import "./MapBooking.css";
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { Station } from "@/types";
import { getAllPublicStationList } from "@/services/stationService";
import useFetchList from "@/hooks/useFetchList";

function AdminStationMap() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const { data: stationList = [] } = useFetchList<Station[]>(
    getAllPublicStationList
  );

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

    if (!mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/standard",
      center: [106.7009, 10.7769],
      zoom: 10,
    });

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const markers = stationList.map((station) => {
      const el = document.createElement("div");
      el.className = "station-marker";
      return new mapboxgl.Marker({ element: el })
        .setLngLat([station.longitude, station.latitude])
        .addTo(mapRef.current!);
    });

    return () => markers.forEach((m) => m.remove());
  }, [stationList]);

  return (
    <div className="relative block h-[300px] lg:flex-1 bg-gray-100">
      <div ref={mapContainerRef} className="h-full w-full" />
    </div>
  );
}

export default AdminStationMap;
