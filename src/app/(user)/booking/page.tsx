"use client";

import {  MapPin } from "lucide-react";
import { useState } from "react";
import AsideStation from "./components/AsideStation";
import StationDetail from "./components/StationDetail";
import BookingHeader from "./components/BookingHeader";

function BookingPage() {
  const [openStationDetail, setOpenStationDetail] = useState<string | null>(
    null
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <BookingHeader />

      {/*Body */}
      <div className="flex h-[calc(100vh-73px)] relative">
        {/*Aside */}
        <AsideStation setOpenStationDetail={setOpenStationDetail} />

        {/*Map */}
        <div className="hidden lg:block flex-1 bg-gray-100">
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <MapPin className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Khu vực bản đồ</p>
            </div>
          </div>
        </div>

        {/*Station detail */}
        {openStationDetail && (
          <StationDetail setOpenStationDetail={setOpenStationDetail} />
        )}
      </div>
    </div>
  );
}

export default BookingPage;
