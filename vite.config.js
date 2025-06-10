import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // serve locally at “/”
  base: command === "serve" ? "/" : "/lunchbylaa/",
  plugins: [react()],
}));
