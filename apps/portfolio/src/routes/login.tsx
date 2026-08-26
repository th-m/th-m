import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Owner Login — THOM" },
      { name: "description", content: "Private owner access for THOM." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});
