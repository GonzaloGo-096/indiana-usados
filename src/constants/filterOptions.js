/**
 * filterOptions.js - Constantes para opciones de filtros
 * 
 * Centraliza todas las opciones de filtros para facilitar mantenimiento
 * y reutilización en diferentes componentes
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

// Generar opciones de años (desde 2024 hasta 2010)
export const generateYearOptions = () => {
    const years = []
    for (let year = 2024; year >= 2010; year--) {
        years.push(year)
    }
    return years
}

// Opciones predefinidas para selects
export const FILTER_OPTIONS = {
    marcas: [
        'Toyota', 'Honda', 'Ford', 'Chevrolet', 'Volkswagen', 
        'Nissan', 'Hyundai', 'Kia', 'Mazda', 'Subaru'
    ],
    combustibles: ['Nafta', 'Diesel', 'Híbrido', 'Eléctrico'],
    transmisiones: ['Manual', 'Automático'],
    colores: [
        'Blanco', 'Negro', 'Gris', 'Plateado', 'Azul', 
        'Rojo', 'Verde', 'Amarillo', 'Naranja'
    ]
}

// Valores por defecto para el formulario
export const DEFAULT_FILTER_VALUES = {
    marca: '',
    añoDesde: '',
    añoHasta: '',
    precioDesde: '',
    precioHasta: '',
    combustible: '',
    transmision: '',
    kilometrajeDesde: '',
    kilometrajeHasta: '',
    color: ''
}

// Etiquetas legibles para los filtros
export const FILTER_LABELS = {
    marca: 'Marca',
    añoDesde: 'Año desde',
    añoHasta: 'Año hasta',
    precioDesde: 'Precio desde',
    precioHasta: 'Precio hasta',
    combustible: 'Combustible',
    transmision: 'Transmisión',
    kilometrajeDesde: 'KM desde',
    kilometrajeHasta: 'KM hasta',
    color: 'Color'
}

// Función para obtener etiqueta legible
export const getFilterLabel = (key) => {
    return FILTER_LABELS[key] || key
} 