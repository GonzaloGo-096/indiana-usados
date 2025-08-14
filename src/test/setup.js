/**
 * 🧪 Setup de Testing - Indiana Usados
 * 
 * Configuración global para tests con Vitest + React Testing Library
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import '@testing-library/jest-dom'
import { vi } from 'vitest'

// 🎯 MOCKS GLOBALES

// Mock IntersectionObserver (usado en lazy loading)
global.IntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Mock ResizeObserver (usado en algunos componentes)
global.ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Mock matchMedia (usado en responsive)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock scrollTo (usado en ScrollToTop)
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn()
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.sessionStorage = sessionStorageMock

// 🎭 MOCKS DE LIBRERÍAS EXTERNAS

// Mock React Query (se mockea por componente según necesidad)
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query')
  return {
    ...actual,
    // Se pueden agregar mocks específicos aquí si es necesario
  }
})

// Mock React Router (se mockea por componente según necesidad)
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    // Se pueden agregar mocks específicos aquí si es necesario
  }
})

// Mock Axios (se mockea por componente según necesidad)
vi.mock('axios', async () => {
  const actual = await vi.importActual('axios')
  return {
    ...actual,
    // Se pueden agregar mocks específicos aquí si es necesario
  }
})

// 🔧 CONFIGURACIÓN ADICIONAL

// Configurar console para tests
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})

// Limpiar mocks después de cada test
afterEach(() => {
  vi.clearAllMocks()
  localStorageMock.clear()
  sessionStorageMock.clear()
})

console.log('🧪 Setup de testing configurado correctamente') 