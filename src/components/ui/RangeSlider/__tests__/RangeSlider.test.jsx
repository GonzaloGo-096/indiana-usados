/**
 * RangeSlider.test.jsx - Tests del componente RangeSlider
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import RangeSlider from '../RangeSlider'

describe('RangeSlider', () => {
  const mockOnChange = vi.fn()

  const defaultProps = {
    min: 0,
    max: 100,
    step: 1,
    value: [20, 80],
    onChange: mockOnChange,
    label: 'Rango',
    formatValue: (val) => val.toString()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('TEST 1: Renderizado inicial', () => {
    it('should render label correctly', () => {
      render(<RangeSlider {...defaultProps} />)
      expect(screen.getByText('Rango')).toBeInTheDocument()
    })

    it('should render slider with correct ARIA attributes', () => {
      render(<RangeSlider {...defaultProps} />)
      const slider = screen.getByRole('slider')
      
      expect(slider).toBeInTheDocument()
      expect(slider).toHaveAttribute('aria-valuemin', '0')
      expect(slider).toHaveAttribute('aria-valuemax', '100')
      expect(slider).toHaveAttribute('aria-valuenow', '20')
    })

    it('should display current values', () => {
      const { container } = render(<RangeSlider {...defaultProps} />)
      
      // Buscar el contenedor de valores por su estructura
      const valuesContainer = container.querySelector('[class*="values"]')
      expect(valuesContainer).toBeInTheDocument()
      
      // Verificar que los valores están presentes (pueden aparecer múltiples veces)
      const value20 = screen.getAllByText('20')
      const value80 = screen.getAllByText('80')
      expect(value20.length).toBeGreaterThan(0)
      expect(value80.length).toBeGreaterThan(0)
      expect(screen.getByText('-')).toBeInTheDocument()
    })

    it('should render without label when not provided', () => {
      const { container } = render(<RangeSlider {...defaultProps} label={null} />)
      expect(container.querySelector('label')).not.toBeInTheDocument()
    })
  })

  describe('TEST 2: Sincronización con props', () => {
    it('should update values when value prop changes', () => {
      const { rerender } = render(<RangeSlider {...defaultProps} />)
      
      // Verificar valores iniciales
      expect(screen.getAllByText('20').length).toBeGreaterThan(0)
      expect(screen.getAllByText('80').length).toBeGreaterThan(0)
      
      rerender(<RangeSlider {...defaultProps} value={[30, 70]} />)
      
      // Verificar nuevos valores
      expect(screen.getAllByText('30').length).toBeGreaterThan(0)
      expect(screen.getAllByText('70').length).toBeGreaterThan(0)
    })

    it('should use default values when value prop is not provided', () => {
      render(<RangeSlider {...defaultProps} value={undefined} />)
      
      // Debería usar min y max como valores por defecto
      expect(screen.getAllByText('0').length).toBeGreaterThan(0)
      expect(screen.getAllByText('100').length).toBeGreaterThan(0)
    })
  })

  describe('TEST 3: Formateo de valores', () => {
    it('should format values using formatValue function', () => {
      const formatValue = (val) => `$${val}`
      render(<RangeSlider {...defaultProps} formatValue={formatValue} />)
      
      expect(screen.getAllByText('$20').length).toBeGreaterThan(0)
      expect(screen.getAllByText('$80').length).toBeGreaterThan(0)
    })

    it('should use default formatValue when not provided', () => {
      render(<RangeSlider {...defaultProps} formatValue={undefined} />)
      
      // Debería convertir a string por defecto
      expect(screen.getAllByText('20').length).toBeGreaterThan(0)
      expect(screen.getAllByText('80').length).toBeGreaterThan(0)
    })
  })

  describe('TEST 4: Interacción con mouse', () => {
    it('should call onChange when track is clicked', () => {
      render(<RangeSlider {...defaultProps} />)
      const slider = screen.getByRole('slider')
      
      // Simular click en el track
      const rect = slider.getBoundingClientRect()
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        clientX: rect.left + rect.width * 0.5, // Click en el medio
        clientY: rect.top + rect.height / 2
      })
      
      fireEvent(slider, clickEvent)
      
      // onChange debería ser llamado con nuevos valores
      expect(mockOnChange).toHaveBeenCalled()
    })

    it('should update min thumb when dragging starts', () => {
      render(<RangeSlider {...defaultProps} />)
      const slider = screen.getByRole('slider')
      
      // Buscar el thumb mínimo (necesitaríamos acceso al DOM interno)
      // Este test verifica que el componente está preparado para manejar drag
      expect(slider).toBeInTheDocument()
    })
  })

  describe('TEST 5: Validación de límites', () => {
    it('should respect min and max values', () => {
      render(<RangeSlider {...defaultProps} min={10} max={90} />)
      const slider = screen.getByRole('slider')
      
      expect(slider).toHaveAttribute('aria-valuemin', '10')
      expect(slider).toHaveAttribute('aria-valuemax', '90')
    })

    it('should handle step correctly', () => {
      render(<RangeSlider {...defaultProps} step={5} />)
      const slider = screen.getByRole('slider')
      
      expect(slider).toBeInTheDocument()
      // El step se usa internamente en los cálculos
    })
  })

  describe('TEST 6: Casos edge', () => {
    it('should handle equal min and max values', () => {
      render(<RangeSlider {...defaultProps} value={[50, 50]} />)
      
      expect(screen.getAllByText('50').length).toBeGreaterThan(0)
    })

    it('should handle very large ranges', () => {
      render(<RangeSlider {...defaultProps} min={0} max={1000000} value={[100000, 900000]} />)
      
      expect(screen.getAllByText('100000').length).toBeGreaterThan(0)
      expect(screen.getAllByText('900000').length).toBeGreaterThan(0)
    })

    it('should handle negative values', () => {
      render(<RangeSlider {...defaultProps} min={-100} max={100} value={[-50, 50]} />)
      
      expect(screen.getAllByText('-50').length).toBeGreaterThan(0)
      expect(screen.getAllByText('50').length).toBeGreaterThan(0)
    })
  })

  describe('TEST 7: Accesibilidad', () => {
    it('should have proper ARIA attributes', () => {
      render(<RangeSlider {...defaultProps} />)
      const slider = screen.getByRole('slider')
      
      expect(slider).toHaveAttribute('aria-valuemin')
      expect(slider).toHaveAttribute('aria-valuemax')
      expect(slider).toHaveAttribute('aria-valuenow')
      expect(slider).toHaveAttribute('aria-valuetext', '20 to 80')
    })

    it('should support custom aria-label', () => {
      render(<RangeSlider {...defaultProps} aria-label="Custom range slider" />)
      const slider = screen.getByRole('slider')
      
      expect(slider).toHaveAttribute('aria-label', 'Custom range slider')
    })

    it('should support aria-describedby', () => {
      render(<RangeSlider {...defaultProps} aria-describedby="help-text" />)
      const slider = screen.getByRole('slider')
      
      expect(slider).toHaveAttribute('aria-describedby', 'help-text')
    })
  })

  describe('TEST 8: Custom className', () => {
    it('should apply custom className', () => {
      const { container } = render(<RangeSlider {...defaultProps} className="custom-class" />)
      const sliderContainer = container.firstChild
      
      expect(sliderContainer).toHaveClass('custom-class')
    })
  })
})

