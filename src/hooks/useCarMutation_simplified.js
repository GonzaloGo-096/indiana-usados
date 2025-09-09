/**
 * useCarMutation.js - Hook simple para mutación de autos
 * 
 * @author Indiana Usados
 * @version 3.0.0 - Simplificado con vehiclesApi
 */

import { useState } from 'react'
import axios from 'axios'
import { AUTH_CONFIG } from '@config/auth'
import { validateImageFields, prepareMultipleImagesForUpload } from '@utils/imageUtils'
import vehiclesApi from '@api/vehiclesApi'

// ✅ FUNCIÓN SIMPLE PARA OBTENER TOKEN
const getAuthToken = () => {
    try {
        // ✅ USAR LA MISMA CLAVE QUE useAuth
        const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY)
        return token
    } catch (error) {
        console.error('❌ Error obteniendo token:', error)
        return null
    }
}

export const useCarMutation = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    // ✅ FUNCIÓN PARA CREAR AUTO
    const createCar = async (formData) => {
        setIsLoading(true)
        setError(null)
        setSuccess(false)

        try {
            console.log('🚀 Enviando formulario al endpoint...')
            
            // ✅ OBTENER TOKEN DE AUTORIZACIÓN
            const token = getAuthToken()
            if (!token) {
                throw new Error('❌ No se encontró token de autorización')
            }

            // ✅ EXTRAER ARCHIVOS DE IMAGEN DEL FORMDATA
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
            
            console.log('📁 Archivos extraídos:', Object.keys(imageFiles).map(key => 
                `${key}: ${imageFiles[key].length} archivo(s)`
            ).join(', '))
            
            // ✅ VALIDAR IMÁGENES
            const imageErrors = validateImageFields(imageFiles)
            if (Object.keys(imageErrors).length > 0) {
                const errorMessage = `Errores de imagen: ${Object.values(imageErrors).join(', ')}`
                throw new Error(errorMessage)
            }
            
            // ✅ PREPARAR ARCHIVOS PARA UPLOAD
            const preparedImages = prepareMultipleImagesForUpload(imageFiles)
            
            // ✅ CREAR FORMDATA PARA CLOUDINARY
            const cloudinaryFormData = new FormData()
            
            // ✅ AGREGAR CAMPOS DE DATOS
            Object.entries(dataFields).forEach(([key, value]) => {
                cloudinaryFormData.append(key, value)
            })
            
            // ✅ AGREGAR ARCHIVOS DE IMAGEN
            const filesAdded = []
            Object.entries(preparedImages).forEach(([fieldName, fileList]) => {
                if (fileList && fileList.length > 0) {
                    if (fieldName === 'fotosExtra') {
                        fileList.forEach(file => {
                            cloudinaryFormData.append(fieldName, file)
                        })
                    } else {
                        cloudinaryFormData.append(fieldName, fileList[0])
                    }
                    filesAdded.push(`${fieldName}: ${fileList.length} archivo(s)`)
                }
            })
            
            console.log('✅ FormData creado:', filesAdded.join(', '))
            
            if (process.env.NODE_ENV === 'development') {
                console.log('🔍 DEBUG: FormData completo:')
                for (let [key, value] of cloudinaryFormData.entries()) {
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
            }
            
            const token = getAuthToken()
            console.log('🔐 Token:', token ? `✅ Válido (${token.substring(0, 20)}...)` : '❌ No encontrado')
            
            // ✅ ENVIAR A CLOUDINARY
            const response = await axios.post('http://localhost:3001/photos/create', cloudinaryFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            })
            
            console.log('✅ Auto creado exitosamente:', response.data)
            setSuccess(true)
            return { success: true, data: response.data }
            
        } catch (error) {
            console.error('❌ Error al crear auto:', error)
            setError(error.message)
            return { success: false, error: error.message }
        } finally {
            setIsLoading(false)
        }
    }

    // ✅ FUNCIÓN SIMPLIFICADA: updateCar para modo EDIT - USANDO vehiclesApi
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
            
            // ✅ USAR vehiclesApi.updatePhoto
            const response = await vehiclesApi.updatePhoto(id, formData)
            
            console.log('✅ Vehículo actualizado exitosamente:', response)
            setSuccess(true)
            return { success: true, data: response }
            
        } catch (error) {
            console.error('❌ Error al actualizar auto:', error)
            setError(error.message)
            return { success: false, error: error.message }
        } finally {
            setIsLoading(false)
        }
    }

    // ✅ FUNCIÓN PARA ELIMINAR AUTO
    const deleteCar = async (id) => {
        setIsLoading(true)
        setError(null)
        setSuccess(false)

        try {
            console.log('🗑️ Eliminando auto...', { id })
            
            // ✅ OBTENER TOKEN DE AUTORIZACIÓN
            const token = getAuthToken()
            if (!token) {
                throw new Error('❌ No se encontró token de autorización')
            }
            
            // ✅ USAR vehiclesApi.deletePhoto
            const response = await vehiclesApi.deletePhoto(id)
            
            console.log('✅ Auto eliminado exitosamente:', response)
            setSuccess(true)
            return { success: true, data: response }
            
        } catch (error) {
            console.error('❌ Error al eliminar auto:', error)
            setError(error.message)
            return { success: false, error: error.message }
        } finally {
            setIsLoading(false)
        }
    }

    // ✅ FUNCIÓN PARA RESETEAR ESTADOS
    const resetState = () => {
        setError(null)
        setSuccess(false)
    }

    return {
        createCar,
        updateCar,
        deleteCar,
        isLoading,
        error,
        success,
        resetState
    }
}
