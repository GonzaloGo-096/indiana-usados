/**
 * useAutoLogout - Hook simple para cerrar sesión al cambiar de página
 * 
 * Características:
 * - Solo detecta cambio de página
 * - Simple y funcional
 * 
 * @author Indiana Usados
 * @version 1.0.0 - Simplificado
 */

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '@services/authService'

export const useAutoLogout = (isAuthenticated = false) => {
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) return

    // ✅ SOLO: Detectar cambio de página
    const handlePageHide = () => {
      // Limpiar sesión inmediatamente
      authService.clearLocalStorage()
      // Redirigir al login
      navigate('/admin/login')
    }

    // Agregar event listener
    window.addEventListener('pagehide', handlePageHide)

    // Cleanup
    return () => {
      window.removeEventListener('pagehide', handlePageHide)
    }
  }, [isAuthenticated, navigate])
}
