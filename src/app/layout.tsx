import "./globals.css";
import "mapbox-gl/dist/mapbox-gl.css";
import Providers from "./Providers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "amply - Hệ thống quản lý trạm thông minh",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
