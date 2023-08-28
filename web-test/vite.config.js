import { defineConfig } from 'vite';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    https: {
      key: fs.readFileSync('../.cert/root.key'),
      cert: fs.readFileSync('../.cert/root.crt'),
    },
  }
});