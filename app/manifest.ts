import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dashboard Monitoring ULP",
    short_name: "ULP Dashboard",
    description: "Dashboard Monitoring Unit Layanan Pengadaan RS Kanker Dharmais",
    start_url: "/",
    display: "standalone",
    background_color: "#F7FBFF",
    theme_color: "#0066CC",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
      {
        src: "/next.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}

