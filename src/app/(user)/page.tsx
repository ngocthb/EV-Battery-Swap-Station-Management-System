"use client";

import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UserPage() {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-2xl w-full px-8 py-12 bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-xl flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-4 text-center">
          User Dashboard
        </h1>
        <p className="text-lg text-gray-600 mb-8 text-center">
          Welcome, {user.name}!
        </p>
        {/* Add user features here */}
      </div>
    </main>
  );
}
