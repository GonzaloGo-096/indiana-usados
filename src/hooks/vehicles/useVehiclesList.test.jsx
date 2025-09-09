/**
 * Tests para el hook useVehiclesList
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock del módulo completo
vi.mock('../../services/vehiclesApi', () => ({
  getMainVehicles: vi.fn()
}));

vi.mock('../../api/vehicles.normalizer', () => ({
  normalizeVehiclesPage: vi.fn()
}));

vi.mock('../../mappers/vehicleMapper', () => ({
  mapListResponse: vi.fn()
}));

// Importar el hook después de los mocks
import { useVehiclesList } from './useVehiclesList';
import { getMainVehicles } from '@services/vehiclesApi';
import { normalizeVehiclesPage } from '@api/vehicles.normalizer';
import { mapListResponse } from '../../mappers/vehicleMapper';

describe('useVehiclesList', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  const createWrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('debe devolver array con longitud correcta cuando msw/mock responde con allPhotos.docs', async () => {
    // Arrange
    const mockRawResponse = {
      allPhotos: {
        docs: [
          { _id: '1', marca: 'Toyota', modelo: 'Corolla' },
          { _id: '2', marca: 'Honda', modelo: 'Civic' },
          { _id: '3', marca: 'Ford', modelo: 'Focus' }
        ],
        totalDocs: 150,
        hasNextPage: true,
        nextPage: 2
      }
    };

    const mockNormalizedPage = {
      items: mockRawResponse.allPhotos.docs,
      total: 150,
      hasNextPage: true,
      next: 2
    };

    const mockMappedResponse = {
      vehicles: [
        { id: '1', marca: 'Toyota', modelo: 'Corolla' },
        { id: '2', marca: 'Honda', modelo: 'Civic' },
        { id: '3', marca: 'Ford', modelo: 'Focus' }
      ],
      total: 150,
      hasNextPage: true,
      nextPage: 2
    };

    vi.mocked(getMainVehicles).mockResolvedValue(mockRawResponse);
    vi.mocked(normalizeVehiclesPage).mockReturnValue(mockNormalizedPage);
    vi.mocked(mapListResponse).mockReturnValue(mockMappedResponse);

    // Act
    const { result } = renderHook(() => useVehiclesList({}), {
      wrapper: createWrapper
    });

    // Assert
    await waitFor(() => {
      expect(result.current.vehicles).toHaveLength(3);
      expect(result.current.total).toBe(150);
      expect(result.current.hasNextPage).toBe(true);
      expect(result.current.loadMore).toBeDefined();
      expect(result.current.isLoadingMore).toBe(false);
    });
  });

  it('debe manejar getNextPageParam correctamente', async () => {
    // Arrange
    const mockRawResponse = {
      allPhotos: {
        docs: [{ _id: '1', marca: 'Toyota', modelo: 'Corolla' }],
        totalDocs: 50,
        hasNextPage: true,
        nextPage: 2
      }
    };

    const mockNormalizedPage = {
      items: mockRawResponse.allPhotos.docs,
      total: 50,
      hasNextPage: true,
      next: 2
    };

    const mockMappedResponse = {
      vehicles: [{ id: '1', marca: 'Toyota', modelo: 'Corolla' }],
      total: 50,
      hasNextPage: true,
      nextPage: 2
    };

    vi.mocked(getMainVehicles).mockResolvedValue(mockRawResponse);
    vi.mocked(normalizeVehiclesPage).mockReturnValue(mockNormalizedPage);
    vi.mocked(mapListResponse).mockReturnValue(mockMappedResponse);

    // Act
    const { result } = renderHook(() => useVehiclesList({}), {
      wrapper: createWrapper
    });

    // Assert
    await waitFor(() => {
      expect(result.current.hasNextPage).toBe(true);
      expect(result.current.loadMore).toBeDefined();
    });

    // Verificar que getNextPageParam funciona correctamente
    expect(vi.mocked(normalizeVehiclesPage)).toHaveBeenCalledWith(mockRawResponse);
  });

  it('debe manejar caso sin más páginas', async () => {
    // Arrange
    const mockRawResponse = {
      allPhotos: {
        docs: [{ _id: '1', marca: 'Toyota', modelo: 'Corolla' }],
        totalDocs: 1,
        hasNextPage: false,
        nextPage: null
      }
    };

    const mockNormalizedPage = {
      items: mockRawResponse.allPhotos.docs,
      total: 1,
      hasNextPage: false,
      next: null
    };

    const mockMappedResponse = {
      vehicles: [{ id: '1', marca: 'Toyota', modelo: 'Corolla' }],
      total: 1,
      hasNextPage: false,
      nextPage: null
    };

    vi.mocked(getMainVehicles).mockResolvedValue(mockRawResponse);
    vi.mocked(normalizeVehiclesPage).mockReturnValue(mockNormalizedPage);
    vi.mocked(mapListResponse).mockReturnValue(mockMappedResponse);

    // Act
    const { result } = renderHook(() => useVehiclesList({}), {
      wrapper: createWrapper
    });

    // Assert
    await waitFor(() => {
      expect(result.current.hasNextPage).toBe(false);
      expect(result.current.loadMore).toBeDefined();
    });
  });

  it('debe mantener la interfaz del return original', async () => {
    // Arrange
    const mockRawResponse = {
      allPhotos: {
        docs: [],
        totalDocs: 0,
        hasNextPage: false
      }
    };

    const mockNormalizedPage = {
      items: [],
      total: 0,
      hasNextPage: false,
      next: undefined
    };

    const mockMappedResponse = {
      vehicles: [],
      total: 0,
      hasNextPage: false,
      nextPage: null
    };

    vi.mocked(getMainVehicles).mockResolvedValue(mockRawResponse);
    vi.mocked(normalizeVehiclesPage).mockReturnValue(mockNormalizedPage);
    vi.mocked(mapListResponse).mockReturnValue(mockMappedResponse);

    // Act
    const { result } = renderHook(() => useVehiclesList({}), {
      wrapper: createWrapper
    });

    // Assert
    await waitFor(() => {
      // Campos originales
      expect(result.current.vehicles).toBeDefined();
      expect(result.current.total).toBeDefined();
      expect(result.current.hasNextPage).toBeDefined();
      expect(result.current.isLoading).toBeDefined();
      expect(result.current.isError).toBeDefined();
      expect(result.current.error).toBeDefined();
      expect(result.current.refetch).toBeDefined();
      
      // Campos nuevos
      expect(result.current.loadMore).toBeDefined();
      expect(result.current.isLoadingMore).toBeDefined();
    });
  });
});
