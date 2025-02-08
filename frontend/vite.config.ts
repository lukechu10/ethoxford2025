import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import tailwindcss from "@tailwindcss/vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
	plugins: [solidPlugin(), tailwindcss(), nodePolyfills()],
	server: {
		port: 3000,
	},
	build: {
		target: "esnext",
	},
});
