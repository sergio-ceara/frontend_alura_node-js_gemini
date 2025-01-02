import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',  // Permite acesso através de qualquer IP da rede local
    port: 5173,       // A porta que você quer usar
  },  
  plugins: [react()],
})
