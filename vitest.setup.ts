import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Démonte les composants et purge le localStorage entre chaque test pour
// éviter toute fuite d'état (stores Zustand persistés notamment).
afterEach(() => {
  cleanup()
  localStorage.clear()
})
