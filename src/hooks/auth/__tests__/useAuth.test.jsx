/**
 * useAuth Hook Tests
 * @author Indiana Usados
 * @version 1.0.0
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useAuth } from '../useAuth'
import { authService } from '@services'
import { AUTH_CONFIG } from '@config/auth'

// Mock navigate antes de los otros mocks
const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

// Mock services
vi.mock('@services', () => ({
  authService: {
    login: vi.fn(),
    clearLocalStorage: vi.fn()
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

// Helper para crear JWT mock
const createMockJWT = (payload) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const encodedPayload = btoa(JSON.stringify(payload))
  return `${header}.${encodedPayload}.signature`
}

// Helper para crear JWT expirado
const createExpiredJWT = () => {
  const exp = Math.floor(Date.now() / 1000) - 3600 // 1 hora atrás
  return createMockJWT({ exp, username: 'test' })
}

// Helper para crear JWT válido
const createValidJWT = () => {
  const exp = Math.floor(Date.now() / 1000) + 3600 // 1 hora adelante
  return createMockJWT({ exp, username: 'test' })
}

describe('useAuth', () => {
  let localStorageMock

  beforeEach(() => {
    // Mock localStorage
    localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    }
    global.localStorage = localStorageMock

    vi.clearAllMocks()
    mockNavigate.mockClear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const wrapper = ({ children }) => (
    <MemoryRouter>
      {children}
    </MemoryRouter>
  )

  describe('Estado inicial', () => {
    it('should have initial state with no authentication', async () => {
      localStorageMock.getItem.mockReturnValue(null)

      const { result } = renderHook(() => useAuth(), { wrapper })

      // Esperar a que checkAuthStatus termine (puede ser muy rápido)
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Después de verificar: no autenticado
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.user).toBe(null)
    })
  })

  describe('Login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockUser = { id: 1, username: 'testuser', email: 'test@example.com' }
      const mockToken = createValidJWT()

      authService.login.mockResolvedValue({
        success: true,
        data: {
          token: mockToken,
          user: mockUser
        }
      })

      const { result } = renderHook(() => useAuth(), { wrapper })

      // Esperar a que termine el checkAuthStatus inicial
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      const loginResult = await result.current.login({
        username: 'testuser',
        password: 'password123'
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(loginResult.success).toBe(true)
      expect(authService.login).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123'
      })
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        AUTH_CONFIG.storage.tokenKey,
        mockToken
      )
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        AUTH_CONFIG.storage.userKey,
        JSON.stringify(mockUser)
      )
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.user).toEqual(mockUser)
      expect(result.current.error).toBe(null)
    })

    it('should handle login with invalid credentials', async () => {
      authService.login.mockResolvedValue({
        success: false,
        message: 'Credenciales inválidas'
      })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      const loginResult = await result.current.login({
        username: 'testuser',
        password: 'wrongpassword'
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(loginResult.success).toBe(false)
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.error).toBe('Credenciales inválidas')
    })

    it('should handle network error during login', async () => {
      const networkError = new Error('Network error')
      authService.login.mockRejectedValue(networkError)

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      const loginResult = await result.current.login({
        username: 'testuser',
        password: 'password123'
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(loginResult.success).toBe(false)
      expect(result.current.error).toBe('Network error')
      expect(result.current.isAuthenticated).toBe(false)
    })
  })

  describe('Logout', () => {
    it('should logout and clear authentication state', async () => {
      const mockUser = { id: 1, username: 'testuser' }
      const mockToken = createValidJWT()

      // Setup: usuario logueado
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === AUTH_CONFIG.storage.tokenKey) return mockToken
        if (key === AUTH_CONFIG.storage.userKey) return JSON.stringify(mockUser)
        return null
      })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Verificar que está autenticado
      expect(result.current.isAuthenticated).toBe(true)

      // Logout
      await result.current.logout()

      // Esperar a que el estado se actualice
      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false)
      })

      expect(authService.clearLocalStorage).toHaveBeenCalled()
      expect(result.current.user).toBe(null)
      expect(result.current.error).toBe(null)
    })
  })

  describe('Token validation', () => {
    it('should detect expired token and logout', async () => {
      const expiredToken = createExpiredJWT()
      const mockUser = { id: 1, username: 'testuser' }

      localStorageMock.getItem.mockImplementation((key) => {
        if (key === AUTH_CONFIG.storage.tokenKey) return expiredToken
        if (key === AUTH_CONFIG.storage.userKey) return JSON.stringify(mockUser)
        return null
      })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // El token expirado debería causar logout automático
      expect(authService.clearLocalStorage).toHaveBeenCalled()
      expect(result.current.isAuthenticated).toBe(false)
    })

    it('should accept valid token', async () => {
      const validToken = createValidJWT()
      const mockUser = { id: 1, username: 'testuser' }

      localStorageMock.getItem.mockImplementation((key) => {
        if (key === AUTH_CONFIG.storage.tokenKey) return validToken
        if (key === AUTH_CONFIG.storage.userKey) return JSON.stringify(mockUser)
        return null
      })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.user).toEqual(mockUser)
    })
  })

  describe('Session persistence', () => {
    it('should restore session from localStorage on mount', async () => {
      const validToken = createValidJWT()
      const mockUser = { id: 1, username: 'testuser', email: 'test@example.com' }

      localStorageMock.getItem.mockImplementation((key) => {
        if (key === AUTH_CONFIG.storage.tokenKey) return validToken
        if (key === AUTH_CONFIG.storage.userKey) return JSON.stringify(mockUser)
        return null
      })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.user).toEqual(mockUser)
    })
  })

  describe('getToken', () => {
    it('should return valid token', async () => {
      const validToken = createValidJWT()
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === AUTH_CONFIG.storage.tokenKey) return validToken
        return null
      })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      const token = result.current.getToken()
      expect(token).toBe(validToken)
    })

    it('should return null for expired token', async () => {
      const expiredToken = createExpiredJWT()
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === AUTH_CONFIG.storage.tokenKey) return expiredToken
        return null
      })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      const token = result.current.getToken()
      expect(token).toBe(null)
    })
  })

  describe('clearError', () => {
    it('should clear error state', async () => {
      authService.login.mockResolvedValue({
        success: false,
        message: 'Error de autenticación'
      })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await result.current.login({
        username: 'testuser',
        password: 'wrong'
      })

      await waitFor(() => {
        expect(result.current.error).toBeTruthy()
      })

      result.current.clearError()

      // Esperar a que el error se limpie
      await waitFor(() => {
        expect(result.current.error).toBe(null)
      })
    })
  })
})
