/**
 * useCarMutation.js - Hook simple para mutación de autos
 * 
 * @author Indiana Usados
 * @version 2.0.0 - Agregado updateCar para modo EDIT
 */

import { useState } from 'react'
import { AUTH_CONFIG } from '@config/auth'
import { validateImageFields, prepareMultipleImagesForUpload } from '@utils/imageUtils'
import { vehiclesService } from '@services/vehiclesApi'
import { logger } from '@utils/logger'

// ✅ FUNCIÓN SIMPLE PARA OBTENER TOKEN
const getAuthToken = () => {
    try {
        // ✅ USAR LA MISMA CLAVE QUE useAuth
        const token = localStorage.getItem(AUTH_CONFIG.storage.tokenKey)
        return token
    } catch (error) {
        logger.error('cars:mutation', 'Error al obtener token', error)
        return null
    }
}

export const useCarMutation = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const createCar = async (formData) => {
        setIsLoading(true)
        setError(null)
        setSuccess(false)

        try {
            // Info mínima, sin dumps
            
            // ✅ EXTRAER ARCHIVOS DE IMAGEN DEL FORMDATA
            const imageFiles = {}
            const dataFields = {}
            
            for (let [key, value] of formData.entries()) {
                if (value instanceof File) {
                    // ✅ MANEJAR MÚLTIPLES ARCHIVOS CON EL MISMO NOMBRE
                    if (imageFiles[key]) {
                        imageFiles[key].push(value)
                    } else {
                        imageFiles[key] = [value]
                    }
                } else {
                    dataFields[key] = value
                }
            }
            
            // ✅ LOG RESUMIDO (solo conteo) en debug
            if (import.meta.env.DEV) {
                const summary = Object.keys(imageFiles).map(key => `${key}:${imageFiles[key].length}`).join(', ')
                logger.debug('cars:mutation', 'Archivos extraídos', summary)
            }
            
            // ✅ VALIDAR ARCHIVOS DE IMAGEN (solo formato, no cantidad en modo edit)
            const imageErrors = validateImageFields(imageFiles, 'create')
            
            if (Object.keys(imageErrors).length > 0) {
                throw new Error(`Errores de imagen: ${Object.values(imageErrors).join(', ')}`)
            }
            
            // ✅ PREPARAR ARCHIVOS PARA ENVÍO
            const preparedImages = prepareMultipleImagesForUpload(imageFiles)
            
            // ✅ CREAR FORMDATA SIMPLE (NO necesitamos preparar archivos)
            const cloudinaryFormData = new FormData()
            
            // Agregar campos de datos
            Object.entries(dataFields).forEach(([key, value]) => {
                cloudinaryFormData.append(key, value)
            })
            
            // ✅ AGREGAR ARCHIVOS PREPARADOS CON NOMBRES DE CAMPO CORRECTOS
            const filesAdded = []
            Object.entries(preparedImages).forEach(([fieldName, fileList]) => {
                if (fileList && fileList.length > 0) {
                    if (fieldName === 'fotosExtra') {
                        // ✅ FOTOS EXTRAS: Enviar todos los archivos
                        fileList.forEach(file => {
                            cloudinaryFormData.append(fieldName, file)
                        })
                        filesAdded.push(`${fieldName}: ${fileList.length} archivos`)
                    } else {
                        // ✅ FOTOS PRINCIPALES: Solo el primer archivo
                        cloudinaryFormData.append(fieldName, fileList[0])
                        filesAdded.push(`${fieldName}: ${fileList[0].name}`)
                    }
                }
            })
            
            
            // ✅ OBTENER TOKEN DE AUTORIZACIÓN PRIMERO
            const token = getAuthToken()
            
            if (!token) {
                throw new Error('❌ No se encontró token de autorización')
            }
            
            // ✅ ENVÍO AL BACKEND usando servicio unificado
            const response = await vehiclesService.createVehicle(cloudinaryFormData)
            setSuccess(true)
            return { success: true, data: response.data }

        } catch (err) {
            logger.error('cars:mutation', 'Error al crear auto', { message: err.message, status: err.response?.status })
            
            // ✅ LOGGING DETALLADO DEL ERROR
            // No volcar data/headers completos en logs
            
            // ✅ MENSAJES DE ERROR ESPECÍFICOS
            let errorMessage = 'Error desconocido al crear el auto'
            
            if (err.message.includes('token de autorización')) {
                errorMessage = '❌ Error de autorización: No se encontró token válido'
            } else if (err.response?.status === 401) {
                errorMessage = '🔐 Error de autorización: Token inválido o expirado'
            } else if (err.response?.status === 403) {
                errorMessage = '🚫 Error de permisos: No tienes acceso a este recurso'
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message
            } else if (err.response?.data?.error) {
                errorMessage = err.response.data.error
            } else if (err.message) {
                errorMessage = err.message
            }
            
            setError(errorMessage)
            return { success: false, error: errorMessage }
        } finally {
            setIsLoading(false)
        }
    }

    // ✅ NUEVA FUNCIÓN: updateCar para modo EDIT - USANDO MISMA ESTRUCTURA QUE CREATE
    const updateCar = async (id, formData) => {
        setIsLoading(true)
        setError(null)
        setSuccess(false)

        try {
            console.log('🔄 Enviando actualización al endpoint...', { id })
            
            // ✅ OBTENER TOKEN DE AUTORIZACIÓN
            const token = getAuthToken()
            if (!token) {
                throw new Error('❌ No se encontró token de autorización')
            }
            
            // ✅ DEBUG: LOGGING DEL FORMDATA PARA EDIT
            // Evitar dumps de FormData en consola
            
            // ✅ VALIDAR ARCHIVOS DE IMAGEN SI EXISTEN (modo edit - solo formato)
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
            
            // ✅ VALIDAR SOLO FORMATO DE ARCHIVOS (no cantidad en modo edit)
            if (Object.keys(imageFiles).length > 0) {
                const imageErrors = validateImageFields(imageFiles, 'edit')
                if (Object.keys(imageErrors).length > 0) {
                    throw new Error(`Errores de imagen: ${Object.values(imageErrors).join(', ')}`)
                }
            }
            
            // ✅ DEBUG: Logging del FormData antes del envío
            // Evitar dumps de headers/token
            
            // ✅ DEBUG: Verificar si fotos Extra está presente
            const hasFotosExtra = Array.from(formData.entries()).some(([key]) => key === 'fotosExtra')
            if (import.meta.env.DEV) logger.debug('cars:mutation', '¿Incluye fotosExtra?', hasFotosExtra)
            
            // ✅ LOGGING DETALLADO DE CADA CAMPO
            console.log('🔍 ===== FORMDATA COMPLETO ENVIADO AL BACKEND =====')
            for (let [key, value] of formData.entries()) {
                if (value instanceof File) {
                    console.log(`📁 ${key}:`, {
                        name: value.name,
                        size: value.size,
                        type: value.type,
                        lastModified: value.lastModified
                    })
                } else {
                    console.log(`📝 ${key}:`, value)
                }
            }
            console.log('🔍 ===== FIN FORMDATA =====')
            
            // ✅ USAR ENDPOINT CORRECTO: PUT /photos/updatephoto/:id
            const response = await vehiclesService.updateVehicle(id, formData)

            if (import.meta.env.DEV) logger.debug('cars:mutation', 'Respuesta de actualización OK')
            setSuccess(true)
            return { success: true, data: response.data }

        } catch (err) {
            logger.error('cars:mutation', 'Error al actualizar auto', { message: err.message, status: err.response?.status })
            
            // ✅ DEBUG EXTENDIDO: Logging detallado del error
            // No volcar detalles completos del backend
            
            let errorMessage = 'Error desconocido al actualizar el auto'
            
            if (err.response?.status === 401) {
                errorMessage = '🔐 Error de autorización: Token inválido o expirado'
            } else if (err.response?.status === 403) {
                errorMessage = '🚫 Error de permisos: No tienes acceso a este recurso'
            } else if (err.response?.status === 404) {
                errorMessage = '❌ Vehículo no encontrado o endpoint incorrecto'
            } else if (err.response?.status === 400) {
                // ✅ MENSAJE ESPECÍFICO PARA ERROR 400
                if (err.response.data?.message) {
                    errorMessage = `❌ Error de validación: ${err.response.data.message}`
                } else if (err.response.data?.error) {
                    errorMessage = `❌ Error del backend: ${err.response.data.error}`
                } else if (err.response.data?.msg) {
                    errorMessage = `❌ Error: ${err.response.data.msg}`
                } else {
                    errorMessage = '❌ Error 400: Datos enviados no son válidos para el backend'
                }
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message
            } else if (err.message) {
                errorMessage = err.message
            }
            
            setError(errorMessage)
            return { success: false, error: errorMessage }
        } finally {
            setIsLoading(false)
        }
    }

    // ✅ NUEVA FUNCIÓN: deleteCar para eliminar vehículos
    const deleteCar = async (id) => {
        setIsLoading(true)
        setError(null)
        setSuccess(false)

        try {
            
            // ✅ OBTENER TOKEN DE AUTORIZACIÓN
            const token = getAuthToken()
            if (!token) {
                throw new Error('❌ No se encontró token de autorización')
            }
            
            // ✅ ENVIAR ELIMINACIÓN usando servicio unificado
            const response = await vehiclesService.deleteVehicle(id)

            if (import.meta.env.DEV) logger.debug('cars:mutation', 'Respuesta de eliminación OK')
            setSuccess(true)
            return { success: true, data: response.data }

        } catch (err) {
            logger.error('cars:mutation', 'Error al eliminar auto', { message: err.message, status: err.response?.status })
            
            let errorMessage = 'Error desconocido al eliminar el auto'
            
            if (err.response?.status === 401) {
                errorMessage = '🔐 Error de autorización: Token inválido o expirado'
            } else if (err.response?.status === 403) {
                errorMessage = '🚫 Error de permisos: No tienes acceso a este recurso'
            } else if (err.response?.status === 404) {
                errorMessage = '❌ Vehículo no encontrado'
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message
            } else if (err.message) {
                errorMessage = err.message
            }
            
            setError(errorMessage)
            return { success: false, error: errorMessage }
        } finally {
            setIsLoading(false)
        }
    }

    const resetState = () => {
        setError(null)
        setSuccess(false)
    }

    return {
        createCar,
        updateCar,    // ✅ NUEVO
        deleteCar,    // ✅ NUEVO
        isLoading,
        error,
        success,
        resetState
    }
}
