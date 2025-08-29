import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"
import svgr from "vite-plugin-svgr"

export default defineConfig({
	plugins: [
		react(),
		svgr({
			include: "**/*.svg?react",
			exclude: "",
		}),
	],
	resolve: {
		alias: {
			"@assets": path.resolve(__dirname, "src/assets"),
			"@app": path.resolve(__dirname, "src/app"),
			"@shared": path.resolve(__dirname, "src/shared"),
			"@features": path.resolve(__dirname, "src/features"),
			"@entities": path.resolve(__dirname, "src/entities"),
			"@pages": path.resolve(__dirname, "src/pages"),
			"@widgets": path.resolve(__dirname, "src/widgets"),
		},
	},
})
