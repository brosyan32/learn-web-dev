import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import bookingServer from './server/server.js';

export default defineConfig({
  plugins: [react(), bookingServer()],
  base: './',
  server: { port: 3000 },
  preview: { port: 3000 },
});
