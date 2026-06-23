import { defineConfig } from 'vite';

// Em desenvolvimento, o cliente roda na :5173 e o servidor na :3001.
// O proxy abaixo faz as chamadas a /api irem para o backend sem dor de cabeça de CORS.
export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
