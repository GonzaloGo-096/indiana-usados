/**
 * useVehicleData - Hook personalizado para manejar datos de vehículos
 * 
 * Responsabilidades:
 * - Normalizar datos del backend
 * - Manejar estados de carga y error
 * - Lógica centralizada para todos los componentes
 * 
 * @author Indiana Usados
 * @version 1.1.0 - Preserva campos de imagen originales
 */

import { useState, useEffect, useCallback } from 'react'
import { vehiclesApi } from '@services/vehiclesApi'

// ✅ CAMPOS SOPORTADOS PARA NORMALIZACIÓN
const VEHICLE_FIELDS = {
    id: ['_id', 'id'],
    marca: ['marca', 'brand'],
    modelo: ['modelo', 'model'],
    año: ['anio', 'año', 'year'],
    kms: ['kilometraje', 'kms', 'kilometers'],
    precio: ['precio', 'price']
}

// ✅ CAMPOS DE IMAGEN QUE DEBEN PRESERVARSE
const IMAGE_FIELDS = [
    'imagen',
    'fotoPrincipal',
    'image',
    'foto',
    'photo',
    'fotos',
    'photos'
]

/**
 * Hook para cargar y normalizar datos de vehículos
 * @param {Object} options - Opciones de configuración
 * @param {number} options.limit - Límite de vehículos
 * @param {boolean} options.enabled - Si debe ejecutarse
 * @returns {Object} Estado y funciones
 */
export const useVehicleData = ({ limit = 50, enabled = true } = {}) => {
    const [vehicles, setVehicles] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    // ✅ FUNCIÓN DE NORMALIZACIÓN CENTRALIZADA
    const normalizeVehicle = useCallback((item) => {
        const normalized = {}
        
        // ✅ NORMALIZAR CAMPOS PRINCIPALES
        Object.entries(VEHICLE_FIELDS).forEach(([key, possibleFields]) => {
            for (const field of possibleFields) {
                if (item[field] !== undefined) {
                    normalized[key] = item[field]
                    break
                }
            }
            // ✅ VALOR POR DEFECTO SI NO SE ENCUENTRA
            if (normalized[key] === undefined) {
                normalized[key] = key === 'id' ? null : key === 'precio' || key === 'kms' ? 0 : 'Sin datos'
            }
        })

        // ✅ PRESERVAR CAMPOS DE IMAGEN ORIGINALES
        IMAGE_FIELDS.forEach(field => {
            if (item[field] !== undefined) {
                normalized[field] = item[field]
            }
        })

        // ✅ PRESERVAR DATOS ORIGINALES COMPLETOS PARA DEBUG
        normalized._original = item

        return normalized
    }, [])

    // ✅ FUNCIÓN DE CARGA DE DATOS
    const loadVehicles = useCallback(async () => {
        if (!enabled) return

        try {
            setIsLoading(true)
            setError(null)

            const response = await vehiclesApi.getVehicles({ limit })
            
            // ✅ EXTRAER DATOS DEL BACKEND
            let vehiclesData = []
            if (response?.data) {
                vehiclesData = response.data
            } else if (response?.allPhotos?.docs) {
                vehiclesData = response.allPhotos.docs
            }

            // ✅ NORMALIZAR DATOS
            const normalizedVehicles = vehiclesData.map(normalizeVehicle)
            
            
            setVehicles(normalizedVehicles)

        } catch (error) {
            console.error('❌ Error cargando vehículos:', error)
            setError('Error al cargar vehículos del servidor')
            setVehicles([])
        } finally {
            setIsLoading(false)
        }
    }, [enabled, limit, normalizeVehicle])

    // ✅ CARGA AUTOMÁTICA AL MONTAR
    useEffect(() => {
        loadVehicles()
    }, [loadVehicles])

    return {
        vehicles,
        isLoading,
        error,
        refetch: loadVehicles
    }
}
