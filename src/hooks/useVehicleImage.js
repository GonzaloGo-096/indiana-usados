/**
 * useVehicleImage - Hook personalizado para manejar imágenes de vehículos
 * 
 * Responsabilidades:
 * - Obtener URL de imagen de un vehículo
 * - Manejar fallbacks de imagen
 * - Lógica centralizada para todos los componentes
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { useMemo } from 'react'

// ✅ CONSTANTES CENTRALIZADAS
const FALLBACK_IMAGE = '/src/assets/auto1.jpg'

// ✅ CAMPOS DE IMAGEN SOPORTADOS (orden de prioridad)
const IMAGE_FIELDS = [
    'imagen',
    'fotoFrontal.url',
    'image',
    'foto',
    'photo'
]

/**
 * Hook para obtener la URL de imagen de un vehículo
 * @param {Object} vehicle - Objeto del vehículo
 * @returns {string} URL de la imagen
 */
export const useVehicleImage = (vehicle) => {
    const imageUrl = useMemo(() => {
        if (!vehicle) return FALLBACK_IMAGE

        // ✅ BUSCAR EN CAMPOS SOPORTADOS
        for (const field of IMAGE_FIELDS) {
            if (field.includes('.')) {
                // ✅ CAMPO ANIDADO (ej: fotoFrontal.url)
                const [parent, child] = field.split('.')
                if (vehicle[parent]?.[child]) {
                    return vehicle[parent][child]
                }
            } else {
                // ✅ CAMPO DIRECTO
                if (vehicle[field]) {
                    return vehicle[field]
                }
            }
        }

        return FALLBACK_IMAGE
    }, [vehicle])

    return imageUrl
}

/**
 * Función utilitaria para obtener imagen (sin hook)
 * @param {Object} vehicle - Objeto del vehículo
 * @returns {string} URL de la imagen
 */
export const getVehicleImageUrl = (vehicle) => {
    if (!vehicle) return FALLBACK_IMAGE

    for (const field of IMAGE_FIELDS) {
        if (field.includes('.')) {
            const [parent, child] = field.split('.')
            if (vehicle[parent]?.[child]) {
                return vehicle[parent][child]
            }
        } else {
            if (vehicle[field]) {
                return vehicle[field]
            }
        }
    }

    return FALLBACK_IMAGE
}
