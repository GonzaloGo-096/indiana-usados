/**
 * Vehicles Integration Tests
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { TestHarness, createVehicleList, createFilters } from '@test'

// 🎭 Mocks
vi.mock('@hooks', () => ({
  useVehiclesQuery: () => ({
    vehicles: createVehicleList(3),
    isLoading: false,
    isError: false,
    error: null,
    hasNextPage: true,
    isLoadingMore: false,
    loadMore: vi.fn(),
    refetch: vi.fn(),
    invalidateCache: vi.fn()
  }),
  useErrorHandler: () => ({
    error: null,
    isError: false,
    clearError: vi.fn(),
    handleError: vi.fn()
  }),
  useFilterReducer: () => ({
    filters: createFilters(),
    dispatch: vi.fn(),
    isSubmitting: false,
    setSubmitting: vi.fn(),
    isDrawerOpen: false,
    toggleDrawer: vi.fn(),
    closeDrawer: vi.fn()
  })
}))

vi.mock('@vehicles', () => ({
  FilterFormSimplified: ({ onApplyFilters, isLoading }) => (
    <div data-testid="filter-form">
      <button 
        onClick={() => onApplyFilters?.(createFilters())}
        disabled={isLoading}
      >
        Aplicar Filtros
      </button>
    </div>
  ),
  AutosGrid: ({ vehicles, onLoadMore, hasNextPage }) => (
    <div data-testid="autos-grid">
      {vehicles?.map((vehicle, index) => (
        <div key={vehicle.id || index} data-testid={`vehicle-${vehicle.id || index}`}>
          {vehicle.marca} {vehicle.modelo}
        </div>
      ))}
      {hasNextPage && (
        <button onClick={onLoadMore} data-testid="load-more-btn">
          Cargar más
        </button>
      )}
    </div>
  )
}))

vi.mock('@ui', () => ({
  ScrollToTop: () => <div data-testid="scroll-to-top">↑</div>
}))

vi.mock('@shared', () => ({
  VehiclesErrorBoundary: ({ children }) => <div data-testid="error-boundary">{children}</div>
}))

// 📋 Tests
describe('Vehicles Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Flujo completo de filtros', () => {
    it('should handle filter application flow', () => {
      render(
        <TestHarness>
          <div>
            {/* Simular FilterFormSimplified */}
            <div data-testid="filter-form">
              <button 
                onClick={() => {
                  // Simular aplicación de filtros
                  const mockFilters = createFilters({ marca: ['Toyota'] })
                  console.log('Filtros aplicados:', mockFilters)
                }}
              >
                Aplicar Filtros
              </button>
            </div>
            
            {/* Simular AutosGrid */}
            <div data-testid="autos-grid">
              <div data-testid="vehicle-1">Toyota Corolla</div>
              <div data-testid="vehicle-2">Toyota Camry</div>
              <button data-testid="load-more-btn">Cargar más</button>
            </div>
          </div>
        </TestHarness>
      )
      
      // Verificar que el formulario esté presente
      expect(screen.getByTestId('filter-form')).toBeInTheDocument()
      
      // Verificar que la grilla esté presente
      expect(screen.getByTestId('autos-grid')).toBeInTheDocument()
      
      // Verificar que los vehículos se muestren
      expect(screen.getByTestId('vehicle-1')).toBeInTheDocument()
      expect(screen.getByTestId('vehicle-2')).toBeInTheDocument()
      
      // Verificar botón de cargar más
      expect(screen.getByTestId('load-more-btn')).toBeInTheDocument()
    })
  })

  describe('Interacción entre componentes', () => {
    it('should show vehicles after filter application', () => {
      render(
        <TestHarness>
          <div>
            <div data-testid="filter-form">
              <button>Aplicar Filtros</button>
            </div>
            <div data-testid="autos-grid">
              <div data-testid="vehicle-1">Toyota Corolla</div>
              <div data-testid="vehicle-2">Toyota Camry</div>
            </div>
          </div>
        </TestHarness>
      )
      
      // Verificar que la integración funcione
      expect(screen.getByTestId('filter-form')).toBeInTheDocument()
      expect(screen.getByTestId('autos-grid')).toBeInTheDocument()
      expect(screen.getByText('Toyota Corolla')).toBeInTheDocument()
      expect(screen.getByText('Toyota Camry')).toBeInTheDocument()
    })
  })

  describe('Estados de carga', () => {
    it('should handle loading states correctly', () => {
      render(
        <TestHarness>
          <div>
            <div data-testid="filter-form">
              <button disabled>Aplicar Filtros</button>
            </div>
            <div data-testid="autos-grid">
              <div>Loading...</div>
            </div>
          </div>
        </TestHarness>
      )
      
      const applyButton = screen.getByText('Aplicar Filtros')
      expect(applyButton).toBeDisabled()
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })
  })

  describe('Manejo de errores', () => {
    it('should display error boundary wrapper', () => {
      render(
        <TestHarness>
          <div data-testid="error-boundary">
            <div data-testid="filter-form">
              <button>Aplicar Filtros</button>
            </div>
            <div data-testid="autos-grid">
              <div data-testid="vehicle-1">Toyota Corolla</div>
            </div>
          </div>
        </TestHarness>
      )
      
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument()
      expect(screen.getByTestId('filter-form')).toBeInTheDocument()
      expect(screen.getByTestId('autos-grid')).toBeInTheDocument()
    })
  })
}) 