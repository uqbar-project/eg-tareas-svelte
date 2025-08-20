import { defineConfig } from 'vitest/config'
import { svelteTesting } from '@testing-library/svelte/vite'
import { sveltekit } from '@sveltejs/kit/vite'

export default defineConfig({
  // TODO: analizar qué pasa con los tipos acá
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins: [sveltekit(), svelteTesting()],

  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      reportsDirectory: './coverage',
      include: ['src'],
      exclude: ['src/routes/+layout.svelte'],
    }
  }
})