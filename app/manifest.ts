import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lexli - AI Legal Workspace",
    short_name: "Lexli",
    description:
      "AI legal workspace for Indian legal teams: manage cases, translate documents, and get cited answers from your own case files.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#A45007",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
