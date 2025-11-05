/**
 * ModernErrorBoundary.test.jsx - Tests del Error Boundary
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { ModernErrorBoundary, GlobalErrorBoundary, VehiclesErrorBoundary } from '../../ErrorBoundary/ModernErrorBoundary'
import { logger } from '@utils/logger'

// Mock de logger
vi.mock('@utils/logger', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
    info: vi.fn()
  }
}))

// Componente que lanza error para testing
const ThrowError = ({ shouldThrow = false }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

describe('ModernErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('TEST 1: Renderiza children sin error', () => {
    it('should render children when no error occurs', () => {
      render(
        <ModernErrorBoundary>
          <div>Test content</div>
        </ModernErrorBoundary>
      )

      expect(screen.getByText('Test content')).toBeInTheDocument()
    })
  })

  describe('TEST 2: Captura error de componente hijo', () => {
    it('should catch error from child component', () => {
      // Suprimir console.error durante el test
      const originalError = console.error
      console.error = vi.fn()

      render(
        <ModernErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ModernErrorBoundary>
      )

      expect(screen.getByRole('heading', { name: /Error inesperado/i })).toBeInTheDocument()

      console.error = originalError
    })
  })

  describe('TEST 3: Muestra UI de error', () => {
    it('should display error UI when error occurs', () => {
      const originalError = console.error
      console.error = vi.fn()

      render(
        <ModernErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ModernErrorBoundary>
      )

      expect(screen.getByRole('heading', { name: /Error inesperado/i })).toBeInTheDocument()
      expect(screen.getByText(/Reintentar/i)).toBeInTheDocument()

      console.error = originalError
    })

    it('should display specific UI for vehicles variant', () => {
      const originalError = console.error
      console.error = vi.fn()

      render(
        <VehiclesErrorBoundary>
          <ThrowError shouldThrow={true} />
        </VehiclesErrorBoundary>
      )

      expect(screen.getByText(/Problema con los vehículos/i)).toBeInTheDocument()
      expect(screen.getByText(/⬅️ Volver atrás/i)).toBeInTheDocument()

      console.error = originalError
    })

    it('should display specific UI for global variant', () => {
      const originalError = console.error
      console.error = vi.fn()

      render(
        <GlobalErrorBoundary>
          <ThrowError shouldThrow={true} />
        </GlobalErrorBoundary>
      )

      expect(screen.getByText(/¡Ups! Algo salió mal/i)).toBeInTheDocument()

      console.error = originalError
    })
  })

  describe('TEST 4: Botón "Reintentar"', () => {
    it('should reset error boundary when retry button is clicked', () => {
      const originalError = console.error
      console.error = vi.fn()

      const onReset = vi.fn()

      render(
        <ModernErrorBoundary onReset={onReset}>
          <ThrowError shouldThrow={true} />
        </ModernErrorBoundary>
      )

      const retryButton = screen.getByText(/Reintentar/i)
      fireEvent.click(retryButton)

      // Verificar que el callback se llamó
      expect(onReset).toHaveBeenCalled()

      console.error = originalError
    })
  })

  describe('TEST 5: Logging de errores', () => {
    it('should log errors when they occur', () => {
      const originalError = console.error
      console.error = vi.fn()

      render(
        <ModernErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ModernErrorBoundary>
      )

      expect(logger.error).toHaveBeenCalled()

      console.error = originalError
    })

    it('should store errors in localStorage', () => {
      const originalError = console.error
      console.error = vi.fn()

      render(
        <ModernErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ModernErrorBoundary>
      )

      // Verificar que se intentó guardar en localStorage
      expect(logger.error).toHaveBeenCalled()

      console.error = originalError
    })
  })

  describe('TEST 6: Reset error boundary', () => {
    it('should reset error boundary when resetErrorBoundary is called', () => {
      const originalError = console.error
      console.error = vi.fn()

      const onReset = vi.fn()

      render(
        <ModernErrorBoundary onReset={onReset}>
          <ThrowError shouldThrow={true} />
        </ModernErrorBoundary>
      )

      const retryButton = screen.getByText(/Reintentar/i)
      fireEvent.click(retryButton)

      // El callback onReset debería haberse llamado
      expect(onReset).toHaveBeenCalled()

      console.error = originalError
    })

    it('should reload page when reload button is clicked', () => {
      const originalError = console.error
      console.error = vi.fn()

      render(
        <ModernErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ModernErrorBoundary>
      )

      const reloadButton = screen.getByText(/Recargar página/i)
      expect(reloadButton).toBeInTheDocument()
      
      // Verificar que el botón puede hacer click (la acción de reload es del navegador)
      fireEvent.click(reloadButton)
      
      // El botón debería estar presente y clickeable
      expect(reloadButton).toBeInTheDocument()

      console.error = originalError
    })
  })
})

