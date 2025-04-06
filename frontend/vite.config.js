import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslint from 'vite-plugin-eslint'
import path from 'path'
import compression from 'vite-plugin-compression'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue(), eslint(),
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024,
      deleteOriginFile: false,
    })],
    preview: {
      host: true,
      allowedHosts: true
    },

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
      API_HOST: JSON.stringify(env.API_HOST),
      API_PORT: JSON.stringify(env.PORT),
      FRONT_PORT: JSON.stringify(env.FRONT_PORT),
      FRONT_HOST: JSON.stringify(env.FRONT_HOST),
    },
    build: {
      manifest: true,
      target: 'esnext',
      outDir: 'dist',
      assetsDir: 'assets',
      cssCodeSplit: true,
      sourcemap: false,
      minify: 'esbuild',
      reportCompressedSize: false,
      rollupOptions: {
        output: {
          manualChunks: undefined,
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash][extname]',
        },
      },
    },

  }
})
