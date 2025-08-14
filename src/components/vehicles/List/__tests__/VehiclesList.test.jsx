/**
 * VehiclesList Component Tests
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import VehiclesList from '../VehiclesList'
import { TestHarness } from '@test'

// 🎭 Mocks
vi.mock('@hooks', () => ({
  useVehiclesQuery: () => ({
    vehicles: [],
    isLoading: true,
    isError: false,
    error: null,
    hasNextPage: false,
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
  })
}))

vi.mock('@vehicles', () => ({
  FilterFormSimplified: () => (
    <div data-testid="filter-form">
      <button>Aplicar Filtros</button>
    </div>
  ),
  AutosGrid: () => (
    <div data-testid="autos-grid">
      <div data-testid="vehicle-1">Toyota Corolla</div>
      <button data-testid="load-more-btn">Cargar más</button>
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
describe('VehiclesList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Renderizado básico', () => {
    it('should render with basic structure', () => {
      render(
        <TestHarness>
          <VehiclesList />
        </TestHarness>
      )
      
      expect(screen.getByTestId('filter-form')).toBeInTheDocument()
      expect(screen.getByTestId('autos-grid')).toBeInTheDocument()
    })

    it('should show filter form', () => {
      render(
        <TestHarness>
          <VehiclesList />
        </TestHarness>
      )
      
      expect(screen.getByTestId('filter-form')).toBeInTheDocument()
      expect(screen.getByText('Aplicar Filtros')).toBeInTheDocument()
    })

    it('should show autos grid', () => {
      render(
        <TestHarness>
          <VehiclesList />
        </TestHarness>
      )
      
      expect(screen.getByTestId('autos-grid')).toBeInTheDocument()
      expect(screen.getByTestId('vehicle-1')).toBeInTheDocument()
    })

    it('should show load more button', () => {
      render(
        <TestHarness>
          <VehiclesList />
        </TestHarness>
      )
      
      expect(screen.getByTestId('load-more-btn')).toBeInTheDocument()
    })
  })

  describe('Integración básica', () => {
    it('should integrate all features correctly', () => {
      render(
        <TestHarness>
          <VehiclesList />
        </TestHarness>
      )
      
      // Verificar que todos los elementos estén presentes
      expect(screen.getByTestId('filter-form')).toBeInTheDocument()
      expect(screen.getByTestId('autos-grid')).toBeInTheDocument()
      expect(screen.getByTestId('load-more-btn')).toBeInTheDocument()
      expect(screen.getByText('Aplicar Filtros')).toBeInTheDocument()
      expect(screen.getByText('Toyota Corolla')).toBeInTheDocument()
    })
  })

  describe('Error boundaries', () => {
    it('should render error boundary wrapper', () => {
      render(
        <TestHarness>
          <VehiclesList />
        </TestHarness>
      )
      
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument()
    })
  })

  describe('Scroll to top', () => {
    it('should render scroll to top button', () => {
      render(
        <TestHarness>
          <VehiclesList />
        </TestHarness>
      )
      
      expect(screen.getByTestId('scroll-to-top')).toBeInTheDocument()
    })
  })
}) 