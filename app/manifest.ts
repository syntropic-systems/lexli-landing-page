import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lexli — AI Legal Workspace",
    short_name: "Lexli",
    description:
      "AI legal workspace for Indian legal teams — manage cases, translate documents, and get cited answers from your own case files.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#A45007",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  };
}
