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

// ✅ FUNCIÓN SIMPLE PARA OBTENER TOKEN
const getAuthToken = () => {
    try {
        // ✅ USAR LA MISMA CLAVE QUE useAuth
        const token = localStorage.getItem(AUTH_CONFIG.storage.tokenKey)
        return token
    } catch (error) {
        console.error('❌ Error al obtener token:', error)
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
            console.log('🚀 Enviando formulario al endpoint...')
            
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
            
            // ✅ LOG RESUMIDO DE ARCHIVOS
            console.log('📁 Archivos extraídos:', Object.keys(imageFiles).map(key => 
                `${key}: ${imageFiles[key].length} archivo(s)`
            ).join(', '))
            
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
                console.error('❌ NO SE ENCONTRÓ TOKEN - Verificando localStorage:')
                console.error(`localStorage.${AUTH_CONFIG.storage.tokenKey}:`, localStorage.getItem(AUTH_CONFIG.storage.tokenKey))
                console.error('localStorage disponible:', Object.keys(localStorage))
                throw new Error('❌ No se encontró token de autorización')
            }
            
            // ✅ ENVÍO AL BACKEND usando servicio unificado
            const response = await vehiclesService.createVehicle(cloudinaryFormData)
            setSuccess(true)
            return { success: true, data: response.data }

        } catch (err) {
            console.error('❌ Error al crear auto:', err)
            
            // ✅ LOGGING DETALLADO DEL ERROR
            if (err.response) {
                console.error('📡 Respuesta del servidor:', {
                    status: err.response.status,
                    statusText: err.response.statusText,
                    data: err.response.data,
                    headers: err.response.headers
                })
                
                // ✅ MANEJO ESPECÍFICO DE ERRORES DE AUTORIZACIÓN
                if (err.response.status === 401) {
                    console.error('🔐 Error de autorización - Token inválido o expirado')
                } else if (err.response.status === 403) {
                    console.error('🚫 Error de permisos - No tienes acceso a este recurso')
                } else if (err.response.status === 400) {
                    console.error('🚨 Error 400 - Detalles del backend:', err.response.data)
                    console.error('🚨 Posible problema de formato de archivo o validación')
                    
                }
            }
            
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
            console.log('🔍 DEBUG: Contenido del FormData para actualización:')
            for (let [key, value] of formData.entries()) {
                if (value instanceof File) {
                    console.log(`📁 ${key}:`, {
                        name: value.name,
                        size: value.size,
                        type: value.type
                    })
                } else {
                    console.log(`📝 ${key}:`, value)
                }
            }
            
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
            console.log('🔍 DEBUG COMPLETO - FormData que se enviará:')
            console.log('🔍 ID del vehículo:', id)
            console.log('🔍 Headers:', {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token.substring(0, 20)}...`
            })
            
            // ✅ DEBUG: Verificar si fotosExtra está presente
            const hasFotosExtra = Array.from(formData.entries()).some(([key]) => key === 'fotosExtra')
            console.log('🔍 ¿Incluye fotosExtra?', hasFotosExtra)
            
            // ✅ LOGGING DETALLADO DE CADA CAMPO
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
            
            // ✅ USAR ENDPOINT CORRECTO: PUT /photos/updatephoto/:id
            console.log('🔄 Enviando actualización...')
            const response = await vehiclesService.updateVehicle(id, formData)

            console.log('✅ Respuesta de actualización:', response.data)
            setSuccess(true)
            return { success: true, data: response.data }

        } catch (err) {
            console.error('❌ Error al actualizar auto:', err)
            
            // ✅ DEBUG EXTENDIDO: Logging detallado del error
            if (err.response) {
                console.error('🚨 ERROR DEL BACKEND - Análisis detallado:')
                console.error('📡 Status:', err.response.status)
                console.error('📡 StatusText:', err.response.statusText)
                console.error('📡 Data completo:', err.response.data)
                console.error('📡 Headers de respuesta:', err.response.headers)
                console.error('📡 URL:', err.config?.url)
                console.error('📡 Method:', err.config?.method)
                
                // ✅ INTENTAR EXTRAER MENSAJE DE ERROR ESPECÍFICO
                if (err.response.data) {
                    if (err.response.data.message) {
                        console.error('🔍 Mensaje de error:', err.response.data.message)
                    }
                    if (err.response.data.error) {
                        console.error('🔍 Error específico:', err.response.data.error)
                    }
                    if (err.response.data.errors) {
                        console.error('🔍 Errores de validación:', err.response.data.errors)
                    }
                    if (err.response.data.msg) {
                        console.error('🔍 Mensaje del backend:', err.response.data.msg)
                    }
                }
            }
            
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
            console.log('🗑️ Enviando eliminación al endpoint...', { id })
            
            // ✅ OBTENER TOKEN DE AUTORIZACIÓN
            const token = getAuthToken()
            if (!token) {
                throw new Error('❌ No se encontró token de autorización')
            }
            
            // ✅ ENVIAR ELIMINACIÓN usando servicio unificado
            const response = await vehiclesService.deleteVehicle(id)

            console.log('✅ Respuesta de eliminación:', response.data)
            setSuccess(true)
            return { success: true, data: response.data }

        } catch (err) {
            console.error('❌ Error al eliminar auto:', err)
            
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
