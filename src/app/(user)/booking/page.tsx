"use client";

import { useState } from "react";
import AsideStation from "./components/AsideStation";
import StationDetail from "./components/StationDetail";
import BookingHeader from "./components/BookingHeader";
import MapBooking from "./components/MapBooking";
import { Station } from "@/types";
import useFetchList from "@/hooks/useFetchList";
import { getAllPublicStationList } from "@/services/stationService";
import { UserLayout } from "@/layout/UserLayout";

interface Step {
  maneuver: {
    instruction: string;
  };
}
function BookingPage() {
  const [openStationDetail, setOpenStationDetail] = useState<Station | null>(
    null
  );

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
    <UserLayout>
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
          <StationDetail
            setOpenStationDetail={setOpenStationDetail}
            openStationDetail={openStationDetail}
          />
        )}
      </div>
    </UserLayout>
  );
}

export default BookingPage;
