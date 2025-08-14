/**
 * Vehicle Factory - Genera datos de prueba consistentes para tests
 * @author Indiana Usados
 * @version 1.0.0
 */

// 🚗 Factory para vehículos individuales
export const createVehicle = (overrides = {}) => ({
  id: 1,
  marca: 'Toyota',
  modelo: 'Corolla',
  año: 2020,
  precio: 25000,
  kms: 50000,
  caja: 'Automática',
  combustible: 'Gasolina',
  color: 'Blanco',
  estado: 'Usado',
  descripcion: 'Excelente estado, único dueño',
  imagenes: [
    'auto-prueba-principal.webp',
    'auto-pueba-2.webp',
    'auto-prueba-3.webp'
  ],
  ...overrides
})

// 📋 Factory para lista de vehículos
export const createVehicleList = (count = 5, overrides = {}) => {
  return Array.from({ length: count }, (_, index) => 
    createVehicle({
      id: index + 1,
      marca: `Marca ${index + 1}`,
      modelo: `Modelo ${index + 1}`,
      ...overrides
    })
  )
}

// 📄 Factory para respuesta paginada
export const createPaginatedResponse = (vehicles = [], overrides = {}) => ({
  data: vehicles,
  pagination: {
    currentPage: 1,
    totalPages: 5,
    totalItems: 100,
    itemsPerPage: 20,
    hasNextPage: true,
    hasPreviousPage: false
  },
  ...overrides
})

// 🔍 Factory para filtros
export const createFilters = (overrides = {}) => ({
  marca: [],
  caja: [],
  combustible: [],
  precioMin: 0,
  precioMax: 100000,
  añoMin: 1990,
  añoMax: 2024,
  kilometrajeMin: 0,
  kilometrajeMax: 200000,
  ...overrides
})

// 📊 Factory para estados de API
export const createApiState = (overrides = {}) => ({
  isLoading: false,
  isError: false,
  error: null,
  data: null,
  ...overrides
})

// 🎯 Factory para hooks de filtros
export const createFilterHookState = (overrides = {}) => ({
  filters: createFilters(),
  dispatch: vi.fn(),
  isSubmitting: false,
  setSubmitting: vi.fn(),
  isDrawerOpen: false,
  toggleDrawer: vi.fn(),
  closeDrawer: vi.fn(),
  ...overrides
}) 