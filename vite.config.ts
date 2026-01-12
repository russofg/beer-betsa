import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react({
          // Optimizar React para producción
          babel: {
            plugins: [
              // Remover console.log en producción
              mode === 'production' && ['babel-plugin-transform-remove-console', { exclude: ['error', 'warn'] }]
            ].filter(Boolean)
          }
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        // Optimizaciones de build
        target: 'esnext',
        minify: 'esbuild',
        cssMinify: true,
        sourcemap: false,
        rollupOptions: {
          output: {
            // Code splitting manual para mejor caching
            manualChunks: {
              'vendor-react': ['react', 'react-dom'],
              'vendor-motion': ['framer-motion'],
              'vendor-icons': ['lucide-react']
            },
            // Optimizar nombres de chunks
            chunkFileNames: 'assets/js/[name]-[hash].js',
            entryFileNames: 'assets/js/[name]-[hash].js',
            assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
          }
        },
        // Chunk size warnings
        chunkSizeWarningLimit: 1000
      },
      // Optimizar dependencias
      optimizeDeps: {
        include: ['react', 'react-dom', 'framer-motion', 'lucide-react'],
        exclude: []
      }
    };
});
