import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslint from 'vite-plugin-eslint'
import path from 'path'
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue(), eslint()],

    server: {
      host: '0.0.0.0',
      port: Number(env.FRONT_PORT) || 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@handlers': path.resolve(__dirname, 'src/handlers'),
        '@lib': path.resolve(__dirname, 'src/lib'),
        '@view': path.resolve(__dirname, 'src/view'),
        '@components': path.resolve(__dirname, 'src/view/components'),
        '@pages': path.resolve(__dirname, 'src/view/pages'),
      },
    },
    define: {
      AUTH_TOKEN: JSON.stringify(env.AUTH_TOKEN),
      ENCRYPTION_KEY: JSON.stringify(env.ENCRYPTION_KEY),
    },
  }
})
