/**
 * useAdminMutations.js - Hook para mutaciones administrativas (editar/eliminar fotos)
 * 
 * @author Indiana Usados
 * @version 1.0.0 - Mutaciones administrativas
 */

import { useState } from 'react'
import { vehiclesApi } from '@api'
import { AUTH_CONFIG } from '@config/auth'
import { validateImageFields, prepareMultipleImagesForUpload } from '@utils/imageUtils'
import { logger } from '@utils'

// ✅ FUNCIÓN SIMPLE PARA OBTENER TOKEN
const getAuthToken = () => {
    try {
        const token = localStorage.getItem(AUTH_CONFIG.storage.tokenKey)
        return token
    } catch (error) {
        logger.error('Error al obtener token:', error)
        return null
    }
}

export const useAdminMutations = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    // ✅ FUNCIÓN PARA ACTUALIZAR FOTO (desde modal con formulario)
    const updatePhoto = async (id, formData) => {
        setIsLoading(true)
        setError(null)
        setSuccess(false)

        try {
            logger.info('Actualizando foto...', { id })
            
            // ✅ VALIDAR TOKEN DE AUTORIZACIÓN
            const token = getAuthToken()
            if (!token) {
                throw new Error('No se encontró token de autorización')
            }

            // ✅ VALIDAR ARCHIVOS DE IMAGEN SI EXISTEN
            const imageFiles = {}
            const dataFields = {}
            
            for (let [key, value] of formData.entries()) {
                if (value instanceof File) {
                    imageFiles[key] = [value]
                    logger.debug(`${key}:`, {
                        name: value.name,
                        size: value.size,
                        type: value.type
                    })
                } else {
                    dataFields[key] = value
                    logger.debug(`${key}:`, value)
                }
            }
            
            // ✅ VALIDAR ARCHIVOS DE IMAGEN SI HAY ALGUNO
            if (Object.keys(imageFiles).length > 0) {
                const imageErrors = validateImageFields(imageFiles)
                if (Object.keys(imageErrors).length > 0) {
                    throw new Error(`Errores de imagen: ${Object.values(imageErrors).join(', ')}`)
                }
                
                // ✅ PREPARAR ARCHIVOS PARA ENVÍO
                const preparedImages = prepareMultipleImagesForUpload(imageFiles)
                
                // ✅ CREAR FORMDATA CON ARCHIVOS PREPARADOS
                const cloudinaryFormData = new FormData()
                
                // Agregar campos de datos
                Object.entries(dataFields).forEach(([key, value]) => {
                    cloudinaryFormData.append(key, value)
                })
                
                // Agregar archivos preparados
                Object.entries(preparedImages).forEach(([fieldName, fileList]) => {
                    if (fileList && fileList.length > 0) {
                        cloudinaryFormData.append(fieldName, fileList[0])
                        logger.debug(`Agregando ${fieldName}:`, fileList[0].name)
                    }
                })
                
                // ✅ LLAMAR A LA API CON ARCHIVOS
                const response = await vehiclesApi.updatePhoto(id, cloudinaryFormData)
                logger.success('Foto actualizada con archivos:', response)
                setSuccess(true)
                return { success: true, data: response }
            } else {
                // ✅ LLAMAR A LA API SIN ARCHIVOS (solo datos)
                const response = await vehiclesApi.updatePhoto(id, formData)
                logger.success('Foto actualizada sin archivos:', response)
                setSuccess(true)
                return { success: true, data: response }
            }

        } catch (err) {
            logger.error('Error al actualizar foto:', err)
            
            // ✅ MENSAJES DE ERROR ESPECÍFICOS
            let errorMessage = 'Error desconocido al actualizar la foto'
            
            if (err.message.includes('token de autorización')) {
                errorMessage = 'Error de autorización: No se encontró token válido'
            } else if (err.response?.status === 401) {
                errorMessage = 'Error de autorización: Token inválido o expirado'
            } else if (err.response?.status === 403) {
                errorMessage = 'Error de permisos: No tienes acceso a este recurso'
            } else if (err.response?.status === 404) {
                errorMessage = 'Foto no encontrada'
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

    // ✅ FUNCIÓN PARA ELIMINAR FOTO (desde botón en card)
    const deletePhoto = async (id) => {
        setIsLoading(true)
        setError(null)
        setSuccess(false)

        try {
            logger.info('Eliminando foto...', { id })
            
            // ✅ VALIDAR TOKEN DE AUTORIZACIÓN
            const token = getAuthToken()
            if (!token) {
                throw new Error('No se encontró token de autorización')
            }

            // ✅ LLAMAR A LA API PARA ELIMINAR
            const response = await vehiclesApi.deletePhoto(id)
            logger.success('Foto eliminada:', response)
            setSuccess(true)
            return { success: true, data: response }

        } catch (err) {
            logger.error('Error al eliminar foto:', err)
            
            // ✅ MENSAJES DE ERROR ESPECÍFICOS
            let errorMessage = 'Error desconocido al eliminar la foto'
            
            if (err.message.includes('token de autorización')) {
                errorMessage = 'Error de autorización: No se encontró token válido'
            } else if (err.response?.status === 401) {
                errorMessage = 'Error de autorización: Token inválido o expirado'
            } else if (err.response?.status === 403) {
                errorMessage = 'Error de permisos: No tienes acceso a este recurso'
            } else if (err.response?.status === 404) {
                errorMessage = 'Foto no encontrada'
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

    const resetState = () => {
        setError(null)
        setSuccess(false)
    }

    return {
        updatePhoto,
        deletePhoto,
        isLoading,
        error,
        success,
        resetState
    }
}
