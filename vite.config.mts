import { execSync } from 'node:child_process';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import svgr from 'vite-plugin-svgr';
import importMetaEnv from '@import-meta-env/unplugin';

const __COMMIT_HASH__ = execSync('git rev-parse HEAD').toString().trim();

export default defineConfig(({ mode }) => ({
  plugins: [
    // NOTE: This is only here because of IPFS. When moving to Helia, this can be removed
    nodePolyfills({
      include: ['os', 'path', 'util'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
    react(),
    svgr(),
    importMetaEnv.vite({
      example: '.env.example',
      env: '.env',
    }),
  ],
  resolve: {
    alias: {
      '~apollo': path.resolve(__dirname, 'src/apollo'),
      '~auth': path.resolve(__dirname, 'src/auth'),
      '~common': path.resolve(__dirname, 'src/components/common'),
      '~constants': path.resolve(__dirname, 'src/constants'),
      '~context': path.resolve(__dirname, 'src/context'),
      '~frame': path.resolve(__dirname, 'src/components/frame'),
      '~gql': path.resolve(__dirname, 'src/graphql/generated.ts'),
      '~hooks': path.resolve(__dirname, 'src/hooks'),
      '~icons': path.resolve(__dirname, 'src/components/icons'),
      '~images': path.resolve(__dirname, 'src/images'),
      '~redux': path.resolve(__dirname, 'src/redux'),
      '~routes': path.resolve(__dirname, 'src/routes'),
      '~shared': path.resolve(__dirname, 'src/components/shared'),
      '~state': path.resolve(__dirname, 'src/state'),
      '~styles': path.resolve(__dirname, 'src/styles'),
      '~types': path.resolve(__dirname, 'src/types'),
      '~transformers': path.resolve(__dirname, 'src/transformers'),
      '~utils': path.resolve(__dirname, 'src/utils'),
      '~v5': path.resolve(__dirname, 'src/components/v5'),
    },
  },
  // NOTE: Do not define environment variables here. Instead, use .env files (__COMMIT_HASH__ is an exception)
  define: {
    __COMMIT_HASH__:
      mode === 'production' ? JSON.stringify(__COMMIT_HASH__) : undefined,
  },
  optimizeDeps: {
    exclude: ['react-spring'],
  },
  server: {
    port: 9091,
  },
}));
