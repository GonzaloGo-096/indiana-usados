import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '../service/authService'
import { AUTH_CONFIG } from '../config/auth'

/**
 * Hook simplificado para manejar mutaciones de autenticación con React Query
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

export const useAuthMutation = () => {
  const queryClient = useQueryClient()

  // Mutation para login
  const loginMutation = useMutation({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: (data) => {
      // Invalidar queries relacionadas con el usuario
      queryClient.invalidateQueries({ queryKey: ['user'] })
      
      // Actualizar cache con datos del usuario
      queryClient.setQueryData(['user'], data.user)
    },
    onError: (error) => {
      console.error('Login error:', error)
    }
  })

  // Mutation para logout
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Limpiar cache al hacer logout
      queryClient.clear()
      
      // Limpiar localStorage
      localStorage.removeItem(AUTH_CONFIG.storage.tokenKey)
      localStorage.removeItem(AUTH_CONFIG.storage.userKey)
    },
    onError: (error) => {
      console.error('Logout error:', error)
      // Aún así limpiar cache y localStorage
      queryClient.clear()
      localStorage.removeItem(AUTH_CONFIG.storage.tokenKey)
      localStorage.removeItem(AUTH_CONFIG.storage.userKey)
    }
  })

  return {
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    logout: logoutMutation.mutate,
    logoutAsync: logoutMutation.mutateAsync,
    isLoading: loginMutation.isPending || logoutMutation.isPending,
    isLoginLoading: loginMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
    error: loginMutation.error || logoutMutation.error,
    loginError: loginMutation.error,
    logoutError: logoutMutation.error
  }
}

/**
 * Hook para usar con el hook useAuth existente
 * (Para mantener compatibilidad mientras migras a React Query)
 */
export const useAuthWithMutation = () => {
  const authMutations = useAuthMutation()
  
  return {
    ...authMutations,
    // Métodos compatibles con useAuth
    login: async (credentials) => {
      try {
        const result = await authMutations.loginAsync(credentials)
        return { success: true, data: result.user }
      } catch (error) {
        return { success: false, error: error.message }
      }
    },
    logout: async () => {
      try {
        await authMutations.logoutAsync()
      } catch (error) {
        console.error('Logout error:', error)
      }
    }
  }
} 