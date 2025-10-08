"use client";

import "./MapBooking.css";
import mapboxgl from "mapbox-gl";
import { Station } from "@/types";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

interface MapBookingProps {
  stations: Station[];
  routeGeoJSON: GeoJSON.Geometry | null;
  directionInstruction: {
    steps: Step[];
    duration: number;
    distance: number;
  } | null;
  setDirectionInstruction: React.Dispatch<
    React.SetStateAction<{
      steps: Step[];
      duration: number;
      distance: number;
    } | null>
  >;
  handleGetDirection: (
    start: [number, number],
    end: [number, number]
  ) => Promise<GeoJSON.Geometry | undefined>;
}

interface Step {
  maneuver: {
    instruction: string;
  };
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

function MapBooking({
  stations,
  routeGeoJSON,
  directionInstruction,
  handleGetDirection,
  setDirectionInstruction,
}: MapBookingProps) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);

  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
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

    // catch user real location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLng = position.coords.longitude;
          const userLat = position.coords.latitude;
          setUserLocation([userLng, userLat]);

          const userIcon = document.createElement("div");
          userIcon.className = "user-marker";

          // user location
          userMarkerRef.current = new mapboxgl.Marker({ element: userIcon })
            .setLngLat([userLng, userLat])
            .addTo(mapRef.current!);

          // move to user location
          mapRef.current!.flyTo({
            center: [userLng, userLat],
            zoom: 15,
            speed: 1.5,
          });
        },
        (error) => {
          console.warn("geolocation err", error);
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert("reload trang");
    }

    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, []);

  // fetch all station
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    const stationMarkers = stations.map((station) => {
      const stationIcon = document.createElement("div");
      stationIcon.className = "station-marker";

      // render icon station location
      const marker = new mapboxgl.Marker({ element: stationIcon })
        .setLngLat([station.longitude, station.latitude])
        .addTo(mapRef.current!);

      stationIcon.addEventListener("click", async () => {
        // lấy đg đi tới trạm
        const route = await handleGetDirection(userLocation!, [
          station.longitude,
          station.latitude,
        ]);

        if (!route || !mapRef.current) return;

        // hiện đường line
        const geojson: GeoJSON.Feature = {
          type: "Feature",
          properties: {},
          geometry: route,
        };

        if (mapRef.current.getSource("route")) {
          (mapRef.current.getSource("route") as mapboxgl.GeoJSONSource).setData(
            geojson
          );
        } else {
          mapRef.current.addSource("route", { type: "geojson", data: geojson });
          mapRef.current.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: { "line-join": "round", "line-cap": "round" },
            paint: { "line-color": "#007AFF", "line-width": 5 },
          });
        }
      });

      return marker;
    });

    return () => {
      stationMarkers.forEach((marker) => marker.remove());
    };
  }, [userLocation, stations]);

  // vẽ đường đi khi có routeGeoJSON từ aside
  useEffect(() => {
    if (!mapRef.current || !routeGeoJSON) return;

    const geojson: GeoJSON.Feature = {
      type: "Feature",
      properties: {},
      geometry: routeGeoJSON,
    };

    if (mapRef.current.getSource("route")) {
      (mapRef.current.getSource("route") as mapboxgl.GeoJSONSource).setData(
        geojson
      );
    } else {
      mapRef.current.addSource("route", { type: "geojson", data: geojson });
      mapRef.current.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#007AFF", "line-width": 5 },
      });
    }
  }, [routeGeoJSON]);

  return (
    <div className="relative block h-[50vh] lg:h-[100%] lg:flex-1 bg-gray-100">
      <div
        ref={mapContainerRef}
        className="h-full flex items-center justify-center text-gray-400"
      ></div>

      {/* Directions box */}
      {directionInstruction && (
        <div
          id="instructions"
          className="absolute top-2 left-2 bg-white rounded-lg shadow-lg p-4 max-h-[50%] max-w-[250px] lg:max-w-[300px] overflow-y-auto text-sm scrollbar-custom"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold lg:text-xl">
              Hướng đi: {(directionInstruction.distance / 1000).toFixed(2)}km
            </h3>
            <X onClick={() => setDirectionInstruction(null)} />
          </div>
          <p className="my-2 text-green-500">
            <strong className="text-black">Thời gian ước tính: </strong>
            <strong>
              {(directionInstruction.duration / 60).toFixed(0)} phút
            </strong>
          </p>
          <ol className="list-decimal ml-5">
            {directionInstruction.steps.map((step, index) => (
              <li key={index}>{step.maneuver.instruction}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

export default MapBooking;
