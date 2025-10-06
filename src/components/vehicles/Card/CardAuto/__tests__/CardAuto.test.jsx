/**
 * CardAuto Component Tests
 * @author Indiana Usados
 * @version 1.0.0
 */

// 🎭 Mocks - DEBEN estar ANTES de los imports
vi.mock('@ui', () => ({
  OptimizedImage: ({ src, alt, className }) => (
    <img src={src} alt={alt} className={className} data-testid="optimized-image" />
  )
}))

vi.mock('@utils/formatters', () => ({
  formatPrice: (price) => `$ ${price.toLocaleString()}`,
  formatKilometraje: (km) => km === 0 ? '-' : `${km.toLocaleString()} km`,
  formatYear: (year) => year?.toString() || '-',
  formatCaja: (caja) => caja || '-',
  formatBrandModel: (marca, modelo) => `${marca} ${modelo}`.trim()
}))

import React from 'react'
import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import CardAuto from '@components/vehicles/Card/CardAuto/CardAuto'
import { createVehicle } from '@test'

// 📋 Tests
describe('CardAuto', () => {
  const mockVehicle = createVehicle()

  // Helper para renderizar con Router
  const renderWithRouter = (component) => {
    return render(
      <MemoryRouter>
        {component}
      </MemoryRouter>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Renderizado básico', () => {
    it('should render vehicle information correctly', () => {
      render(
        <MemoryRouter>
          <CardAuto auto={mockVehicle} />
        </MemoryRouter>
      )
      
      expect(screen.getByText('Toyota')).toBeInTheDocument()
      expect(screen.getByText('Corolla')).toBeInTheDocument()
      expect(screen.getByText('$ 25.000')).toBeInTheDocument()
      expect(screen.getByText('50.000 km')).toBeInTheDocument()
      expect(screen.getByText('2020')).toBeInTheDocument()
    })

    it('should display vehicle image', () => {
      renderWithRouter(<CardAuto auto={mockVehicle} />)
      
      const image = screen.getByAltText('Toyota Corolla - 2020')
      expect(image).toBeInTheDocument()
      expect(image.src).toContain('/src/assets/auto1.jpg')
      expect(image.alt).toBe('Toyota Corolla - 2020')
    })
  })

  describe('Formateo de datos', () => {
    it('should format price correctly', () => {
      const expensiveVehicle = createVehicle({ precio: 100000 })
      renderWithRouter(<CardAuto auto={expensiveVehicle} />)
      
      expect(screen.getByText('$ 100.000')).toBeInTheDocument()
    })

    it('should handle zero kilometers', () => {
      const newVehicle = createVehicle({ kms: 0 })
      renderWithRouter(<CardAuto auto={newVehicle} />)
      
      expect(screen.getByText('-')).toBeInTheDocument()
    })

    it('should format large kilometer values', () => {
      const highMileageVehicle = createVehicle({ kms: 150000 })
      renderWithRouter(<CardAuto auto={highMileageVehicle} />)
      
      expect(screen.getByText('150.000 km')).toBeInTheDocument()
    })
  })

  describe('Información del vehículo', () => {
    it('should display transmission type', () => {
      renderWithRouter(<CardAuto auto={mockVehicle} />)
      
      expect(screen.getByText('Automática')).toBeInTheDocument()
    })

    // NOTA: CardAuto solo muestra año, km y caja
    // No muestra combustible, color ni estado
  })

  describe('Manejo de datos faltantes', () => {
    it('should handle missing vehicle data gracefully', () => {
      const incompleteVehicle = {
        id: 1,
        marca: 'Toyota',
        modelo: 'Corolla',
        precio: 25000,
        kms: 50000,
        año: 2020,
        caja: 'Automática'
        // Sin otros campos opcionales
      }
      
      renderWithRouter(<CardAuto auto={incompleteVehicle} />)
      
      expect(screen.getByText('Toyota')).toBeInTheDocument()
      expect(screen.getByText('Corolla')).toBeInTheDocument()
      expect(screen.getByText('$ 25.000')).toBeInTheDocument()
      expect(screen.getByText('50.000 km')).toBeInTheDocument()
    })
  })
}) 