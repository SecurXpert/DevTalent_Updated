// vite.config.ts
import { defineConfig } from "file:///C:/divya/Devtalent_Updated/Devtalent_Updated/node_modules/vite/dist/node/index.js";
import react from "file:///C:/divya/Devtalent_Updated/Devtalent_Updated/node_modules/@vitejs/plugin-react/dist/index.js";
import path from "path";
import mkcert from "file:///C:/divya/Devtalent_Updated/Devtalent_Updated/node_modules/vite-plugin-mkcert/dist/mkcert.mjs";
var __vite_injected_original_dirname = "C:\\divya\\Devtalent_Updated\\Devtalent_Updated";
var vite_config_default = defineConfig({
  plugins: [react(), mkcert()],
  server: {
    host: "0.0.0.0",
    port: 8080,
    proxy: {
      "/api": {
        target: "http://192.168.0.144:8000",
        changeOrigin: true,
        secure: false,
        rewrite: (path2) => path2.replace(/^\/api/, "")
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    },
    dedupe: ["react", "react-dom"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxkaXZ5YVxcXFxEZXZ0YWxlbnRfVXBkYXRlZFxcXFxEZXZ0YWxlbnRfVXBkYXRlZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcZGl2eWFcXFxcRGV2dGFsZW50X1VwZGF0ZWRcXFxcRGV2dGFsZW50X1VwZGF0ZWRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L2RpdnlhL0RldnRhbGVudF9VcGRhdGVkL0RldnRhbGVudF9VcGRhdGVkL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgbWtjZXJ0IGZyb20gXCJ2aXRlLXBsdWdpbi1ta2NlcnRcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW3JlYWN0KCksIG1rY2VydCgpXSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIGhvc3Q6IFwiMC4wLjAuMFwiLFxyXG4gICAgcG9ydDogODA4MCxcclxuICAgIHByb3h5OiB7XHJcbiAgICAgICcvYXBpJzoge1xyXG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly8xOTIuMTY4LjAuMTA4OjkwMDAnLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICBzZWN1cmU6IGZhbHNlLFxyXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnJylcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXHJcbiAgICB9LFxyXG4gICAgZGVkdXBlOiBbXCJyZWFjdFwiLCBcInJlYWN0LWRvbVwiXSxcclxuICB9LFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE4VCxTQUFTLG9CQUFvQjtBQUMzVixPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sWUFBWTtBQUhuQixJQUFNLG1DQUFtQztBQUt6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQztBQUFBLEVBQzNCLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFFBQVE7QUFBQSxRQUNSLFNBQVMsQ0FBQ0EsVUFBU0EsTUFBSyxRQUFRLFVBQVUsRUFBRTtBQUFBLE1BQzlDO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLElBQ0EsUUFBUSxDQUFDLFNBQVMsV0FBVztBQUFBLEVBQy9CO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsicGF0aCJdCn0K
