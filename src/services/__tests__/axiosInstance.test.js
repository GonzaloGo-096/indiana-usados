/**
 * axiosInstance.test.js - Tests de la configuración de Axios
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axiosInstance, { authAxiosInstance } from '@api/axiosInstance'
import { config } from '@config'
import { AUTH_CONFIG } from '@config/auth'

// Mock de localStorage funcional
const createLocalStorageMock = () => {
  const store = {}
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = String(value) }),
    removeItem: vi.fn((key) => { delete store[key] }),
    clear: vi.fn(() => { Object.keys(store).forEach(key => delete store[key]) }),
    get length() { return Object.keys(store).length }
  }
}

// Mock de dependencias
vi.mock('@config', () => ({
  config: {
    api: {
      baseURL: 'http://localhost:3001',
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    },
    isDevelopment: true,
    features: {
      debug: true
    },
    environment: 'development'
  }
}))

vi.mock('@config/auth', () => ({
  AUTH_CONFIG: {
    storage: {
      tokenKey: 'auth_token',
      userKey: 'auth_user'
    }
  }
}))

vi.mock('@utils/logger', () => ({
  logger: {
    log: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}))

describe('axiosInstance', () => {
  let localStorageMock

  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock = createLocalStorageMock()
    // Reemplazar localStorage global con nuestro mock funcional
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    })
    global.localStorage = localStorageMock
  })

  afterEach(() => {
    vi.restoreAllMocks()
    localStorageMock.clear()
  })

  describe('Configuración base', () => {
    it('TEST 1: should have correct base configuration', () => {
      expect(axiosInstance.defaults.baseURL).toBe(config.api.baseURL)
      expect(axiosInstance.defaults.timeout).toBe(config.api.timeout)
      expect(axiosInstance.defaults.headers['Content-Type']).toBe('application/json')
      expect(axiosInstance.defaults.headers['Accept']).toBe('application/json')
    })
  })

  describe('Request Interceptor', () => {
    it('TEST 2: should add timestamp metadata to requests', async () => {
      const mockRequest = {
        url: '/test',
        headers: {}
      }

      const interceptor = axiosInstance.interceptors.request.handlers[0]
      const result = await interceptor.fulfilled(mockRequest)

      expect(result.metadata).toBeDefined()
      expect(result.metadata.start).toBeTypeOf('number')
      expect(result.metadata.start).toBeGreaterThan(0)
    })

    it('should handle request errors', async () => {
      const mockError = new Error('Request error')
      const interceptor = axiosInstance.interceptors.request.handlers[0]

      await expect(interceptor.rejected(mockError)).rejects.toThrow('Request error')
    })
  })

  describe('Response Interceptor', () => {
    it('should add duration metadata to responses', async () => {
      const mockResponse = {
        config: {
          metadata: {
            start: performance.now() - 100
          }
        },
        data: { success: true }
      }

      const interceptor = axiosInstance.interceptors.response.handlers[0]
      const result = await interceptor.fulfilled(mockResponse)

      expect(result.config.metadata.durationMs).toBeDefined()
      expect(result.config.metadata.durationMs).toBeTypeOf('number')
      expect(result.config.metadata.durationMs).toBeGreaterThanOrEqual(0)
    })

    it('TEST 3: should handle 401 errors in response interceptor', async () => {
      const mockError = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' }
        },
        config: {
          url: '/test',
          method: 'get'
        }
      }

      const interceptor = axiosInstance.interceptors.response.handlers[0]
      
      await expect(interceptor.rejected(mockError)).rejects.toEqual(mockError)
    })

    it('TEST 4: should NOT retry on 4xx errors', async () => {
      const mockError = {
        response: {
          status: 400,
          data: { message: 'Bad Request' }
        },
        config: {
          url: '/test',
          method: 'get'
        }
      }

      const interceptor = axiosInstance.interceptors.response.handlers[0]
      
      await expect(interceptor.rejected(mockError)).rejects.toEqual(mockError)
    })

    it('TEST 5: should handle network errors', async () => {
      const mockError = {
        code: 'ERR_NETWORK',
        message: 'Network Error',
        config: {
          url: '/test',
          method: 'get'
        }
      }

      const interceptor = axiosInstance.interceptors.response.handlers[0]
      
      await expect(interceptor.rejected(mockError)).rejects.toEqual(mockError)
    })

    it('TEST 6: should handle timeout errors', async () => {
      const mockError = {
        code: 'ECONNABORTED',
        message: 'timeout of 15000ms exceeded',
        config: {
          url: '/test',
          method: 'get',
          metadata: {
            start: performance.now() - 16000
          }
        }
      }

      const interceptor = axiosInstance.interceptors.response.handlers[0]
      
      await expect(interceptor.rejected(mockError)).rejects.toEqual(mockError)
    })

    it('should ignore canceled requests', async () => {
      const mockError = {
        code: 'ERR_CANCELED',
        name: 'CanceledError',
        config: {
          url: '/test',
          method: 'get'
        }
      }

      const interceptor = axiosInstance.interceptors.response.handlers[0]
      
      await expect(interceptor.rejected(mockError)).rejects.toEqual(mockError)
    })
  })

  describe('Content-Type header', () => {
    it('TEST 7: should set Content-Type header correctly', () => {
      expect(axiosInstance.defaults.headers['Content-Type']).toBe('application/json')
    })
  })

  describe('CORS handling', () => {
    it('TEST 8: should handle CORS correctly (via axios defaults)', () => {
      // Axios maneja CORS automáticamente, solo verificamos que la configuración sea correcta
      expect(axiosInstance.defaults.baseURL).toBeDefined()
      expect(axiosInstance.defaults.headers['Accept']).toBe('application/json')
    })
  })
})

describe('authAxiosInstance', () => {
  let localStorageMock

  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock = createLocalStorageMock()
    // Reemplazar localStorage global con nuestro mock funcional
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    })
    global.localStorage = localStorageMock
  })

  afterEach(() => {
    vi.restoreAllMocks()
    localStorageMock.clear()
  })

  describe('Request Interceptor', () => {
    it('should add Authorization header when token exists', async () => {
      const token = 'test-token-123'
      localStorage.setItem(AUTH_CONFIG.storage.tokenKey, token)

      const mockRequest = {
        url: '/test',
        headers: {}
      }

      const interceptor = authAxiosInstance.interceptors.request.handlers[0]
      const result = await interceptor.fulfilled(mockRequest)

      expect(result.headers.Authorization).toBe(`Bearer ${token}`)
    })

    it('should not add Authorization header when token does not exist', async () => {
      localStorage.removeItem(AUTH_CONFIG.storage.tokenKey)

      const mockRequest = {
        url: '/test',
        headers: {}
      }

      const interceptor = authAxiosInstance.interceptors.request.handlers[0]
      const result = await interceptor.fulfilled(mockRequest)

      expect(result.headers.Authorization).toBeUndefined()
    })
  })

  describe('Response Interceptor', () => {
    it('should handle 401 errors and clear localStorage', async () => {
      const token = 'test-token-123'
      localStorage.setItem(AUTH_CONFIG.storage.tokenKey, token)
      localStorage.setItem(AUTH_CONFIG.storage.userKey, JSON.stringify({ username: 'test' }))

      const mockError = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' }
        }
      }

      // Mock window.dispatchEvent
      const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent').mockImplementation(() => true)

      const interceptor = authAxiosInstance.interceptors.response.handlers[0]
      
      await expect(interceptor.rejected(mockError)).rejects.toEqual(mockError)
      
      expect(localStorage.getItem(AUTH_CONFIG.storage.tokenKey)).toBeFalsy()
      expect(localStorage.getItem(AUTH_CONFIG.storage.userKey)).toBeFalsy()
      expect(dispatchEventSpy).toHaveBeenCalledWith(expect.any(CustomEvent))
      
      dispatchEventSpy.mockRestore()
    })

    it('should not clear localStorage on non-401 errors', async () => {
      const token = 'test-token-123'
      localStorage.setItem(AUTH_CONFIG.storage.tokenKey, token)

      const mockError = {
        response: {
          status: 500,
          data: { message: 'Server Error' }
        }
      }

      const interceptor = authAxiosInstance.interceptors.response.handlers[0]
      
      await expect(interceptor.rejected(mockError)).rejects.toEqual(mockError)
      
      expect(localStorage.getItem(AUTH_CONFIG.storage.tokenKey)).toBe(token)
    })
  })
})

