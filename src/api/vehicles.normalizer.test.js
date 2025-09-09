/**
 * Tests para el normalizador de vehículos
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { describe, it, expect } from 'vitest';
import { normalizeVehiclesPage } from './vehicles.normalizer';

describe('normalizeVehiclesPage', () => {
  it('debe manejar caso vacío: raw = {}', () => {
    // Arrange
    const raw = {};
    
    // Act
    const result = normalizeVehiclesPage(raw);
    
    // Assert
    expect(result).toEqual({
      items: [],
      total: 0,
      hasNextPage: false
    });
  });

  it('debe manejar caso con datos válidos', () => {
    // Arrange
    const mockDocs = [
      { _id: '1', marca: 'Toyota', modelo: 'Corolla' },
      { _id: '2', marca: 'Honda', modelo: 'Civic' },
      { _id: '3', marca: 'Ford', modelo: 'Focus' }
    ];
    
    const raw = {
      allPhotos: {
        docs: mockDocs,
        totalDocs: 150,
        hasNextPage: true,
        nextPage: 2
      }
    };
    
    // Act
    const result = normalizeVehiclesPage(raw);
    
    // Assert
    expect(result).toEqual({
      items: mockDocs,
      total: 150,
      hasNextPage: true,
      next: 2
    });
  });

  it('debe manejar caso límite: hasNextPage=false y nextPage=null', () => {
    // Arrange
    const mockDocs = [
      { _id: '1', marca: 'Toyota', modelo: 'Corolla' }
    ];
    
    const raw = {
      allPhotos: {
        docs: mockDocs,
        totalDocs: 1,
        hasNextPage: false,
        nextPage: null
      }
    };
    
    // Act
    const result = normalizeVehiclesPage(raw);
    
    // Assert
    expect(result).toEqual({
      items: mockDocs,
      total: 1,
      hasNextPage: false,
      next: undefined
    });
  });

  it('debe manejar caso sin allPhotos', () => {
    // Arrange
    const raw = {
      data: [{ id: '1', marca: 'Toyota' }],
      total: 1
    };
    
    // Act
    const result = normalizeVehiclesPage(raw);
    
    // Assert
    expect(result).toEqual({
      items: [],
      total: 0,
      hasNextPage: false
    });
  });

  it('debe manejar caso con allPhotos pero sin docs', () => {
    // Arrange
    const raw = {
      allPhotos: {
        totalDocs: 0,
        hasNextPage: false
      }
    };
    
    // Act
    const result = normalizeVehiclesPage(raw);
    
    // Assert
    expect(result).toEqual({
      items: [],
      total: 0,
      hasNextPage: false
    });
  });

  it('debe manejar caso con valores undefined en allPhotos', () => {
    // Arrange
    const raw = {
      allPhotos: {
        docs: undefined,
        totalDocs: undefined,
        hasNextPage: undefined,
        nextPage: undefined
      }
    };
    
    // Act
    const result = normalizeVehiclesPage(raw);
    
    // Assert
    expect(result).toEqual({
      items: [],
      total: 0,
      hasNextPage: false,
      next: undefined
    });
  });

  it('debe manejar caso con nextPage como string', () => {
    // Arrange
    const mockDocs = [{ _id: '1', marca: 'Toyota' }];
    
    const raw = {
      allPhotos: {
        docs: mockDocs,
        totalDocs: 50,
        hasNextPage: true,
        nextPage: 'cursor123'
      }
    };
    
    // Act
    const result = normalizeVehiclesPage(raw);
    
    // Assert
    expect(result).toEqual({
      items: mockDocs,
      total: 50,
      hasNextPage: true,
      next: 'cursor123'
    });
  });

  it('debe mantener la estructura correcta del objeto', () => {
    // Arrange
    const raw = {
      allPhotos: {
        docs: [{ _id: '1' }],
        totalDocs: 1,
        hasNextPage: false
      }
    };
    
    // Act
    const result = normalizeVehiclesPage(raw);
    
    // Assert
    expect(Array.isArray(result.items)).toBe(true);
    expect(typeof result.total).toBe('number');
    expect(typeof result.hasNextPage).toBe('boolean');
    expect(result.next).toBeUndefined();
  });
});
