// Rend les matchers jest-dom (toBeInTheDocument, toHaveAttribute, …) visibles
// pour TypeScript. L'import à effet de bord applique l'augmentation de module
// `vitest` à tout le programme ; le runtime est chargé via vitest.setup.ts.
import '@testing-library/jest-dom/vitest'
