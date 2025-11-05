/**
 * AutosGrid.test.jsx - Tests del componente de grid de vehículos
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import AutosGrid from '../ListAutos/AutosGrid'
import { createVehicle, createVehicleList } from '@test'

// Mock de CardAuto
vi.mock('@vehicles', () => ({
  CardAuto: ({ auto }) => (
    <div data-testid={`card-auto-${auto.id}`}>
      <h3>{auto.marca} {auto.modelo}</h3>
      <p>{auto.precio}</p>
    </div>
  )
}))

// Mock de ListAutosSkeleton
vi.mock('@shared', () => ({
  ListAutosSkeleton: () => <div data-testid="skeleton-loader">Cargando...</div>
}))

describe('AutosGrid', () => {
  const mockOnRetry = vi.fn()
  const mockOnLoadMore = vi.fn()

  const defaultProps = {
    vehicles: [],
    isLoading: false,
    isError: false,
    error: null,
    onRetry: mockOnRetry,
    hasNextPage: false,
    isLoadingMore: false,
    onLoadMore: mockOnLoadMore
  }

  const renderComponent = (props = {}) => {
    const componentProps = { ...defaultProps, ...props }
    return render(
      <MemoryRouter>
        <AutosGrid {...componentProps} />
      </MemoryRouter>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('TEST 1: Renderizado de vehículos', () => {
    it('should render vehicles correctly', () => {
      const vehicles = createVehicleList(3)
      renderComponent({ vehicles })

      expect(screen.getByTestId('card-auto-1')).toBeInTheDocument()
      expect(screen.getByTestId('card-auto-2')).toBeInTheDocument()
      expect(screen.getByTestId('card-auto-3')).toBeInTheDocument()
    })

    it('should render vehicle information', () => {
      const vehicles = [createVehicle({ id: 1, marca: 'Toyota', modelo: 'Corolla' })]
      renderComponent({ vehicles })

      expect(screen.getByText(/Toyota/)).toBeInTheDocument()
      expect(screen.getByText(/Corolla/)).toBeInTheDocument()
    })
  })

  describe('TEST 2: Grid vacío', () => {
    it('should show empty state when no vehicles', () => {
      renderComponent({ vehicles: [] })

      expect(screen.getByText(/No se encontraron vehículos/i)).toBeInTheDocument()
      expect(screen.getByText(/Intenta ajustar los filtros/i)).toBeInTheDocument()
    })
  })

  describe('TEST 3: Botón "Cargar más"', () => {
    it('should show load more button when hasNextPage is true', () => {
      const vehicles = createVehicleList(3)
      renderComponent({ vehicles, hasNextPage: true })

      expect(screen.getByText(/Cargar más vehículos/i)).toBeInTheDocument()
    })

    it('should call onLoadMore when button is clicked', () => {
      const vehicles = createVehicleList(3)
      renderComponent({ vehicles, hasNextPage: true })

      const loadMoreButton = screen.getByText(/Cargar más vehículos/i)
      fireEvent.click(loadMoreButton)

      expect(mockOnLoadMore).toHaveBeenCalledTimes(1)
    })

    it('should not show load more button when hasNextPage is false', () => {
      const vehicles = createVehicleList(3)
      renderComponent({ vehicles, hasNextPage: false })

      expect(screen.queryByText(/Cargar más vehículos/i)).not.toBeInTheDocument()
    })
  })

  describe('TEST 4: Loading state', () => {
    it('should show skeleton when loading initially', () => {
      renderComponent({ isLoading: true, vehicles: [] })

      expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument()
    })

    it('should not show skeleton when vehicles exist', () => {
      const vehicles = createVehicleList(3)
      renderComponent({ isLoading: true, vehicles })

      expect(screen.queryByTestId('skeleton-loader')).not.toBeInTheDocument()
    })

    it('should show loading text on load more button when isLoadingMore', () => {
      const vehicles = createVehicleList(3)
      renderComponent({ vehicles, hasNextPage: true, isLoadingMore: true })

      expect(screen.getByText(/Cargando.../i)).toBeInTheDocument()
    })
  })

  describe('TEST 5: Click en tarjeta', () => {
    it('should render clickable vehicle cards', () => {
      const vehicles = [createVehicle({ id: 1 })]
      renderComponent({ vehicles })

      const card = screen.getByTestId('card-auto-1')
      expect(card).toBeInTheDocument()
    })
  })

  describe('TEST 6: Responsive layout', () => {
    it('should render grid container', () => {
      const vehicles = createVehicleList(3)
      const { container } = renderComponent({ vehicles })

      // Verificar que el componente se renderiza correctamente
      const gridElements = container.querySelectorAll('[class*="grid"]')
      expect(gridElements.length).toBeGreaterThan(0)
    })
  })

  describe('TEST 7: Skeleton loading', () => {
    it('should show skeleton when loading with no vehicles', () => {
      renderComponent({ isLoading: true, vehicles: [] })

      expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument()
    })
  })

  describe('TEST 8: Error state', () => {
    it('should show error message when isError is true', () => {
      renderComponent({ 
        isError: true, 
        error: { message: 'Error al cargar vehículos' } 
      })

      expect(screen.getByText(/Algo salió mal/i)).toBeInTheDocument()
      expect(screen.getByText(/Error al cargar vehículos/i)).toBeInTheDocument()
    })

    it('should call onRetry when retry button is clicked', () => {
      renderComponent({ 
        isError: true, 
        error: { message: 'Error' },
        onRetry: mockOnRetry
      })

      const retryButton = screen.getByText(/Reintentar/i)
      fireEvent.click(retryButton)

      expect(mockOnRetry).toHaveBeenCalledTimes(1)
    })

    it('should show default error message when no error message provided', () => {
      renderComponent({ isError: true, error: null })

      expect(screen.getByText(/Error al cargar los vehículos/i)).toBeInTheDocument()
    })

    it('should disable load more button when isLoadingMore', () => {
      const vehicles = createVehicleList(3)
      renderComponent({ vehicles, hasNextPage: true, isLoadingMore: true })

      const loadMoreButton = screen.getByText(/Cargando.../i)
      expect(loadMoreButton).toBeDisabled()
    })
  })
})

