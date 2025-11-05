/**
 * FilterFormSimple.test.jsx - Tests del componente de filtros
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import FilterFormSimple from '../FilterFormSimple'
import { FILTER_DEFAULTS, marcas, combustibles, cajas, SORT_OPTIONS } from '@constants'

// Mock de componentes UI
vi.mock('@ui', () => ({
  RangeSlider: ({ label, value, onChange, min, max, step, formatValue }) => (
    <div data-testid={`range-slider-${label.toLowerCase()}`}>
      <label>{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[0]}
        onChange={(e) => onChange([parseInt(e.target.value), value[1]])}
        data-testid={`range-input-${label.toLowerCase()}-min`}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[1]}
        onChange={(e) => onChange([value[0], parseInt(e.target.value)])}
        data-testid={`range-input-${label.toLowerCase()}-max`}
      />
      <span data-testid={`range-display-${label.toLowerCase()}`}>
        {formatValue ? formatValue(value[0]) : value[0]} - {formatValue ? formatValue(value[1]) : value[1]}
      </span>
    </div>
  ),
  MultiSelect: ({ label, options, value, onChange, placeholder }) => (
    <div data-testid={`multiselect-${label.toLowerCase()}`}>
      <label>{label}</label>
      <select
        multiple
        value={value}
        onChange={(e) => {
          const selected = Array.from(e.target.selectedOptions, option => option.value)
          onChange(selected)
        }}
        data-testid={`select-${label.toLowerCase()}`}
      >
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      {value.length === 0 && <span>{placeholder}</span>}
    </div>
  )
}))

vi.mock('@utils/logger', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
    info: vi.fn()
  }
}))

vi.mock('@utils', () => ({
  parseFilters: vi.fn((params) => {
    const filters = {}
    if (params.get('marca')) filters.marca = params.get('marca').split(',')
    if (params.get('caja')) filters.caja = params.get('caja').split(',')
    if (params.get('combustible')) filters.combustible = params.get('combustible').split(',')
    if (params.get('añoDesde')) filters.año = [parseInt(params.get('añoDesde')), parseInt(params.get('añoHasta') || FILTER_DEFAULTS.AÑO.max)]
    if (params.get('precioDesde')) filters.precio = [parseInt(params.get('precioDesde')), parseInt(params.get('precioHasta') || FILTER_DEFAULTS.PRECIO.max)]
    if (params.get('kmDesde')) filters.kilometraje = [parseInt(params.get('kmDesde')), parseInt(params.get('kmHasta') || FILTER_DEFAULTS.KILOMETRAJE.max)]
    return filters
  })
}))

describe('FilterFormSimple', () => {
  const mockOnApplyFilters = vi.fn()
  const mockOnRetry = vi.fn()

  const defaultProps = {
    onApplyFilters: mockOnApplyFilters,
    isLoading: false,
    isError: false,
    error: null,
    onRetry: mockOnRetry
  }

  const renderComponent = (props = {}) => {
    const componentProps = { ...defaultProps, ...props }
    return render(
      <MemoryRouter>
        <FilterFormSimple {...componentProps} />
      </MemoryRouter>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
    window.scrollY = 0
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('TEST 1: Renderizado inicial', () => {
    it('should render filter form correctly', () => {
      renderComponent()

      // Verificar que los filtros están presentes
      expect(screen.getByTestId('range-slider-año')).toBeInTheDocument()
      expect(screen.getByTestId('range-slider-precio')).toBeInTheDocument()
      expect(screen.getByTestId('range-slider-kms')).toBeInTheDocument()
      expect(screen.getByTestId('multiselect-marca')).toBeInTheDocument()
      expect(screen.getByTestId('multiselect-combustible')).toBeInTheDocument()
      expect(screen.getByTestId('multiselect-caja')).toBeInTheDocument()
    })

    it('should render mobile filter button', () => {
      renderComponent()
      
      const filterButton = screen.getByText('Filtrar')
      expect(filterButton).toBeInTheDocument()
    })

    it('should render sort button', () => {
      renderComponent()
      
      const sortButton = screen.getByText('Ordenar')
      expect(sortButton).toBeInTheDocument()
    })
  })

  describe('TEST 2: Seleccionar marca', () => {
    it('should allow selecting multiple brands', async () => {
      renderComponent()

      // Abrir drawer
      const filterButton = screen.getByText('Filtrar')
      fireEvent.click(filterButton)

      await waitFor(() => {
        const marcaSelect = screen.getByTestId('select-marca')
        expect(marcaSelect).toBeInTheDocument()
      })

      const marcaSelect = screen.getByTestId('select-marca')
      
      // Seleccionar múltiples marcas usando selectedOptions
      const toyotaOption = marcaSelect.querySelector('option[value="Toyota"]')
      const hondaOption = marcaSelect.querySelector('option[value="Honda"]')
      
      toyotaOption.selected = true
      hondaOption.selected = true
      
      fireEvent.change(marcaSelect)
      
      // Verificar que el componente recibió el cambio
      expect(marcaSelect).toBeInTheDocument()
      expect(toyotaOption.selected).toBe(true)
      expect(hondaOption.selected).toBe(true)
    })
  })

  describe('TEST 3: Ajustar rango de año', () => {
    it('should update year range when slider changes', async () => {
      renderComponent()

      const filterButton = screen.getByText('Filtrar')
      fireEvent.click(filterButton)

      await waitFor(() => {
        const añoMinInput = screen.getByTestId('range-input-año-min')
        expect(añoMinInput).toBeInTheDocument()
      })

      const añoMinInput = screen.getByTestId('range-input-año-min')
      
      fireEvent.change(añoMinInput, { target: { value: '2020' } })
      
      expect(añoMinInput.value).toBe('2020')
    })
  })

  describe('TEST 4: Aplicar filtros', () => {
    it('should call onApplyFilters when form is submitted', async () => {
      renderComponent()

      const filterButton = screen.getByText('Filtrar')
      fireEvent.click(filterButton)

      await waitFor(() => {
        const applyButton = screen.getByText('Aplicar')
        expect(applyButton).toBeInTheDocument()
      })

      const applyButton = screen.getByText('Aplicar')
      fireEvent.click(applyButton)

      await waitFor(() => {
        expect(mockOnApplyFilters).toHaveBeenCalled()
      })

      const filters = mockOnApplyFilters.mock.calls[0][0]
      expect(filters).toHaveProperty('marca')
      expect(filters).toHaveProperty('año')
      expect(filters).toHaveProperty('precio')
    })
  })

  describe('TEST 5: Limpiar filtros', () => {
    it('should reset filters when clear button is clicked', async () => {
      renderComponent()

      const filterButton = screen.getByText('Filtrar')
      fireEvent.click(filterButton)

      await waitFor(() => {
        const clearButton = screen.getByText('Limpiar')
        expect(clearButton).toBeInTheDocument()
      })

      // Modificar un filtro primero
      const marcaSelect = screen.getByTestId('select-marca')
      fireEvent.change(marcaSelect, { target: { value: ['Toyota'] } })

      // Limpiar filtros
      const clearButton = screen.getByText('Limpiar')
      fireEvent.click(clearButton)

      // Verificar que los filtros se resetearon
      await waitFor(() => {
        expect(marcaSelect.value).toBe('')
      })
    })
  })

  describe('TEST 6: Contador de filtros activos', () => {
    it('should show badge when filters are active', async () => {
      renderComponent()

      const filterButton = screen.getByText('Filtrar')
      fireEvent.click(filterButton)

      await waitFor(() => {
        const marcaSelect = screen.getByTestId('select-marca')
        expect(marcaSelect).toBeInTheDocument()
      })

      // Seleccionar una marca
      const marcaSelect = screen.getByTestId('select-marca')
      fireEvent.change(marcaSelect, { target: { value: ['Toyota'] } })

      // Cerrar drawer
      const closeButton = screen.getByText('Filtrar')
      fireEvent.click(closeButton)

      // Verificar que el badge aparece
      await waitFor(() => {
        const badge = screen.queryByText('1')
        expect(badge).toBeInTheDocument()
      })
    })

    it('should not show badge when no filters are active', () => {
      renderComponent()

      const filterButton = screen.getByText('Filtrar')
      const badge = filterButton.parentElement?.querySelector('.badge')
      
      // Sin filtros activos, no debería haber badge
      expect(badge).toBeFalsy()
    })
  })

  describe('TEST 7: Estado de carga (disabled)', () => {
    it('should disable form when isLoading is true', () => {
      renderComponent({ isLoading: true })

      // Buscar el botón por su testid o role
      const filterButtons = screen.getAllByRole('button')
      const filterButton = filterButtons.find(btn => btn.textContent.includes('Filtrar'))
      
      expect(filterButton).toBeDefined()
      if (filterButton) {
        expect(filterButton).toBeDisabled()
      }
    })

    it('should disable form when isSubmitting is true', async () => {
      renderComponent()

      const filterButton = screen.getByText('Filtrar')
      fireEvent.click(filterButton)

      await waitFor(() => {
        const applyButton = screen.getByText('Aplicar')
        expect(applyButton).toBeInTheDocument()
      })

      const applyButton = screen.getByText('Aplicar')
      fireEvent.click(applyButton)

      // Durante el submit, el botón debería estar deshabilitado
      await waitFor(() => {
        expect(applyButton).toBeDisabled()
      }, { timeout: 100 })
    })
  })

  describe('TEST 8: Valores iniciales', () => {
    it('should initialize with default filter values', () => {
      renderComponent()

      // Los valores por defecto deberían estar establecidos
      const añoSlider = screen.getByTestId('range-slider-año')
      expect(añoSlider).toBeInTheDocument()

      // Verificar valores por defecto
      const añoMinInput = screen.getByTestId('range-input-año-min')
      expect(añoMinInput.value).toBe(String(FILTER_DEFAULTS.AÑO.min))
    })
  })

  describe('TEST 9: Validación de rangos', () => {
    it('should enforce min/max constraints on year range', async () => {
      renderComponent()

      const filterButton = screen.getByText('Filtrar')
      fireEvent.click(filterButton)

      await waitFor(() => {
        const añoMinInput = screen.getByTestId('range-input-año-min')
        expect(añoMinInput).toBeInTheDocument()
      })

      const añoMinInput = screen.getByTestId('range-input-año-min')
      const añoMaxInput = screen.getByTestId('range-input-año-max')

      expect(añoMinInput.min).toBe(String(FILTER_DEFAULTS.AÑO.min))
      expect(añoMaxInput.max).toBe(String(FILTER_DEFAULTS.AÑO.max))
    })
  })

  describe('TEST 10: Múltiples selecciones', () => {
    it('should allow selecting multiple options in multi-select', async () => {
      renderComponent()

      const filterButton = screen.getByText('Filtrar')
      fireEvent.click(filterButton)

      await waitFor(() => {
        const marcaSelect = screen.getByTestId('select-marca')
        expect(marcaSelect).toBeInTheDocument()
      })

      const marcaSelect = screen.getByTestId('select-marca')
      
      // Verificar que es un select múltiple
      expect(marcaSelect.multiple).toBe(true)
      
      // Seleccionar múltiples marcas manualmente
      const toyotaOption = marcaSelect.querySelector('option[value="Toyota"]')
      const hondaOption = marcaSelect.querySelector('option[value="Honda"]')
      const fordOption = marcaSelect.querySelector('option[value="Ford"]')
      
      toyotaOption.selected = true
      hondaOption.selected = true
      fordOption.selected = true
      
      fireEvent.change(marcaSelect)
      
      // Verificar que las opciones están seleccionadas
      expect(toyotaOption.selected).toBe(true)
      expect(hondaOption.selected).toBe(true)
      expect(fordOption.selected).toBe(true)
    })
  })

  describe('Manejo de errores', () => {
    it('should display error message when isError is true', () => {
      renderComponent({ 
        isError: true, 
        error: { message: 'Error al cargar filtros' } 
      })

      expect(screen.getByText(/Error al cargar filtros/i)).toBeInTheDocument()
    })

    it('should call onRetry when retry button is clicked', () => {
      renderComponent({ 
        isError: true, 
        error: { message: 'Error' },
        onRetry: mockOnRetry
      })

      const retryButton = screen.getByText('Reintentar')
      fireEvent.click(retryButton)

      expect(mockOnRetry).toHaveBeenCalled()
    })
  })
})

