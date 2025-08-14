/**
 * Test Utils Index - Centraliza todas las exportaciones de testing
 * @author Indiana Usados
 * @version 1.0.0
 */

// 🏭 Factories
export * from './factories/vehicleFactory'

// 🎭 Test Harness
export * from './harness/TestHarness'

// 🎯 Mocks
export * from './mocks/intersectionObserverMock'

// 📊 Constantes de testing
export const TEST_CONSTANTS = {
  // ⏱️ Timeouts
  TIMEOUTS: {
    SHORT: 100,
    MEDIUM: 500,
    LONG: 1000
  },
  
  // 📱 Breakpoints
  BREAKPOINTS: {
    MOBILE: 375,
    TABLET: 768,
    DESKTOP: 1024
  },
  
  // 🎨 Colores de testing
  COLORS: {
    SUCCESS: '#22c55e',
    ERROR: '#ef4444',
    WARNING: '#f59e0b',
    INFO: '#3b82f6'
  }
}

// 🔧 Helpers de testing
export const testHelpers = {
  // 🧹 Limpiar mocks
  clearMocks: () => {
    vi.clearAllMocks()
    vi.clearAllTimers()
  },
  
  // ⏰ Avanzar tiempo
  advanceTimers: (ms = 1000) => {
    vi.advanceTimersByTime(ms)
  },
  
  // 🎭 Crear mock simple
  createMock: (implementation = {}) => {
    return {
      ...implementation,
      mock: {
        calls: [],
        instances: [],
        contexts: [],
        results: []
      }
    }
  }
} 