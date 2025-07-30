/**
 * mockData.js - Datos mock para simular backend con filtros
 * 
 * Simula una API que maneja filtros correctamente
 * 
 * @author Indiana Usados
 * @version 2.1.0 - LIMPIEZA DE DUPLICADOS
 */

// Importar función de filtrado centralizada
import { filterVehicles } from '../utils/filterUtils'

// Datos mock de vehículos con múltiples imágenes
const mockVehicles = [
    {
        id: 1,
        marca: "Toyota",
        modelo: "Corolla",
        año: 2020,
        precio: 25000,
        combustible: "Gasolina",
        transmision: "Automática",
        kilometraje: 50000,
        color: "Blanco",
        categoria: "Sedán",
        caja: "Automática",
        detalle: "Vehículo en excelente estado, único dueño, mantenimiento al día",
        imagen: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 2,
        marca: "Toyota",
        modelo: "Camry",
        año: 2021,
        precio: 30000,
        combustible: "Gasolina",
        transmision: "Automática",
        kilometraje: 30000,
        color: "Negro",
        categoria: "Sedán",
        caja: "Automática",
        detalle: "Vehículo premium, equipamiento completo, garantía extendida",
        imagen: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 3,
        marca: "Honda",
        modelo: "Civic",
        año: 2019,
        precio: 22000,
        combustible: "Gasolina",
        transmision: "Manual",
        kilometraje: 70000,
        color: "Azul",
        categoria: "Sedán",
        caja: "Manual",
        detalle: "Vehículo deportivo, bien mantenido, ideal para ciudad",
        imagen: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 4,
        marca: "Honda",
        modelo: "Accord",
        año: 2020,
        precio: 28000,
        combustible: "Gasolina",
        transmision: "Automática",
        kilometraje: 45000,
        color: "Gris",
        categoria: "Sedán",
        caja: "Automática",
        detalle: "Vehículo familiar, espacioso y confortable",
        imagen: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 5,
        marca: "Ford",
        modelo: "Focus",
        año: 2018,
        precio: 18000,
        combustible: "Gasolina",
        transmision: "Manual",
        kilometraje: 80000,
        color: "Rojo",
        categoria: "Sedán",
        caja: "Manual",
        detalle: "Vehículo económico, ideal para ciudad",
        imagen: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 6,
        marca: "Ford",
        modelo: "Mustang",
        año: 2022,
        precio: 45000,
        combustible: "Gasolina",
        transmision: "Automática",
        kilometraje: 15000,
        color: "Negro",
        categoria: "Deportivo",
        caja: "Automática",
        detalle: "Vehículo deportivo de alto rendimiento",
        imagen: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 7,
        marca: "Chevrolet",
        modelo: "Cruze",
        año: 2021,
        precio: 26000,
        combustible: "Gasolina",
        transmision: "Automática",
        kilometraje: 35000,
        color: "Blanco",
        categoria: "Sedán",
        caja: "Automática",
        detalle: "Vehículo confortable y eficiente",
        imagen: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 8,
        marca: "Chevrolet",
        modelo: "Camaro",
        año: 2023,
        precio: 50000,
        combustible: "Gasolina",
        transmision: "Manual",
        kilometraje: 5000,
        color: "Amarillo",
        categoria: "Deportivo",
        caja: "Manual",
        detalle: "Vehículo deportivo legendario",
        imagen: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 9,
        marca: "Nissan",
        modelo: "Sentra",
        año: 2020,
        precio: 24000,
        combustible: "Gasolina",
        transmision: "Automática",
        kilometraje: 40000,
        color: "Gris",
        categoria: "Sedán",
        caja: "Automática",
        detalle: "Vehículo confiable y económico",
        imagen: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 10,
        marca: "Nissan",
        modelo: "Altima",
        año: 2022,
        precio: 32000,
        combustible: "Gasolina",
        transmision: "Automática",
        kilometraje: 20000,
        color: "Azul",
        categoria: "Sedán",
        caja: "Automática",
        detalle: "Vehículo premium con tecnología avanzada",
        imagen: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop"
        ]
    }
]

/**
 * Función para paginar resultados
 * @param {Array} vehicles - Array de vehículos
 * @param {number} page - Página actual
 * @param {number} limit - Elementos por página
 * @returns {Object} - Datos paginados
 */
const paginateVehicles = (vehicles, page = 1, limit = 6) => {
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedVehicles = vehicles.slice(startIndex, endIndex)
    
    return {
        items: paginatedVehicles,
        total: vehicles.length,
        currentPage: page,
        hasMore: endIndex < vehicles.length,
        nextPage: endIndex < vehicles.length ? page + 1 : undefined
    }
}

/**
 * Simula una petición HTTP con delay
 * @param {number} ms - Milisegundos de delay
 * @returns {Promise} - Promise que se resuelve después del delay
 */
const simulateNetworkDelay = (ms = 500) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export {
    mockVehicles,
    filterVehicles, // ✅ Ahora usa la función centralizada de filterUtils
    paginateVehicles,
    simulateNetworkDelay
} 