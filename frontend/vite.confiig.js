import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
            }
        }
    },
    // Add this to handle SVG and other assets
    build: {
        assetsDir: 'assets'
    }
})