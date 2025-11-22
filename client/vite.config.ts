import path from 'node:path'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    mui: ['@mui/material', '@mui/icons-material'],
                },
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
})
