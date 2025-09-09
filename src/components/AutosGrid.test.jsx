/**
 * Tests para el componente AutosGrid
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AutosGrid from './AutosGrid';

describe('AutosGrid', () => {
  const mockVehicles = [
    { id: '1', marca: 'Toyota', modelo: 'Corolla' },
    { id: '2', marca: 'Honda', modelo: 'Civic' },
    { id: '3', marca: 'Ford', modelo: 'Focus' }
  ];

  const renderWithRouter = (component) => {
    return render(
      <MemoryRouter>
        {component}
      </MemoryRouter>
    );
  };

  it('debe mostrar el botón "Cargar más" cuando hasNextPage es true', () => {
    // Arrange
    const mockOnLoadMore = vi.fn();
    
    // Act
    renderWithRouter(
      <AutosGrid
        vehicles={mockVehicles}
        isLoading={false}
        hasNextPage={true}
        isLoadingMore={false}
        onLoadMore={mockOnLoadMore}
        total={50}
      />
    );

    // Assert
    expect(screen.getByText('Cargar más')).toBeInTheDocument();
  });

  it('debe llamar onLoadMore cuando se hace click en "Cargar más"', () => {
    // Arrange
    const mockOnLoadMore = vi.fn();
    
    renderWithRouter(
      <AutosGrid
        vehicles={mockVehicles}
        isLoading={false}
        hasNextPage={true}
        isLoadingMore={false}
        onLoadMore={mockOnLoadMore}
        total={50}
      />
    );

    // Act
    fireEvent.click(screen.getByText('Cargar más'));

    // Assert
    expect(mockOnLoadMore).toHaveBeenCalledTimes(1);
  });

  it('debe mostrar "Cargando…" cuando isLoadingMore es true', () => {
    // Arrange
    const mockOnLoadMore = vi.fn();
    
    // Act
    renderWithRouter(
      <AutosGrid
        vehicles={mockVehicles}
        isLoading={false}
        hasNextPage={true}
        isLoadingMore={true}
        onLoadMore={mockOnLoadMore}
        total={50}
      />
    );

    // Assert
    expect(screen.getByText('Cargando…')).toBeInTheDocument();
  });

  it('debe mostrar mensaje de error y botón "Reintentar" cuando onLoadMore falla', async () => {
    // Arrange
    const mockOnLoadMore = vi.fn().mockRejectedValueOnce(new Error('Network error'));
    
    renderWithRouter(
      <AutosGrid
        vehicles={mockVehicles}
        isLoading={false}
        hasNextPage={true}
        isLoadingMore={false}
        onLoadMore={mockOnLoadMore}
        total={50}
      />
    );

    // Act
    fireEvent.click(screen.getByText('Cargar más'));

    // Assert
    await waitFor(() => {
      expect(screen.getByText('No pudimos cargar más.')).toBeInTheDocument();
      expect(screen.getByText('Reintentar')).toBeInTheDocument();
    });
  });

  it('debe llamar onLoadMore nuevamente cuando se hace click en "Reintentar"', async () => {
    // Arrange
    const mockOnLoadMore = vi.fn()
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(undefined);
    
    renderWithRouter(
      <AutosGrid
        vehicles={mockVehicles}
        isLoading={false}
        hasNextPage={true}
        isLoadingMore={false}
        onLoadMore={mockOnLoadMore}
        total={50}
      />
    );

    // Act - Primera llamada que falla
    fireEvent.click(screen.getByText('Cargar más'));
    
    await waitFor(() => {
      expect(screen.getByText('Reintentar')).toBeInTheDocument();
    });

    // Act - Segunda llamada (reintento)
    fireEvent.click(screen.getByText('Reintentar'));

    // Assert
    expect(mockOnLoadMore).toHaveBeenCalledTimes(2);
  });

  it('debe deshabilitar el botón "Reintentar" cuando isLoadingMore es true', () => {
    // Arrange
    const mockOnLoadMore = vi.fn();
    
    renderWithRouter(
      <AutosGrid
        vehicles={mockVehicles}
        isLoading={false}
        hasNextPage={true}
        isLoadingMore={true}
        onLoadMore={mockOnLoadMore}
        total={50}
      />
    );

    // Assert - El botón principal debe estar deshabilitado
    const loadMoreButton = screen.getByText('Cargando…');
    expect(loadMoreButton).toBeDisabled();
  });

  it('debe mostrar información de resultados correctamente', () => {
    // Arrange
    const mockOnLoadMore = vi.fn();
    
    // Act
    renderWithRouter(
      <AutosGrid
        vehicles={mockVehicles}
        isLoading={false}
        hasNextPage={true}
        isLoadingMore={false}
        onLoadMore={mockOnLoadMore}
        total={50}
      />
    );

    // Assert
    expect(screen.getByText('Mostrando 3 de 50 vehículos')).toBeInTheDocument();
  });

  it('debe mostrar mensaje cuando no hay vehículos', () => {
    // Arrange
    const mockOnLoadMore = vi.fn();
    
    // Act
    renderWithRouter(
      <AutosGrid
        vehicles={[]}
        isLoading={false}
        hasNextPage={false}
        isLoadingMore={false}
        onLoadMore={mockOnLoadMore}
        total={0}
      />
    );

    // Assert
    expect(screen.getByText('No se encontraron vehículos')).toBeInTheDocument();
    expect(screen.getByText('Intenta ajustar los filtros de búsqueda')).toBeInTheDocument();
  });

  it('debe mostrar loading cuando isLoading es true y no hay vehículos', () => {
    // Arrange
    const mockOnLoadMore = vi.fn();
    
    // Act
    renderWithRouter(
      <AutosGrid
        vehicles={[]}
        isLoading={true}
        hasNextPage={false}
        isLoadingMore={false}
        onLoadMore={mockOnLoadMore}
        total={0}
      />
    );

    // Assert
    expect(screen.getByText('Cargando vehículos...')).toBeInTheDocument();
  });
});
