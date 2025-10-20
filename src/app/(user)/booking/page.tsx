"use client";

import { useState } from "react";
import AsideStation from "./components/AsideStation";
import StationDetail from "./components/StationDetail";
import BookingHeader from "./components/BookingHeader";
import MapBooking from "./components/MapBooking";
import { Station } from "@/types";
import useFetchList from "@/hooks/useFetchList";
import { getAllPublicStationList } from "@/services/stationService";

interface Step {
  maneuver: {
    instruction: string;
  };
}
function BookingPage() {
  const [openStationDetail, setOpenStationDetail] = useState<string | null>(
    null
  );

  const [stations] = useState<Station[]>([
    {
      id: "1",
      name: "Brewery Electric Motorcycle Repair & Co",
      description: "Electric motorcycle repair and battery swap station",
      address:
        "Jl. Mega Kuningan Barat No.3, RW.2, Kuningan, Kuningan Timur, Jakarta Selatan",
      latitude: 10.7769,
      longitude: 106.7017,
      status: true,
      batteryCount: 8,
      openTime: "Monday, 10:00 - 21:00",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      swappableBatteries: 2,
    },
    {
      id: "2",
      name: "District 3 Station",
      description: "Central district battery swap station",
      address: "123 Vo Van Tan, District 3, Ho Chi Minh City",
      latitude: 10.7834,
      longitude: 106.6934,
      status: false,
      batteryCount: 5,
      openTime: "Monday, 08:00 - 22:00",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      swappableBatteries: 1,
    },
    {
      id: "3",
      name: "Binh Thanh Station",
      description: "Binh Thanh district battery swap station",
      address: "456 Xo Viet Nghe Tinh, Binh Thanh, Ho Chi Minh City",
      latitude: 10.8008,
      longitude: 106.7122,
      status: true,
      batteryCount: 12,
      openTime: "Monday, 06:00 - 23:00",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      swappableBatteries: 3,
    },
    {
      id: "4",
      name: "Tan Binh Station",
      description: "Tan Binh district battery swap station",
      address: "789 Cong Hoa, Tan Binh, Ho Chi Minh City",
      latitude: 10.8142,
      longitude: 106.6438,
      status: true,
      batteryCount: 7,
      openTime: "Monday, 07:00 - 21:00",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      swappableBatteries: 2,
    },
    {
      id: "5",
      name: "Go Vap Station",
      description: "Go Vap district battery swap station",
      address: "321 Nguyen Oanh, Go Vap, Ho Chi Minh City",
      latitude: 10.8376,
      longitude: 106.6676,
      status: false,
      batteryCount: 0,
      openTime: "Monday, 08:00 - 20:00",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      swappableBatteries: 0,
    },
    {
      id: "6",
      name: "Thu Duc Station",
      description: "Thu Duc district battery swap station",
      address: "654 Vo Van Ngan, Thu Duc, Ho Chi Minh City",
      latitude: 10.8525,
      longitude: 106.7517,
      status: true,
      batteryCount: 15,
      openTime: "Monday, 06:00 - 22:00",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      swappableBatteries: 4,
    },
  ]);

  const {
    data: stationList,
    loading,
    refresh,
  } = useFetchList(getAllPublicStationList);

  const [directionInstruction, setDirectionInstruction] = useState<{
    steps: Step[];
    duration: number;
    distance: number;
  } | null>(null);

  // line đường đi
  const [routeGeoJSON, setRouteGeoJSON] = useState<GeoJSON.Geometry | null>(
    null
  );

  const handleGetDirection = async (
    start: [number, number],
    end: [number, number]
  ) => {
    const res = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&steps=true&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
    );
    const data = (await res.json()).routes[0];

    const steps = data.legs[0].steps;

    console.log("data", data);

    setDirectionInstruction({
      steps,
      duration: data.duration,
      distance: data.distance,
    });
    setRouteGeoJSON(data.geometry);

    return data.geometry;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <BookingHeader />

      {/*Body */}
      <div className="flex sm:flex-row flex-col-reverse sm:h-[calc(100vh-73px)] relative">
        {/*Aside */}
        <AsideStation
          setOpenStationDetail={setOpenStationDetail}
          handleGetDirection={handleGetDirection}
        />

        {/*Map */}
        <MapBooking
          routeGeoJSON={routeGeoJSON}
          handleGetDirection={handleGetDirection}
          directionInstruction={directionInstruction}
          setDirectionInstruction={setDirectionInstruction}
        />

        {/*Station detail */}
        {openStationDetail && (
          <StationDetail setOpenStationDetail={setOpenStationDetail} />
        )}
      </div>
    </div>
  );
}

export default BookingPage;
