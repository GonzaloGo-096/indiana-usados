/**
 * MultiSelect.test.jsx - Tests del componente MultiSelect
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import MultiSelect from '../MultiSelect'

describe('MultiSelect', () => {
  const mockOptions = ['Toyota', 'Honda', 'Ford', 'Chevrolet']
  const mockOnChange = vi.fn()

  const defaultProps = {
    options: mockOptions,
    value: [],
    onChange: mockOnChange,
    label: 'Marca',
    placeholder: 'Seleccionar marcas'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('TEST 1: Renderizado inicial', () => {
    it('should render label correctly', () => {
      render(<MultiSelect {...defaultProps} />)
      expect(screen.getByText('Marca')).toBeInTheDocument()
    })

    it('should render placeholder when no options selected', () => {
      render(<MultiSelect {...defaultProps} />)
      expect(screen.getByText('Seleccionar marcas')).toBeInTheDocument()
    })

    it('should render trigger button', () => {
      render(<MultiSelect {...defaultProps} />)
      const trigger = screen.getByRole('button', { name: /marca selector/i })
      expect(trigger).toBeInTheDocument()
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
    })

    it('should show required indicator when required', () => {
      render(<MultiSelect {...defaultProps} required />)
      const label = screen.getByText('Marca')
      expect(label.textContent).toContain('*')
    })
  })

  describe('TEST 2: Abrir y cerrar dropdown', () => {
    it('should open dropdown when trigger is clicked', async () => {
      render(<MultiSelect {...defaultProps} />)
      const trigger = screen.getByRole('button')
      
      fireEvent.click(trigger)
      
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument()
        expect(trigger).toHaveAttribute('aria-expanded', 'true')
      })
    })

    it('should close dropdown when clicking outside', async () => {
      render(
        <div>
          <div data-testid="outside">Outside</div>
          <MultiSelect {...defaultProps} />
        </div>
      )
      
      const trigger = screen.getByRole('button')
      fireEvent.click(trigger)
      
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument()
      })

      const outside = screen.getByTestId('outside')
      fireEvent.mouseDown(outside)
      
      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
      })
    })

    it('should close dropdown on Escape key', async () => {
      render(<MultiSelect {...defaultProps} />)
      const trigger = screen.getByRole('button')
      
      fireEvent.click(trigger)
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument()
      })

      fireEvent.keyDown(trigger, { key: 'Escape' })
      
      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
      })
    })
  })

  describe('TEST 3: Seleccionar opciones', () => {
    it('should select option when checkbox is clicked', async () => {
      render(<MultiSelect {...defaultProps} />)
      const trigger = screen.getByRole('button')
      
      fireEvent.click(trigger)
      
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument()
      })

      const toyotaCheckbox = screen.getByLabelText('Toyota')
      fireEvent.click(toyotaCheckbox)
      
      expect(mockOnChange).toHaveBeenCalledWith(['Toyota'])
    })

    it('should select multiple options', async () => {
      // Test simplificado: verificar que el componente maneja correctamente múltiples selecciones
      // cuando el valor se actualiza desde el padre
      const { rerender } = render(<MultiSelect {...defaultProps} value={[]} />)
      const trigger = screen.getByRole('button')
      
      fireEvent.click(trigger)
      
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument()
      })

      // Seleccionar primera opción
      fireEvent.click(screen.getByLabelText('Toyota'))
      
      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(['Toyota'])
      })

      // Simular que el padre actualizó el valor
      rerender(<MultiSelect {...defaultProps} value={['Toyota']} />)
      
      // Cerrar y abrir dropdown nuevamente
      fireEvent.click(trigger)
      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
      })
      
      fireEvent.click(trigger)
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument()
      })

      // Verificar que Toyota está seleccionado visualmente
      const toyotaCheckbox = screen.getByLabelText('Toyota')
      expect(toyotaCheckbox).toBeChecked()

      // Seleccionar segunda opción (ahora el componente tiene ['Toyota'] como valor)
      fireEvent.click(screen.getByLabelText('Honda'))
      
      await waitFor(() => {
        expect(mockOnChange).toHaveBeenLastCalledWith(['Toyota', 'Honda'])
      })
      
      expect(mockOnChange).toHaveBeenCalledTimes(2)
    })

    it('should deselect option when clicked again', async () => {
      render(<MultiSelect {...defaultProps} value={['Toyota']} />)
      const trigger = screen.getByRole('button')
      
      fireEvent.click(trigger)
      
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument()
      })

      const toyotaCheckbox = screen.getByLabelText('Toyota')
      expect(toyotaCheckbox).toBeChecked()
      
      fireEvent.click(toyotaCheckbox)
      
      expect(mockOnChange).toHaveBeenCalledWith([])
    })
  })

  describe('TEST 4: Navegación con teclado', () => {
    it('should open dropdown on Enter key', async () => {
      render(<MultiSelect {...defaultProps} />)
      const trigger = screen.getByRole('button')
      
      fireEvent.keyDown(trigger, { key: 'Enter' })
      
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument()
      })
    })

    it('should open dropdown on Space key', async () => {
      render(<MultiSelect {...defaultProps} />)
      const trigger = screen.getByRole('button')
      
      fireEvent.keyDown(trigger, { key: ' ' })
      
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument()
      })
    })

    it('should toggle option on Enter key in option', async () => {
      render(<MultiSelect {...defaultProps} />)
      const trigger = screen.getByRole('button')
      
      fireEvent.click(trigger)
      
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument()
      })

      const toyotaOption = screen.getByLabelText('Toyota').closest('label')
      fireEvent.keyDown(toyotaOption, { key: 'Enter' })
      
      expect(mockOnChange).toHaveBeenCalledWith(['Toyota'])
    })
  })

  describe('TEST 5: Estados disabled', () => {
    it('should disable trigger when disabled prop is true', () => {
      render(<MultiSelect {...defaultProps} disabled />)
      const trigger = screen.getByRole('button')
      
      expect(trigger).toBeDisabled()
      expect(trigger).toHaveAttribute('tabIndex', '-1')
    })

    it('should not open dropdown when disabled', async () => {
      render(<MultiSelect {...defaultProps} disabled />)
      const trigger = screen.getByRole('button')
      
      fireEvent.click(trigger)
      
      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
      })
    })

    it('should not call onChange when disabled option is clicked', async () => {
      render(<MultiSelect {...defaultProps} disabled />)
      const trigger = screen.getByRole('button')
      
      // Simular intento de abrir (no debería funcionar)
      fireEvent.click(trigger)
      
      expect(mockOnChange).not.toHaveBeenCalled()
    })
  })

  describe('TEST 6: Manejo de opciones vacías', () => {
    it('should show empty state when no options provided', async () => {
      render(<MultiSelect {...defaultProps} options={[]} />)
      const trigger = screen.getByRole('button')
      
      fireEvent.click(trigger)
      
      await waitFor(() => {
        expect(screen.getByText('No hay opciones disponibles')).toBeInTheDocument()
      })
    })

    it('should handle null options gracefully', async () => {
      render(<MultiSelect {...defaultProps} options={null} />)
      const trigger = screen.getByRole('button')
      
      fireEvent.click(trigger)
      
      await waitFor(() => {
        expect(screen.getByText('No hay opciones disponibles')).toBeInTheDocument()
      })
    })

    it('should filter out falsy values from options', async () => {
      render(<MultiSelect {...defaultProps} options={['Toyota', null, '', 'Honda', undefined]} />)
      const trigger = screen.getByRole('button')
      
      fireEvent.click(trigger)
      
      await waitFor(() => {
        expect(screen.getByLabelText('Toyota')).toBeInTheDocument()
        expect(screen.getByLabelText('Honda')).toBeInTheDocument()
        expect(screen.queryByLabelText('')).not.toBeInTheDocument()
      })
    })
  })

  describe('TEST 7: Manejo de errores', () => {
    it('should display error message when error prop is provided', () => {
      render(<MultiSelect {...defaultProps} error="Campo requerido" />)
      
      expect(screen.getByText('Campo requerido')).toBeInTheDocument()
    })

    it('should apply error styles to trigger', () => {
      render(<MultiSelect {...defaultProps} error="Error" />)
      const trigger = screen.getByRole('button')
      
      // Verificar que tiene la clase de error (a través de className)
      expect(trigger.className).toContain('error')
    })
  })

  describe('TEST 8: Accesibilidad', () => {
    it('should have proper ARIA attributes', () => {
      render(<MultiSelect {...defaultProps} />)
      const trigger = screen.getByRole('button')
      
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      expect(trigger).toHaveAttribute('aria-haspopup', 'listbox')
      expect(trigger).toHaveAttribute('aria-label', 'Marca selector')
    })

    it('should have proper ARIA attributes when open', async () => {
      render(<MultiSelect {...defaultProps} />)
      const trigger = screen.getByRole('button')
      
      fireEvent.click(trigger)
      
      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'true')
        const listbox = screen.getByRole('listbox')
        expect(listbox).toHaveAttribute('aria-multiselectable', 'true')
      })
    })

    it('should support custom aria-label', () => {
      render(<MultiSelect {...defaultProps} aria-label="Custom label" />)
      const trigger = screen.getByRole('button')
      
      expect(trigger).toHaveAttribute('aria-label', 'Custom label')
    })
  })
})

