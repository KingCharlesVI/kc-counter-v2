// client/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { networkInterfaces } from 'os'

// Function to get local IP address
function getLocalIP() {
  const nets = networkInterfaces()
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        return net.address
      }
    }
  }
  return 'localhost'
}

// Get local IP address
const localIP = getLocalIP()

export default defineConfig({
  plugins: [react()],
  server: {
    port: 6010,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: `http://${localIP}:6020`,
        changeOrigin: true,
      },
    },
  },
})