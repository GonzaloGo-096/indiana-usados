/**
 * filterOptions.js - Opciones de filtros para vehículos
 * 
 * Características:
 * - Opciones basadas en datos reales
 * - Rangos de precios argentinos
 * - Años actualizados
 * - Categorías reales de vehículos
 * 
 * @author Indiana Usados
 * @version 2.0.0 - OPCIONES REALES
 */

// ✅ OPCIONES DE MARCAS (basadas en datos reales)
export const marcas = [
    'Toyota',
    'Honda', 
    'Ford',
    'BMW',
    'Mercedes-Benz',
    'Audi',
    'Volkswagen',
    'Chevrolet',
    'Nissan',
    'Hyundai',
    'Kia'
]

// ✅ OPCIONES DE AÑOS (últimos 10 años)
export const años = Array.from({length: 10}, (_, i) => new Date().getFullYear() - i)

// ✅ OPCIONES DE COLORES
export const colores = [
    'Blanco',
    'Negro', 
    'Rojo',
    'Azul',
    'Gris',
    'Plata'
]

// ✅ OPCIONES DE TRANSMISIÓN
export const transmisiones = [
    'Manual',
    'Automática'
]

// ✅ OPCIONES DE COMBUSTIBLE
export const combustibles = [
    'Gasolina',
    'Diésel',
    'Híbrido',
    'Eléctrico'
]

// ✅ OPCIONES DE CATEGORÍA DE VEHÍCULO
export const categoriasVehiculo = [
    'Base',
    'Intermedia',
    'Full',
    'Premium',
    'Deportivo'
]

// ✅ OPCIONES DE CATEGORÍA
export const categorias = [
    'Sedán',
    'Hatchback',
    'SUV',
    'Deportivo',
    'Pickup'
]

// ✅ RANGOS DE PRECIOS (en pesos argentinos)
export const rangosPrecio = [
    { label: 'Hasta $5.000.000', value: { min: 0, max: 5000000 } },
    { label: '$5.000.000 - $8.000.000', value: { min: 5000000, max: 8000000 } },
    { label: '$8.000.000 - $12.000.000', value: { min: 8000000, max: 12000000 } },
    { label: '$12.000.000 - $18.000.000', value: { min: 12000000, max: 18000000 } },
    { label: 'Más de $18.000.000', value: { min: 18000000, max: null } }
]

// ✅ RANGOS DE KILOMETRAJE
export const rangosKilometraje = [
    { label: 'Hasta 30.000 km', value: { min: 0, max: 30000 } },
    { label: '30.000 - 60.000 km', value: { min: 30000, max: 60000 } },
    { label: '60.000 - 100.000 km', value: { min: 60000, max: 100000 } },
    { label: '100.000 - 150.000 km', value: { min: 100000, max: 150000 } },
    { label: 'Más de 150.000 km', value: { min: 150000, max: null } }
]

// ✅ RANGOS DE AÑOS
export const rangosAño = [
    { label: '2020 - 2024', value: { min: 2020, max: 2024 } },
    { label: '2015 - 2019', value: { min: 2015, max: 2019 } },
    { label: '2010 - 2014', value: { min: 2010, max: 2014 } },
    { label: '2005 - 2009', value: { min: 2005, max: 2009 } },
    { label: 'Antes de 2005', value: { min: 1900, max: 2004 } }
]

// ✅ OPCIONES DE TAPIZADO
export const tapizados = [
    'Tela',
    'Semi Cuero',
    'Cuero',
    'Tela Deportiva',
    'Pana'
]

// ✅ OPCIONES DE TRACCIÓN
export const tracciones = [
    '4x2',
    '4x4',
    'AWD'
]

// ✅ OPCIONES DE CILINDRADA
export const cilindradas = [
    '1.0',
    '1.2',
    '1.4',
    '1.6',
    '1.8',
    '2.0',
    '2.5',
    '3.0',
    '4.0',
    '5.0'
]

// ✅ CONFIGURACIÓN DE FILTROS POR DEFECTO
export const defaultFilters = {
    marca: '',
    modelo: '',
    precioMin: '',
    precioMax: '',
    añoMin: '',
    añoMax: '',
    kilometrosMin: '',
    kilometrosMax: '',
    transmisión: '',
    combustible: '',
    color: '',
    categoria: '',
    categoriaVehiculo: '',
    tapizado: '',
    tracción: '',
    cilindrada: '',
    search: ''
}

// ✅ VALORES MÍNIMOS Y MÁXIMOS
export const filterRanges = {
    precio: {
        min: 0,
        max: 50000000,
        step: 100000
    },
    año: {
        min: 1900,
        max: new Date().getFullYear() + 1,
        step: 1
    },
    kilometros: {
        min: 0,
        max: 500000,
        step: 1000
    }
}

// ✅ ETIQUETAS DE FILTROS
export const filterLabels = {
    marca: 'Marca',
    modelo: 'Modelo',
    precioMin: 'Precio mínimo',
    precioMax: 'Precio máximo',
    añoMin: 'Año mínimo',
    añoMax: 'Año máximo',
    kilometrosMin: 'Kilometraje mínimo',
    kilometrosMax: 'Kilometraje máximo',
    transmisión: 'Transmisión',
    combustible: 'Combustible',
    color: 'Color',
    categoria: 'Categoría',
    categoriaVehiculo: 'Categoría de vehículo',
    tapizado: 'Tapizado',
    tracción: 'Tracción',
    cilindrada: 'Cilindrada',
    search: 'Búsqueda general'
}

// ✅ PLACEHOLDERS DE FILTROS
export const filterPlaceholders = {
    marca: 'Seleccionar marca',
    modelo: 'Buscar modelo',
    precioMin: 'Precio mínimo',
    precioMax: 'Precio máximo',
    añoMin: 'Año mínimo',
    añoMax: 'Año máximo',
    kilometrosMin: 'Km mínimo',
    kilometrosMax: 'Km máximo',
    transmisión: 'Seleccionar transmisión',
    combustible: 'Seleccionar combustible',
    color: 'Seleccionar color',
    categoria: 'Seleccionar categoría',
    categoriaVehiculo: 'Seleccionar categoría',
    tapizado: 'Seleccionar tapizado',
    tracción: 'Seleccionar tracción',
    cilindrada: 'Seleccionar cilindrada',
    search: 'Buscar vehículos...'
} 