import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mockServer from './server/server.js';

export default defineConfig({
  plugins: [react(), mockServer()],
  server: { port: 3000 },
});
