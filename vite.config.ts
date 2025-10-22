import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()],
    server: {
    host: true, // permite acesso via rede externa (localhost, IP local, túneis etc)
    port: 5173,
    allowedHosts: ['.loca.lt'], // aceita qualquer subdomínio do LocalTunnel (ex: odd-zoos-find.loca.lt)
  }
  
})
