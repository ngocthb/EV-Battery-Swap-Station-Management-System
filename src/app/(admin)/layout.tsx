"use client";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();

  console.log(user);
  useEffect(() => {
    if (!user) {
      router.replace("/login");
    } else if (user.isAdmin !== true) {
      router.replace("/");
    }
  }, [user, router]);

  return <div>{children}</div>;
}
