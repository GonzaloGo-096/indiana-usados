/**
 * useCarMutation - Hook ultra-optimizado con React Query mutations
 * 
 * ✅ REFACTORIZADO v5.0.0: Versión ultra-optimizada
 * Lazy loading de funciones pesadas para mejor performance de build
 * Solo carga código cuando es necesario
 * 
 * @author Indiana Usados
 * @version 5.0.0 - Ultra-optimizado
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AUTH_CONFIG } from '@config/auth'
import vehiclesAdminService from '@services/admin/vehiclesAdminService'
import { logger } from '@utils/logger'

// ✅ HELPER: Obtener token de autorización
const getAuthToken = () => {
    try {
        const token = localStorage.getItem(AUTH_CONFIG.storage.tokenKey)
        return token
    } catch (error) {
        logger.error('cars:mutation', 'Error al obtener token', error)
        return null
    }
}

// ✅ HELPER: Manejo de errores unificado (no lanzar desde onError)
const handleMutationError = (error, operation) => {
    logger.error('cars:mutation', `Error al ${operation}`, { 
        message: error.message, 
        status: error.response?.status 
    })
    
    let errorMessage = `Error desconocido al ${operation}`
    
    if (error.message.includes('token de autorización')) {
        errorMessage = '❌ Error de autorización: No se encontró token válido'
    } else if (error.response?.status === 401) {
        errorMessage = '🔐 Error de autorización: Token inválido o expirado'
    } else if (error.response?.status === 403) {
        errorMessage = '🚫 Error de permisos: No tienes acceso a este recurso'
    } else if (error.response?.status === 404) {
        errorMessage = `❌ Vehículo no encontrado`
    } else if (error.response?.status === 400) {
        if (error.response.data?.message) {
            errorMessage = `❌ Error de validación: ${error.response.data.message}`
        } else if (error.response.data?.error) {
            errorMessage = `❌ Error del backend: ${error.response.data.error}`
        } else {
            errorMessage = '❌ Error 400: Datos enviados no son válidos'
        }
    } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
    } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error
    } else if (error.message) {
        errorMessage = error.message
    }
    
    return errorMessage
}

export const useCarMutation = () => {
    const queryClient = useQueryClient()
    
    // ✅ MUTATION: Crear vehículo (envía FormData tal cual)
    const createMutation = useMutation({
        mutationFn: async (formData) => {
            const token = getAuthToken()
            if (!token) {
                throw new Error('❌ No se encontró token de autorización')
            }
            if (!(formData instanceof FormData)) {
                throw new Error('Payload inválido: se esperaba FormData')
            }
            // Log de depuración en desarrollo
            if (import.meta?.env?.MODE !== 'production') {
                let fileCount = 0
                for (const [, value] of formData.entries()) {
                    if (value instanceof File) fileCount++
                }
                logger.debug('cars:mutation', 'create: enviando FormData', { fieldsApprox: [...formData.keys()].length, fileCount })
            }
            const response = await vehiclesAdminService.createVehicle(formData)
            return response.data
        },
        onSuccess: (data) => {
            logger.info('cars:mutation', 'Vehículo creado exitosamente')
            queryClient.invalidateQueries({ queryKey: ['vehicles'] })
        },
        onError: (error) => {
            const msg = handleMutationError(error, 'crear')
            logger.warn('cars:mutation', `onError create: ${msg}`)
        }
    })
    
    // ✅ MUTATION: Actualizar vehículo (envía FormData tal cual)
    const updateMutation = useMutation({
        mutationFn: async ({ id, formData }) => {
            const token = getAuthToken()
            if (!token) {
                throw new Error('❌ No se encontró token de autorización')
            }
            if (!(formData instanceof FormData)) {
                throw new Error('Payload inválido: se esperaba FormData')
            }
            if (import.meta?.env?.MODE !== 'production') {
                let fileCount = 0
                for (const [, value] of formData.entries()) {
                    if (value instanceof File) fileCount++
                }
                logger.debug('cars:mutation', 'update: enviando FormData', { id, fieldsApprox: [...formData.keys()].length, fileCount })
            }
            const response = await vehiclesAdminService.updateVehicle(id, formData)
            return response.data
        },
        onSuccess: (data, variables) => {
            logger.info('cars:mutation', 'Vehículo actualizado exitosamente', { id: variables.id })
            queryClient.invalidateQueries({ queryKey: ['vehicles'] })
            queryClient.invalidateQueries({ queryKey: ['vehicle', variables.id] })
        },
        onError: (error) => {
            const msg = handleMutationError(error, 'actualizar')
            logger.warn('cars:mutation', `onError update: ${msg}`)
        }
    })
    
    // ✅ MUTATION: Eliminar vehículo (sin cambios)
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const token = getAuthToken()
            if (!token) {
                throw new Error('❌ No se encontró token de autorización')
            }
            const response = await vehiclesAdminService.deleteVehicle(id)
            return response.data
        },
        onSuccess: (data, id) => {
            logger.info('cars:mutation', 'Vehículo eliminado exitosamente', { id })
            queryClient.invalidateQueries({ queryKey: ['vehicles'] })
            queryClient.removeQueries({ queryKey: ['vehicle', id] })
        },
        onError: (error) => {
            const msg = handleMutationError(error, 'eliminar')
            logger.warn('cars:mutation', `onError delete: ${msg}`)
        }
    })
    
    return {
        createMutation,
        updateMutation,
        deleteMutation
    }
}