/**
 * Tests para el mapper de vehículos
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { describe, it, expect, vi } from 'vitest';

// Mock del módulo completo
vi.mock('./vehicleMapper', async () => {
  const actual = await vi.importActual('./vehicleMapper');
  
  // Mock de las funciones de mapeo
  const mockMapListVehicleToFrontend = vi.fn((vehicle) => ({
    id: vehicle._id,
    marca: vehicle.marca,
    modelo: vehicle.modelo,
    title: `${vehicle.marca} ${vehicle.modelo}`
  }));

  const mockMapApiVehicleToModel = vi.fn((vehicle) => ({
    id: vehicle.id,
    brand: vehicle.brand,
    model: vehicle.model,
    title: `${vehicle.brand} ${vehicle.model}`
  }));

  return {
    ...actual,
    mapListVehicleToFrontend: mockMapListVehicleToFrontend,
    mapApiVehicleToModel: mockMapApiVehicleToModel
  };
});

import { mapListResponse } from './vehicleMapper';

describe('mapListResponse', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe devolver shape correcto con allPhotos válido', () => {
    // Arrange
    const mockDocs = [
      { _id: '1', marca: 'Toyota', modelo: 'Corolla' },
      { _id: '2', marca: 'Honda', modelo: 'Civic' },
      { _id: '3', marca: 'Ford', modelo: 'Focus' }
    ];
    
    const apiResponse = {
      allPhotos: {
        docs: mockDocs,
        totalDocs: 150,
        hasNextPage: true,
        nextPage: 2
      }
    };
    
    // Act
    const result = mapListResponse(apiResponse);
    
    // Assert
    expect(result.vehicles.length).toBe(3);
    expect(result.total).toBe(150);
    expect(result.hasNextPage).toBe(true);
    expect(result.nextPage).toBe(2);
    expect(result.data.length).toBe(3); // Compatibilidad
    expect(result.totalItems).toBe(150); // Compatibilidad
    expect(result.currentCursor).toBeUndefined();
    expect(result.totalPages).toBe(13); // Math.ceil(150 / 12)
  });

  it('debe devolver valores seguros cuando falta allPhotos o docs', () => {
    // Arrange
    const apiResponse = {};
    
    // Act
    const result = mapListResponse(apiResponse);
    
    // Assert
    expect(result.vehicles.length).toBe(0);
    expect(result.total).toBe(0);
    expect(result.hasNextPage).toBe(false);
    expect(result.nextPage).toBe(null);
    expect(result.data.length).toBe(0); // Compatibilidad
    expect(result.totalItems).toBe(0); // Compatibilidad
    expect(result.currentCursor).toBeUndefined();
    expect(result.totalPages).toBe(0);
  });

  it('debe manejar caso con allPhotos pero sin docs', () => {
    // Arrange
    const apiResponse = {
      allPhotos: {
        totalDocs: 0,
        hasNextPage: false
      }
    };
    
    // Act
    const result = mapListResponse(apiResponse);
    
    // Assert
    expect(result.vehicles.length).toBe(0);
    expect(result.total).toBe(0);
    expect(result.hasNextPage).toBe(false);
    expect(result.nextPage).toBe(null);
  });

  it('debe manejar nextPage como string', () => {
    // Arrange
    const mockDocs = [{ _id: '1', marca: 'Toyota', modelo: 'Corolla' }];
    
    const apiResponse = {
      allPhotos: {
        docs: mockDocs,
        totalDocs: 50,
        hasNextPage: true,
        nextPage: 'cursor123'
      }
    };
    
    // Act
    const result = mapListResponse(apiResponse);
    
    // Assert
    expect(result.vehicles.length).toBe(1);
    expect(result.total).toBe(50);
    expect(result.hasNextPage).toBe(true);
    expect(result.nextPage).toBe(null); // Solo números se convierten a number
  });

  it('debe manejar nextPage como número', () => {
    // Arrange
    const mockDocs = [{ _id: '1', marca: 'Toyota', modelo: 'Corolla' }];
    
    const apiResponse = {
      allPhotos: {
        docs: mockDocs,
        totalDocs: 50,
        hasNextPage: true,
        nextPage: 5
      }
    };
    
    // Act
    const result = mapListResponse(apiResponse);
    
    // Assert
    expect(result.nextPage).toBe(5);
  });

  it('debe manejar caso límite: hasNextPage=false y nextPage=null', () => {
    // Arrange
    const mockDocs = [{ _id: '1', marca: 'Toyota', modelo: 'Corolla' }];
    
    const apiResponse = {
      allPhotos: {
        docs: mockDocs,
        totalDocs: 1,
        hasNextPage: false,
        nextPage: null
      }
    };
    
    // Act
    const result = mapListResponse(apiResponse);
    
    // Assert
    expect(result.hasNextPage).toBe(false);
    expect(result.nextPage).toBe(null);
  });

  it('debe mantener compatibilidad con campos legacy', () => {
    // Arrange
    const mockDocs = [{ _id: '1', marca: 'Toyota', modelo: 'Corolla' }];
    
    const apiResponse = {
      allPhotos: {
        docs: mockDocs,
        totalDocs: 1,
        hasNextPage: false
      }
    };
    
    // Act
    const result = mapListResponse(apiResponse);
    
    // Assert
    expect(result.data).toEqual(result.vehicles); // Compatibilidad
    expect(result.totalItems).toBe(result.total); // Compatibilidad
    expect(result.currentCursor).toBeUndefined();
    expect(result.totalPages).toBe(1);
  });

  it('debe manejar errores y devolver valores seguros', () => {
    // Arrange
    const apiResponse = null; // Esto debería causar un error
    
    // Act
    const result = mapListResponse(apiResponse);
    
    // Assert
    expect(result.data).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.hasNextPage).toBe(false);
    expect(result.nextPage).toBe(null);
    expect(result.totalPages).toBe(0);
  });
});
