/// <reference types="vitest" />

import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },

    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: 'src/shared/config/test/setupTests.ts',
        css: true,
        include: ['src/**/*.{test,spec}.{ts,tsx}'],
        // красиво показывать диффы
        watch: false,
    },
})
