/**
 * useCarMutation.js - Hook simple para mutación de autos
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { useState } from 'react'
import axios from 'axios'
import { AUTH_CONFIG } from '@config/auth'
import { validateImageFields, prepareMultipleImagesForUpload } from '@utils/imageUtils'

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
                    imageFiles[key] = [value] // Convertir a FileList
                    console.log(`📁 ${key}:`, {
                        name: value.name,
                        size: value.size,
                        type: value.type
                    })
                } else {
                    dataFields[key] = value
                    console.log(`📝 ${key}:`, value)
                }
            }
            
            // ✅ VALIDAR ARCHIVOS DE IMAGEN
            const imageErrors = validateImageFields(imageFiles)
            if (Object.keys(imageErrors).length > 0) {
                throw new Error(`Errores de imagen: ${Object.values(imageErrors).join(', ')}`)
            }
            
            // ✅ PREPARAR ARCHIVOS PARA ENVÍO
            console.log('🔧 Preparando archivos de imagen para envío...')
            const preparedImages = prepareMultipleImagesForUpload(imageFiles)
            console.log('✅ Archivos preparados:', Object.keys(preparedImages))
            
            // ✅ CREAR FORMDATA SIMPLE (NO necesitamos preparar archivos)
            const cloudinaryFormData = new FormData()
            
            // Agregar campos de datos
            Object.entries(dataFields).forEach(([key, value]) => {
                cloudinaryFormData.append(key, value)
            })
            
            // ✅ AGREGAR ARCHIVOS PREPARADOS CON NOMBRES DE CAMPO CORRECTOS
            Object.entries(preparedImages).forEach(([fieldName, fileList]) => {
                if (fileList && fileList.length > 0) {
                    // ✅ IMPORTANTE: Usar el nombre del campo exacto que espera Multer
                    cloudinaryFormData.append(fieldName, fileList[0])
                    console.log(`📁 Agregando ${fieldName}:`, fileList[0].name)
                }
            })
            
            console.log('✅ FormData creado con archivos preparados')
            
            // ✅ DEBUG: LOGGING COMPLETO DEL FORMDATA
            console.log('🔍 DEBUG: Contenido completo del FormData:')
            for (let [key, value] of cloudinaryFormData.entries()) {
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
            
            // ✅ OBTENER TOKEN DE AUTORIZACIÓN PRIMERO
            const token = getAuthToken()
            console.log('🔍 Buscando token para autorización...')
            console.log('🔍 Clave de búsqueda:', AUTH_CONFIG.storage.tokenKey)
            console.log('🔍 Token encontrado:', token ? `✅ Sí (${token.substring(0, 20)}...)` : '❌ No')
            
            if (!token) {
                console.error('❌ NO SE ENCONTRÓ TOKEN - Verificando localStorage:')
                console.error(`localStorage.${AUTH_CONFIG.storage.tokenKey}:`, localStorage.getItem(AUTH_CONFIG.storage.tokenKey))
                console.error('localStorage disponible:', Object.keys(localStorage))
                throw new Error('❌ No se encontró token de autorización')
            }
            
            // ✅ DEBUG: VERIFICAR HEADERS (DESPUÉS de obtener el token)
            console.log('🔍 DEBUG: Headers que se enviarán:')
            console.log('Content-Type:', 'multipart/form-data')
            console.log('Authorization:', `Bearer ${token.substring(0, 20)}...`)
            
            // ✅ LOGGING ANTES DEL ENVÍO
            console.log('🌐 Enviando a:', 'http://localhost:3001/photos/create')
            console.log('🔐 Token válido encontrado:', `✅ Sí (${token.substring(0, 20)}...)`)
            console.log('📤 Headers:', {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token.substring(0, 20)}...`
            })
            
            const response = await axios.post('http://localhost:3001/photos/create', cloudinaryFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            })

            console.log('✅ Respuesta del servidor:', response.data)
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
                    
                    // ✅ DEBUG: ANALIZAR ERROR 400 EN DETALLE
                    console.log('🔍 DEBUG: Análisis del error 400:')
                    console.log('🔍 Status:', err.response.status)
                    console.log('🔍 StatusText:', err.response.statusText)
                    console.log('🔍 Data completo:', err.response.data)
                    console.log('🔍 Headers de respuesta:', err.response.headers)
                    
                    // ✅ DEBUG: VERIFICAR SI ES PROBLEMA DE VALIDACIÓN
                    if (err.response.data.msg) {
                        console.log('🔍 Mensaje de error específico:', err.response.data.msg)
                        if (err.response.data.msg.includes('format')) {
                            console.log('🔍 PROBLEMA IDENTIFICADO: Formato de imagen incorrecto')
                            console.log('�� Posibles causas:')
                            console.log('   - Tipo MIME no soportado')
                            console.log('   - Extensión de archivo inválida')
                            console.log('   - Archivo corrupto o dañado')
                        }
                    }
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

    const resetState = () => {
        setError(null)
        setSuccess(false)
    }

    return {
        createCar,
        isLoading,
        error,
        success,
        resetState
    }
}
