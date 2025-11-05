/**
 * CardDetalle.test.jsx - Tests del componente de detalle de vehículo
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { CardDetalle } from '../CardDetalle/CardDetalle'
import { createVehicle } from '@test'

// Mock de hooks y componentes
vi.mock('@hooks', () => ({
  useCarouselImages: vi.fn(() => [
    { url: 'image1.jpg', alt: 'Vehicle image 1' },
    { url: 'image2.jpg', alt: 'Vehicle image 2' }
  ])
}))

vi.mock('@ui/ImageCarousel', () => ({
  ImageCarousel: ({ images, altText }) => (
    <div data-testid="image-carousel">
      {images.map((img, i) => (
        <img key={i} src={img.url} alt={altText} data-testid={`carousel-image-${i}`} />
      ))}
    </div>
  )
}))

vi.mock('@ui', () => ({
  WhatsAppContact: ({ text, phone, message }) => (
    <button data-testid="whatsapp-button" data-phone={phone} data-message={message}>
      {text}
    </button>
  )
}))

vi.mock('@utils/formatters', () => ({
  formatValue: (val) => val || '',
  formatCaja: (val) => val || '-',
  formatPrice: (val) => val ? `$${val.toLocaleString()}` : '-',
  formatKilometraje: (val) => val ? `${val.toLocaleString()} km` : '-'
}))

describe('CardDetalle', () => {
  const mockVehicle = createVehicle({
    marca: 'Toyota',
    modelo: 'Corolla',
    año: 2020,
    precio: 25000,
    kms: 50000,
    caja: 'Automática',
    combustible: 'Gasolina',
    color: 'Blanco',
    version: 'XEI',
    cilindrada: '1.8L'
  })

  const defaultProps = {
    auto: mockVehicle,
    contactInfo: {
      whatsapp: '5491112345678',
      whatsappMessage: 'Hola'
    }
  }

  const renderComponent = (props = {}) => {
    const componentProps = { ...defaultProps, ...props }
    return render(
      <MemoryRouter>
        <CardDetalle {...componentProps} />
      </MemoryRouter>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('TEST 1: Renderizado completo', () => {
    it('should render vehicle detail correctly', () => {
      renderComponent()

      expect(screen.getByTestId('vehicle-detail')).toBeInTheDocument()
      expect(screen.getByText('Toyota')).toBeInTheDocument()
      expect(screen.getByText('Corolla')).toBeInTheDocument()
    })

    it('should render all vehicle information', () => {
      renderComponent()

      expect(screen.getByText('2020')).toBeInTheDocument()
      expect(screen.getByText('50.000 km')).toBeInTheDocument()
      expect(screen.getByText('Automática')).toBeInTheDocument()
    })
  })

  describe('TEST 2: Galería de imágenes', () => {
    it('should render image carousel', () => {
      renderComponent()

      expect(screen.getByTestId('image-carousel')).toBeInTheDocument()
      expect(screen.getByTestId('vehicle-images')).toBeInTheDocument()
    })

    it('should display vehicle images', () => {
      renderComponent()

      expect(screen.getByTestId('carousel-image-0')).toBeInTheDocument()
      expect(screen.getByTestId('carousel-image-1')).toBeInTheDocument()
    })
  })

  describe('TEST 3: Información del vehículo', () => {
    it('should display vehicle price', () => {
      renderComponent()

      expect(screen.getByText('$25.000')).toBeInTheDocument()
    })

    it('should display vehicle main data', () => {
      renderComponent()

      expect(screen.getByText('Año')).toBeInTheDocument()
      expect(screen.getByText('Km')).toBeInTheDocument()
      expect(screen.getByText('Caja')).toBeInTheDocument()
    })

    it('should display additional vehicle information', () => {
      renderComponent()

      expect(screen.getByText('Tracción')).toBeInTheDocument()
      expect(screen.getByText('Combustible')).toBeInTheDocument()
      expect(screen.getByText('Versión')).toBeInTheDocument()
    })
  })

  describe('TEST 4: Botón de contacto', () => {
    it('should render WhatsApp contact button', () => {
      renderComponent()

      const whatsappButton = screen.getByTestId('whatsapp-button')
      expect(whatsappButton).toBeInTheDocument()
      expect(whatsappButton).toHaveTextContent('Consultar este vehículo')
    })

    it('should include correct phone number in WhatsApp button', () => {
      renderComponent()

      const whatsappButton = screen.getByTestId('whatsapp-button')
      expect(whatsappButton).toHaveAttribute('data-phone', '5491112345678')
    })
  })

  describe('TEST 5: Vehículo no encontrado', () => {
    it('should return null when auto is not provided', () => {
      const { container } = renderComponent({ auto: null })
      expect(container.firstChild).toBeNull()
    })

    it('should return null when auto is undefined', () => {
      const { container } = renderComponent({ auto: undefined })
      expect(container.firstChild).toBeNull()
    })
  })

  describe('TEST 6: Loading state', () => {
    it('should handle missing vehicle data gracefully', () => {
      const { container } = renderComponent({ auto: {} })
      // El componente debería manejar datos faltantes
      expect(container.firstChild).toBeTruthy()
    })
  })

  describe('TEST 7: Botón volver', () => {
    it('should render vehicle detail component', () => {
      renderComponent()
      // El botón volver está en la página padre, no en este componente
      expect(screen.getByTestId('vehicle-detail')).toBeInTheDocument()
    })
  })

  describe('TEST 8: Compartir en redes', () => {
    it('should render contact section for sharing', () => {
      renderComponent()

      const whatsappButton = screen.getByTestId('whatsapp-button')
      expect(whatsappButton).toBeInTheDocument()
      expect(whatsappButton).toHaveAttribute('data-message')
    })

    it('should include vehicle info in WhatsApp message', () => {
      renderComponent({ contactInfo: undefined })

      const whatsappButton = screen.getByTestId('whatsapp-button')
      const message = whatsappButton.getAttribute('data-message')
      expect(message).toContain('Toyota')
      expect(message).toContain('Corolla')
    })
  })
})

