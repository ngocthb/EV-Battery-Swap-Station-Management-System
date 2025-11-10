"use client";

import "@/app/(user)/booking/components/MapBooking.css";
import mapboxgl from "mapbox-gl";
import { Station } from "@/types";
import { useEffect, useRef } from "react";
import { getAllPublicStationList } from "@/services/stationService";
import useFetchList from "@/hooks/useFetchList";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

function AdminStationMap() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const { data: stationList = [] } = useFetchList<Station[]>(
    getAllPublicStationList
  );

  // fetch user location
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // create og map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/standard",
      center: [106.7009, 10.7769],
      zoom: 10,
    });

    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, []);

  // fetch all station
  useEffect(() => {
    if (!mapRef.current) return;

    const stationMarkers = stationList.map((station) => {
      const stationIcon = document.createElement("div");
      stationIcon.className = "station-marker";

      // render icon station location
      const marker = new mapboxgl.Marker({ element: stationIcon })
        .setLngLat([station.longitude, station.latitude])
        .addTo(mapRef.current!);

      return marker;
    });

    return () => {
      stationMarkers.forEach((marker) => marker.remove());
    };
  }, [stationList]);

  return (
    <div className="relative block h-[300px] lg:flex-1 bg-gray-100">
      <div
        ref={mapContainerRef}
        className="h-full flex items-center justify-center text-gray-400"
      ></div>
    </div>
  );
}

export default AdminStationMap;
