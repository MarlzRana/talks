import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    {
      name: 'spa-fallback',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (
            req.url &&
            req.url.startsWith('/talks') &&
            !req.url.includes('.') &&
            req.headers.accept?.includes('text/html')
          ) {
            req.url = '/index.html'
          }
          next()
        })
      },
    },
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@talks': path.resolve(__dirname, 'talks'),
    },
  },
})
