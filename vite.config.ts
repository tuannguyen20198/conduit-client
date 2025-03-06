import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()]
    },
    preprocessorOptions:{
      scss: {
        api: 'modern-compiler' // or "modern"
      }
    }
  },
  server: {
    port: 3000
  },
  build: { rollupOptions: { input: './index.html' } },
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@enums': path.resolve(__dirname, 'src/helpers/enums'),
      '@interfaces': path.resolve(__dirname, 'src/helpers/interfaces'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@types': path.resolve(__dirname, 'src/types'),
      '@helpers': path.resolve(__dirname, 'src/helpers'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@redux-slices': path.resolve(__dirname, 'src/redux-slices'),
      '@config': path.resolve(__dirname, 'src/config'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@containers': path.resolve(__dirname, 'src/containers'),
      '@route-constant': path.resolve(__dirname, 'src/config/routes/constants'),
      '@common': path.resolve(__dirname, 'src/assets/stylesheets/_index.scss'),
      '@locales': path.resolve(__dirname, 'src/locales'),
      '@env': path.resolve(__dirname, 'src/env.ts'),
    },
  },
})
