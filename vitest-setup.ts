import '@testing-library/jest-dom/vitest'
import { vi, afterEach } from 'vitest'
import { cleanup } from '@testing-library/svelte'

// SvelteKit espera estos globals al hidratar ciertas utilidades del runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Object.assign(globalThis as any, {
  __SVELTEKIT_APP_VERSION__: 'test',
  __SVELTEKIT_DEV__: true,
  __SVELTEKIT_BUILD__: false,
  __SVELTEKIT_EMBEDDED__: false,
  __SVELTEKIT_PAYLOAD__: { data: {} }
})

// Mock general para navegación entre páginas
vi.mock('$app/navigation', () => ({ goto: vi.fn() }))

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})
