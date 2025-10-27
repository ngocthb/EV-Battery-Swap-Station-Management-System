"use client";

import "./MapBooking.css";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import { getStationById } from "@/services/stationService";

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

  return (
    <div className="w-[500px] h-[400px] rounded-xl overflow-hidden bg-gray-200">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}

export default BookingMapModal;

// {/* Directions box */}
// {/* {directionInstruction && (
//   <div
//     id="instructions"
//     className="absolute top-2 left-2 bg-white rounded-lg shadow-lg p-4 max-h-[50%] max-w-[250px] lg:max-w-[300px] overflow-y-auto text-sm scrollbar-custom"
//   >
//     <div className="flex items-center justify-between">
//       <h3 className="font-bold lg:text-xl">
//         Hướng đi: {(directionInstruction.distance / 1000).toFixed(2)}km
//       </h3>
//       <X onClick={() => setDirectionInstruction(null)} />
//     </div>
//     <p className="my-2 text-green-500">
//       <strong className="text-black">Thời gian ước tính: </strong>
//       <strong>
//         {(directionInstruction.duration / 60).toFixed(0)} phút
//       </strong>
//     </p>
//     <ol className="list-decimal ml-5">
//       {directionInstruction.steps.map((step, index) => (
//         <li key={index}>{step.maneuver.instruction}</li>
//       ))}
//     </ol>
//   </div>
// )} */}

// vẽ đường đi khi có routeGeoJSON từ aside
//   useEffect(() => {
//     if (!mapRef.current) return;

//     const geojson: GeoJSON.Feature = {
//       type: "Feature",
//       properties: {},
//       geometry: routeGeoJSON,
//     };

//     if (mapRef.current.getSource("route")) {
//       (mapRef.current.getSource("route") as mapboxgl.GeoJSONSource).setData(
//         geojson
//       );
//     } else {
//       mapRef.current.addSource("route", { type: "geojson", data: geojson });
//       mapRef.current.addLayer({
//         id: "route",
//         type: "line",
//         source: "route",
//         layout: { "line-join": "round", "line-cap": "round" },
//         paint: { "line-color": "#007AFF", "line-width": 5 },
//       });
//     }
//   }, [routeGeoJSON]);
