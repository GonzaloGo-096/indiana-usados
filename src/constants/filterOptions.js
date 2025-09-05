/**
 * filterOptions.js - Opciones para filtros de vehículos
 * 
 * Constantes utilizadas en los filtros de búsqueda
 * 
 * @author Indiana Usados
 * @version 1.1.0 - Opciones duplicadas eliminadas
 */

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
    'Automático'
]

// Años disponibles
export const anios = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i)

// Rangos de precio
export const rangosPrecio = [
    { label: 'Hasta $500.000', value: 500000 },
    { label: '$500.000 - $1.000.000', value: 1000000 },
    { label: '$1.000.000 - $2.000.000', value: 2000000 },
    { label: '$2.000.000 - $5.000.000', value: 5000000 },
    { label: '$5.000.000 - $10.000.000', value: 10000000 },
    { label: 'Más de $10.000.000', value: 999999999 }
]

// Rangos de kilómetros
export const rangosKilometros = [
    { label: 'Hasta 50.000 km', value: 50000 },
    { label: '50.000 - 100.000 km', value: 100000 },
    { label: '100.000 - 150.000 km', value: 150000 },
    { label: '150.000 - 200.000 km', value: 200000 },
    { label: '200.000 - 300.000 km', value: 300000 },
    { label: 'Más de 300.000 km', value: 999999999 }
]
