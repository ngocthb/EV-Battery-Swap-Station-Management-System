"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { StaffLayout } from "@/layout/StaffLayout";

export default function StaffDashboard() {
  const user = useSelector((state: any) => state.auth.user);
  const router = useRouter();

  return (
    <StaffLayout>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center">
        <div className="w-full max-w-5xl bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-2xl p-10 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-blue-700 mb-2">
                Staff Dashboard
              </h1>
              <p className="text-lg text-gray-600 mb-2">
                Welcome, {user?.fullName}! Manage your station operations here.
              </p>
            </div>
            <div className="flex gap-4">
              <button className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
                Start Shift
              </button>
              <button className="px-6 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition">
                End Shift
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-100 dark:bg-gray-800 rounded-xl p-6 flex flex-col items-center shadow">
              <span className="text-2xl font-bold text-blue-700 mb-2">24</span>
              <span className="text-gray-600">Batteries Available</span>
            </div>
            <div className="bg-blue-100 dark:bg-gray-800 rounded-xl p-6 flex flex-col items-center shadow">
              <span className="text-2xl font-bold text-blue-700 mb-2">12</span>
              <span className="text-gray-600">Today's Swaps</span>
            </div>
            <div className="bg-blue-100 dark:bg-gray-800 rounded-xl p-6 flex flex-col items-center shadow">
              <span className="text-2xl font-bold text-blue-700 mb-2">98%</span>
              <span className="text-gray-600">Station Health</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow mt-4">
            <h2 className="text-xl font-bold text-blue-700 mb-4">
              Quick Actions
            </h2>
            <div className="flex flex-wrap gap-4">
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Battery Swap
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Check Inventory
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Report Issue
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Maintenance Log
              </button>
            </div>
          </div>
        </div>
      </main>
    </StaffLayout>
  );
}
