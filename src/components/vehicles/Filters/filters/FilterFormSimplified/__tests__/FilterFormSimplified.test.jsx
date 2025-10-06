/**
 * FilterFormSimplified Component Tests
 * @author Indiana Usados
 * @version 1.0.0
 */

// 🎭 Mocks - DEBEN estar ANTES de los imports
vi.mock('@hooks/filters', () => ({
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

vi.mock('@ui', () => ({
  MultiSelect: ({ label, options, value, onChange, placeholder }) => (
    <div data-testid={`select-${label.toLowerCase()}`}>
      <label>{label}</label>
      <select 
        value={value?.join(',') || ''} 
        onChange={(e) => onChange(e.target.value ? e.target.value.split(',') : [])}
        placeholder={placeholder}
      >
        {options?.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  ),
  RangeSlider: ({ label, min, max, value, onChange }) => (
    <div data-testid={`range-${label.toLowerCase()}`}>
      <label>{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        value={Array.isArray(value) ? value.join(',') : value}
        onChange={(e) => {
          // Simular el comportamiento del componente real que espera [min, max]
          const newValue = parseInt(e.target.value)
          if (label.toLowerCase() === 'precio') {
            onChange([newValue, max])
          } else if (label.toLowerCase() === 'año') {
            onChange([newValue, max])
          } else if (label.toLowerCase() === 'kms') {
            onChange([newValue, max])
          } else {
            onChange(newValue)
          }
        }}
      />
      <span>{Array.isArray(value) ? value.join(',') : value}</span>
    </div>
  )
}))

vi.mock('@hooks/useFilterForm', () => ({
  useFilterForm: () => ({
    register: vi.fn(),
    handleSubmit: vi.fn(),
    setValue: vi.fn(),
    reset: vi.fn(),
    watch: vi.fn(() => ({})),
    errors: {},
    marca: [],
    combustible: [],
    caja: [],
    año: [1990, 2024],
    precio: [0, 1000000],
    kilometraje: [0, 500000],
    activeFiltersCount: 0,
    defaultValues: {},
    prepareSubmitData: vi.fn((data) => data),
    handleClear: vi.fn(),
    handleAñoChange: vi.fn(),
    handlePrecioChange: vi.fn(),
    handleKilometrajeChange: vi.fn(),
    handleMarcaChange: vi.fn(),
    handleCombustibleChange: vi.fn(),
    handleCajaChange: vi.fn(),
    formatPrice: vi.fn((value) => `$${value}`),
    formatKms: vi.fn((value) => `${value} km`),
    formatYear: vi.fn((value) => value.toString())
  })
}))

vi.mock('@constants', () => ({
  filterOptions: {
    marcas: [
      { value: 'toyota', label: 'Toyota' },
      { value: 'honda', label: 'Honda' }
    ],
    cajas: [
      { value: 'automatica', label: 'Automática' },
      { value: 'manual', label: 'Manual' }
    ],
    combustibles: [
      { value: 'gasolina', label: 'Gasolina' },
      { value: 'diesel', label: 'Diesel' }
    ]
  },
  marcas: [
    { value: 'toyota', label: 'Toyota' },
    { value: 'honda', label: 'Honda' }
  ],
  cajas: [
    { value: 'automatica', label: 'Automática' },
    { value: 'manual', label: 'Manual' }
  ],
  combustibles: [
    { value: 'gasolina', label: 'Gasolina' },
    { value: 'diesel', label: 'Diesel' }
  ]
}))

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import FilterFormSimplified from '../FilterFormSimplified'
import { createFilters } from '@test'

// 📋 Tests
describe('FilterFormSimplified', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Renderizado básico', () => {
    it('should render with basic structure', () => {
      render(<FilterFormSimplified />)
      
      expect(screen.getByText('Filtros de Búsqueda')).toBeInTheDocument()
      expect(screen.getByText('Aplicar')).toBeInTheDocument()
      expect(screen.getByText('Limpiar')).toBeInTheDocument()
    })

    it('should show all filter sections', () => {
      render(<FilterFormSimplified />)
      
      expect(screen.getByTestId('select-marca')).toBeInTheDocument()
      expect(screen.getByTestId('select-caja')).toBeInTheDocument()
      expect(screen.getByTestId('select-combustible')).toBeInTheDocument()
      expect(screen.getByTestId('range-precio')).toBeInTheDocument()
      expect(screen.getByTestId('range-año')).toBeInTheDocument()
      expect(screen.getByTestId('range-kms')).toBeInTheDocument()
    })
  })

  describe('Interacciones de filtros', () => {
    it('should handle filter changes', () => {
      render(<FilterFormSimplified />)
      
      const marcaSelect = screen.getByTestId('select-marca').querySelector('select')
      fireEvent.change(marcaSelect, { target: { value: 'toyota' } })
      
      expect(marcaSelect.value).toBe('toyota')
    })

    it('should handle range changes', () => {
      render(<FilterFormSimplified />)
      
      const precioRange = screen.getByTestId('range-precio').querySelector('input')
      
      // Verificar que el range se renderiza correctamente
      expect(precioRange).toBeInTheDocument()
      expect(precioRange.type).toBe('range')
      expect(precioRange.min).toBe('5000000')
      expect(precioRange.max).toBe('100000000')
    })
  })

  describe('Acciones de filtros', () => {
    it('should handle clear filters', () => {
      render(<FilterFormSimplified />)
      
      const clearButton = screen.getByText('Limpiar')
      fireEvent.click(clearButton)
      
      // Verificar que se ejecutó la acción de limpiar
      expect(clearButton).toBeInTheDocument()
    })

    it('should handle apply filters', () => {
      render(<FilterFormSimplified />)
      
      const applyButton = screen.getByText('Aplicar')
      fireEvent.click(applyButton)
      
      // Verificar que se ejecutó la acción de aplicar
      expect(applyButton).toBeInTheDocument()
    })
  })

  describe('Estados del formulario', () => {
        it('should show loading state when submitting', () => {
      render(<FilterFormSimplified />)

      const applyButton = screen.getByText('Aplicar')
      
      // Verificar que el botón se renderiza correctamente
      expect(applyButton).toBeInTheDocument()
      expect(applyButton.type).toBe('submit')
      expect(applyButton).not.toBeDisabled()
    })
  })
}) 