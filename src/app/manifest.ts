import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Noyb Struct",
    short_name: "Noyb Struct",
    description: "Learn design patterns by solving real challenges.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0a0a0a",
    icons: [
      { src: "/icons/logo-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/logo-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
