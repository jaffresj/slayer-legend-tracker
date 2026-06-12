import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'

// Config Vitest séparée de vite.config.ts : les tests n'ont pas besoin du
// plugin Tailwind/React de build, seulement de l'alias et de l'environnement DOM.
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    css: false,
    coverage: {
      provider: 'v8',
      include: ['src/lib/**', 'src/services/**', 'src/stores/**', 'src/hooks/**'],
      reporter: ['text', 'html'],
    },
  },
})
