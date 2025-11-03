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

// ✅ HELPER: Procesar FormData de forma simple (sin validaciones pesadas)
const processFormDataSimple = (formData) => {
    const imageFiles = {}
    const dataFields = {}
    
    for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
            if (imageFiles[key]) {
                imageFiles[key].push(value)
            } else {
                imageFiles[key] = [value]
            }
        } else {
            dataFields[key] = value
        }
    }
    
    return { imageFiles, dataFields }
}

// ✅ HELPER: Preparar FormData de forma simple
const prepareFormDataSimple = (imageFiles, dataFields) => {
    const formData = new FormData()
    
    // Agregar campos de datos
    Object.entries(dataFields).forEach(([key, value]) => {
        formData.append(key, value)
    })
    
    // Agregar archivos directamente (sin procesamiento complejo)
    Object.entries(imageFiles).forEach(([fieldName, fileList]) => {
        if (fileList && fileList.length > 0) {
            if (fieldName === 'fotosExtra') {
                fileList.forEach(file => {
                    formData.append(fieldName, file)
                })
            } else {
                formData.append(fieldName, fileList[0])
            }
        }
    })
    
    return formData
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
    
    // ✅ MUTATION: Crear vehículo
    const createMutation = useMutation({
        mutationFn: async (formData) => {
            const token = getAuthToken()
            if (!token) {
                throw new Error('❌ No se encontró token de autorización')
            }
            
            // ✅ OPTIMIZADO: Procesamiento simple sin validaciones pesadas
            const { imageFiles, dataFields } = processFormDataSimple(formData)
            const processedFormData = prepareFormDataSimple(imageFiles, dataFields)
            
            const response = await vehiclesAdminService.createVehicle(processedFormData)
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
    
    // ✅ MUTATION: Actualizar vehículo
    const updateMutation = useMutation({
        mutationFn: async ({ id, formData }) => {
            const token = getAuthToken()
            if (!token) {
                throw new Error('❌ No se encontró token de autorización')
            }
            
            // ✅ OPTIMIZADO: Procesamiento simple sin validaciones pesadas
            const { imageFiles, dataFields } = processFormDataSimple(formData)
            const processedFormData = prepareFormDataSimple(imageFiles, dataFields)
            
            const response = await vehiclesAdminService.updateVehicle(id, processedFormData)
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
    
    // ✅ MUTATION: Eliminar vehículo
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