import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Western Admin",
    short_name: "WesternAdmin",
    description: "Production-grade modular mobile PWA admin portal",
    start_url: "/",
    display: "standalone",
    background_color: "#0d0f14",
    theme_color: "#0d0f14",
    orientation: "portrait-primary",
    scope: "/",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
    categories: ["business", "productivity", "utilities"],
    shortcuts: [
      {
        name: "Dashboard",
        url: "/",
        description: "Open Admin Dashboard",
      },
      {
        name: "Modules",
        url: "/modules",
        description: "Explore Admin Modules",
      },
      {
        name: "Settings",
        url: "/settings",
        description: "Configure Admin Settings",
      },
    ],
  };
}
