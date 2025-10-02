/**
 * filterOptions.js - Opciones para filtros de vehículos
 * 
 * Constantes utilizadas en los filtros de búsqueda
 * 
 * @author Indiana Usados
 * @version 1.2.0 - Valores por defecto centralizados
 */

// ✅ NUEVO: Valores por defecto centralizados
export const FILTER_DEFAULTS = {
  AÑO: { min: 1990, max: 2024 },
  PRECIO: { min: 5000000, max: 100000000 },
  KILOMETRAJE: { min: 0, max: 200000 }
}

// Marcas de vehículos (sin duplicados)
export const marcas = [
    'Toyota',
    'Honda',
    'Ford',
    'Chevrolet',
    'Volkswagen',
    'Nissan',
    'Hyundai',
    'Kia',
    'Mazda',
    'Subaru',
    'Mitsubishi',
    'Suzuki',
    'Daihatsu',
    'Peugeot',
    'Renault',
    'Fiat',
    'Citroën',
    'Opel',
    'BMW',
    'Mercedes-Benz',
    'Audi',
    'Volvo',
    'Saab',
    'Jaguar',
    'Land Rover',
    'Mini',
    'Smart',
    'Alfa Romeo',
    'Lancia',
    'Seat',
    'Skoda',
    'Dacia',
    'Lada',
    'Tata',
    'Mahindra',
    'Chery',
    'Geely',
    'BYD',
    'Great Wall',
    'Haval',
    'Changan',
    'Dongfeng',
    'FAW',
    'BAIC',
    'GAC',
    'SAIC',
    'MG',
    'Roewe',
    'Wuling',
    'Baojun',
    'Hongqi',
    'NIO',
    'XPeng',
    'Li Auto',
    'Tesla',
    'Lucid',
    'Rivian',
    'Fisker',
    'Nikola',
    'Lordstown',
    'Canoo',
    'Arrival'
]

// Tipos de combustible (simplificados)
export const combustibles = [
    'Nafta',
    'Diesel',
    'Gas'
]

// Tipos de caja de cambios (simplificados)
export const cajas = [
    'Manual',
    'Automático',
    'Secuencial'
]

// Constantes eliminadas: anios, rangosPrecio, rangosKilometros (no usadas)
