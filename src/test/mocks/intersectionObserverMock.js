/**
 * IntersectionObserver Mock - Simula infinite scroll en tests
 * @author Indiana Usados
 * @version 1.0.0
 */

// 🎭 Mock global de IntersectionObserver
export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = vi.fn()
  
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  })
  
  window.IntersectionObserver = mockIntersectionObserver
  
  return mockIntersectionObserver
}

// 🎯 Mock con callbacks personalizables
export const createIntersectionObserverMock = (options = {}) => {
  const {
    observe = vi.fn(),
    unobserve = vi.fn(),
    disconnect = vi.fn(),
    triggerIntersection = null
  } = options

  const mockObserver = {
    observe,
    unobserve,
    disconnect
  }

  // 🔄 Función para simular intersección
  if (triggerIntersection) {
    mockObserver.triggerIntersection = (entries) => {
      if (typeof observe === 'function' && observe.mock) {
        // Simular callback de intersección
        const callback = observe.mock.calls[0]?.[0]
        if (callback && typeof callback === 'function') {
          callback(entries)
        }
      }
    }
  }

  return mockObserver
}

// 📱 Mock para diferentes escenarios
export const intersectionObserverScenarios = {
  // 🟢 Siempre visible
  alwaysVisible: () => createIntersectionObserverMock({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn()
  }),

  // 🔴 Nunca visible
  neverVisible: () => createIntersectionObserverMock({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn()
  }),

  // 🟡 Visible después de delay
  visibleAfterDelay: (delay = 100) => {
    const mock = createIntersectionObserverMock({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn()
    })

    mock.observe.mockImplementation((element) => {
      setTimeout(() => {
        mock.triggerIntersection?.([{
          target: element,
          isIntersecting: true,
          intersectionRatio: 1
        }])
      }, delay)
    })

    return mock
  }
}

// 🌐 Setup global para todos los tests
export const setupIntersectionObserverMock = () => {
  beforeAll(() => {
    mockIntersectionObserver()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })
} 