import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SIP H2H Dashboard",
    short_name: "SIP H2H",
    description: "Dashboard Monitoring Kredit Konsumtif Tercover Asuransi",
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

