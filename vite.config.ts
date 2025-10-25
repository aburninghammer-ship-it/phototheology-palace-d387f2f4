import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React dependencies
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-core';
          }
          if (id.includes('node_modules/react-router')) {
            return 'react-router';
          }
          
          // Tanstack Query
          if (id.includes('@tanstack/react-query')) {
            return 'query-vendor';
          }
          
          // Radix UI components (split by component)
          if (id.includes('@radix-ui')) {
            const match = id.match(/@radix-ui\/react-([^\/]+)/);
            if (match) {
              return `radix-${match[1]}`;
            }
            return 'radix-ui';
          }
          
          // Games features
          if (id.includes('/pages/Games') || 
              id.includes('/pages/ChainChess') || 
              id.includes('/pages/VerseMatch') ||
              id.includes('/pages/PrinciplePuzzle') ||
              id.includes('/pages/ConcentrationGame') ||
              id.includes('/pages/KidsGame')) {
            return 'games';
          }
          
          // Course features
          if (id.includes('/pages/RevelationCourse') || 
              id.includes('/pages/DanielCourse') || 
              id.includes('/pages/BlueprintCourse') ||
              id.includes('/pages/PhototheologyCourse')) {
            return 'courses';
          }
          
          // GPT features
          if (id.includes('/pages/DanielRevelationGPT') || 
              id.includes('/pages/PhototheologyGPT') || 
              id.includes('/pages/KidGPT') ||
              id.includes('/pages/ApologeticsGPT')) {
            return 'gpts';
          }
          
          // Bible reading features
          if (id.includes('/pages/Bible') || 
              id.includes('/components/bible/') ||
              id.includes('/services/bibleApi')) {
            return 'bible';
          }
          
          // Other vendor libraries
          if (id.includes('node_modules')) {
            return 'vendor-other';
          }
        },
        // Optimize asset file naming for better caching
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return `assets/[name]-[hash][extname]`;
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          } else if (/css/i.test(ext)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
  },
}));
