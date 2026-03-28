import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";

// https://vite.dev/config/
const rewriteCookies = {
  cookieDomainRewrite: {
    "thenovagroupco.com": "localhost",
  },
  configure: (proxy: any) => {
    proxy.on("proxyRes", (proxyRes: any) => {
      const sc = proxyRes.headers["set-cookie"];
      if (sc) {
        proxyRes.headers["set-cookie"] = sc.map((cookie: string) =>
          cookie.replace(/;\s*secure/gi, "").replace(/;\s*samesite=\w+/gi, "")
        );
      }
    });
  },
};

export default defineConfig({
  plugins: [react(), TanStackRouterVite(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "https://dev.thenovagroupco.com",
        changeOrigin: true,
        secure: true,
        ...rewriteCookies,
      },
      "/sanctum": {
        target: "https://dev.thenovagroupco.com",
        changeOrigin: true,
        secure: true,
        ...rewriteCookies,
      },
    },
  },
});
