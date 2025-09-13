"use client";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";

export default function AdminDashboard() {
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    window.location.reload();
  };
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-200 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center">
      <div className="w-full max-w-5xl bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-2xl p-10 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-indigo-700 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Welcome, Here are your admin stats and quick actions.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition">
              Create User
            </button>
            <button
              className="px-6 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-indigo-100 dark:bg-gray-800 rounded-xl p-6 flex flex-col items-center shadow">
            <span className="text-2xl font-bold text-indigo-700 mb-2">120</span>
            <span className="text-gray-600">Total Users</span>
          </div>
          <div className="bg-indigo-100 dark:bg-gray-800 rounded-xl p-6 flex flex-col items-center shadow">
            <span className="text-2xl font-bold text-indigo-700 mb-2">8</span>
            <span className="text-gray-600">Active Admins</span>
          </div>
          <div className="bg-indigo-100 dark:bg-gray-800 rounded-xl p-6 flex flex-col items-center shadow">
            <span className="text-2xl font-bold text-indigo-700 mb-2">32</span>
            <span className="text-gray-600">Pending Requests</span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow mt-4">
          <h2 className="text-xl font-bold text-indigo-700 mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <button className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">
              View Users
            </button>
            <button className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">
              Manage Admins
            </button>
            <button className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">
              Review Requests
            </button>
            <button className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">
              Settings
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
