import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/spa-shell")({
  component: () => <Navigate to="/" replace />,
});
