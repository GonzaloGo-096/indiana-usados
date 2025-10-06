/**
 * imageUtils.js - Utilidades para manejo de imágenes
 * 
 * Centraliza la lógica de procesamiento de imágenes para evitar duplicación
 * y mejorar la performance con memoización.
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { defaultCarImage } from '@assets'
import { logger } from '@utils/logger'

/**
 * Función helper para mostrar "-" cuando el valor esté vacío
 * @param {*} value - Valor a formatear
 * @returns {string} - Valor formateado o "-"
 */
export const formatValue = (value) => {
    if (!value || value === '' || value === 'null' || value === 'undefined') {
        return '-'
    }
    return value
}

/**
 * Obtener imagen principal (solo mostrar: true)
 * @param {Object} auto - Objeto del vehículo
 * @returns {string} - URL de la imagen principal
 */
export const getMainImage = (auto) => {
    // ✅ MEJORADO: Validación más robusta
    if (!auto || typeof auto !== 'object' || Array.isArray(auto)) {
        return defaultCarImage
    }
    
    try {
        // Buscar imágenes con mostrar: true
        const visibleImages = Object.values(auto)
            .filter(img => isValidImage(img) && img.mostrar === true)
            .map(img => img.url);
        
        return visibleImages[0] || auto.imagen || defaultCarImage;
    } catch (error) {
        logger.warn('images:utils', 'Error al procesar imagen principal', { message: error.message })
        return auto.imagen || defaultCarImage
    }
}

/**
 * Obtener todas las imágenes para carrusel (true y false)
 * @param {Object} auto - Objeto del vehículo
 * @returns {Array} - Array de URLs de imágenes
 */
export const getCarouselImages = (auto) => {
    // ✅ MEJORADO: Validación más robusta
    if (!auto || typeof auto !== 'object' || Array.isArray(auto)) {
        return [defaultCarImage]
    }
    
    try {
        // ✅ NUEVO: Lista de propiedades de imagen conocidas
        const imageProperties = [
            'fotoPrincipal',
            'fotoHover', 
            'imagen',
            'fotosExtras', // ✅ NUEVO: Array de fotos extras
            'fotosExtra',  // ✅ NUEVO: Variación singular
            'gallery',     // ✅ NUEVO: Galería de imágenes
            'imagenes',    // ✅ NUEVO: Array de imágenes
            'photos',      // ✅ NUEVO: Fotos en inglés
            'images'       // ✅ NUEVO: Imágenes en inglés
        ]
        
        // ✅ NUEVO: Extraer imágenes de propiedades conocidas
        const extractedImages = []
        
        imageProperties.forEach(prop => {
            const value = auto[prop]
            if (value) {
                // Si es un array de imágenes (como fotosExtras)
                if (Array.isArray(value)) {
                    value.forEach(img => {
                        if (typeof img === 'string' && img.trim() !== '') {
                            extractedImages.push(img.trim())
                        } else if (typeof img === 'object' && img.public_id) {
                            // ✅ Si tiene public_id, mantenerlo como objeto
                            extractedImages.push(img)
                        } else if (typeof img === 'object' && img.url) {
                            // ✅ Mantener objeto completo (puede tener public_id extraíble de URL)
                            extractedImages.push(img)
                        }
                    })
                }
                // Si es un objeto con URL o public_id
                else if (typeof value === 'object') {
                    if (value.public_id) {
                        // ✅ Mantener objeto completo si tiene public_id
                        extractedImages.push(value)
                    } else if (value.url) {
                        // ✅ Mantener objeto completo (puede tener public_id extraíble de URL)
                        extractedImages.push(value)
                    }
                }
                // Si es una URL directa
                else if (typeof value === 'string' && value.trim() !== '') {
                    extractedImages.push(value.trim())
                }
            }
        })
        
        // ✅ NUEVO: Buscar en array de imágenes si existe
        if (auto.imágenes && Array.isArray(auto.imágenes)) {
            auto.imágenes.forEach(img => {
                if (typeof img === 'string' && img.trim() !== '') {
                    extractedImages.push(img.trim())
                } else if (typeof img === 'object' && img.public_id) {
                    extractedImages.push(img)
                } else if (typeof img === 'object' && img.url) {
                    // ✅ Mantener objeto completo
                    extractedImages.push(img)
                }
            })
        }
        
        // ✅ NUEVO: Buscar imágenes estructuradas (formato anterior)
        const structuredImages = Object.values(auto)
            .filter(img => isValidImage(img))
            .map(img => {
                // ✅ Siempre retornar objeto completo (puede tener public_id o url)
                return img
            });
        
        // ✅ NUEVO: Combinar todas las fuentes de imágenes
        const allImages = [...extractedImages, ...structuredImages]
        
        // ✅ NUEVO: Eliminar duplicados (comparar por URL o public_id)
        const uniqueImages = []
        const seenIds = new Set()
        
        allImages.forEach(img => {
            if (!img) return
            
            const identifier = typeof img === 'string' 
                ? img 
                : (img.public_id || img.url)
            
            if (identifier && !seenIds.has(identifier)) {
                seenIds.add(identifier)
                uniqueImages.push(img)
            }
        })
        
        // ✅ Filtrar valores inválidos
        const validImages = uniqueImages.filter(img => {
            if (typeof img === 'string') {
                return img.trim() !== '' && img !== 'undefined'
            }
            if (typeof img === 'object') {
                return (img.public_id || img.url) && img.url !== 'undefined'
            }
            return false
        })
        
        // ✅ NUEVO: Si hay imágenes válidas, usarlas
        if (validImages.length > 0) {
            return validImages
        }
        
        // ✅ ARREGLADO: Fallback a imagen principal
        return auto.imagen ? [auto.imagen] : [defaultCarImage]
    } catch (error) {
        logger.warn('images:utils', 'Error al procesar imágenes del carrusel', { message: error.message })
        return auto.imagen ? [auto.imagen] : [defaultCarImage]
    }
}

// ⚠️ ELIMINADO: processImages() 
// Razón: Destruía public_id, causando que el carrusel no optimizara imágenes
// Fecha: 2024
// Las imágenes ahora se pasan directamente a los componentes

/**
 * Validar estructura de imagen
 * @param {*} img - Objeto de imagen a validar
 * @returns {boolean} - True si es válido
 */
export const isValidImage = (img) => {
    return img && 
           typeof img === 'object' && 
           img.url && 
           typeof img.url === 'string' &&
           img.url.trim() !== ''
}

/**
 * Obtener imágenes visibles (mostrar: true)
 * @param {Object} auto - Objeto del vehículo
 * @returns {Array} - Array de URLs de imágenes visibles
 */
export const getVisibleImages = (auto) => {
    if (!auto) return []
    
    return Object.values(auto)
        .filter(isValidImage)
        .filter(img => img.mostrar === true)
        .map(img => img.url);
}

/**
 * Obtener todas las imágenes válidas
 * @param {Object} auto - Objeto del vehículo
 * @returns {Array} - Array de URLs de todas las imágenes válidas
 */
export const getAllValidImages = (auto) => {
    if (!auto) return []
    
    return Object.values(auto)
        .filter(isValidImage)
        .map(img => img.url);
} 

/**
 * imageUtils.js - Utilidades para procesamiento de imágenes
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

/**
 * Convierte un File del navegador al formato que espera Cloudinary
 * @param {File} file - Archivo del navegador
 * @param {string} fieldName - Nombre del campo (ej: 'fotoPrincipal')
 * @returns {Object} Objeto compatible con Cloudinary
 */
export const prepareFileForCloudinary = (file, fieldName) => {
  if (!file || !(file instanceof File)) {
    throw new Error(`Archivo inválido para ${fieldName}`)
  }

  // ✅ VALIDAR TIPO DE ARCHIVO (EXACTAMENTE COMO EL BACKEND)
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Tipo de archivo no soportado: ${file.type}. Solo se permiten: ${allowedTypes.join(', ')}`)
  }

  // ✅ VALIDAR TAMAÑO (máximo 10MB)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    throw new Error(`Archivo demasiado grande: ${(file.size / 1024 / 1024).toFixed(2)}MB. Máximo: 10MB`)
  }

  // ✅ CREAR OBJETO COMPATIBLE CON CLOUDINARY
  return {
    fieldname: fieldName,
    originalname: file.name,
    mimetype: file.type,
    size: file.size,
    // ✅ SIMULAR file.path PARA CLOUDINARY (determinístico)
    // El public_id lo define backend; este path temporal NO debe afectar el ID final en Cloudinary
    path: `temp/${fieldName}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
    // ✅ AGREGAR BUFFER PARA PROCESAMIENTO
    buffer: null, // Se llenará después
    // ✅ MÉTODOS COMPATIBLES
    toJSON: () => ({
      fieldname: fieldName,
      originalname: file.name,
      mimetype: file.type,
      size: file.size,
      path: `temp/${fieldName}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    })
  }
}

/**
 * Prepara múltiples archivos para Cloudinary
 * @param {Object} imageFiles - Objeto con FileList por campo
 * @returns {Array} Array de archivos preparados
 */
export const prepareMultipleFilesForCloudinary = (imageFiles) => {
  const preparedFiles = []
  
  // ✅ PROCESAR CADA CAMPO DE IMAGEN
  Object.entries(imageFiles).forEach(([fieldName, fileList]) => {
    if (fileList && fileList.length > 0) {
      const file = fileList[0] // Tomar el primer archivo
      try {
        const preparedFile = prepareFileForCloudinary(file, fieldName)
        preparedFiles.push(preparedFile)
      } catch (error) {
        logger.error('images:utils', `Error preparando ${fieldName}`, { message: error.message })
        throw error
      }
    }
  })

  return preparedFiles
}

/**
 * Valida que todos los campos de imagen tengan archivos
 * @param {Object} imageFiles - Objeto con FileList por campo
 * @returns {Object} Objeto con errores de validación
 */
// ✅ CONSTANTES DE VALIDACIÓN
const REQUIRED_IMAGE_FIELDS = ['fotoPrincipal', 'fotoHover']
const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const MIN_EXTRA_PHOTOS = 5

export const validateImageFields = (imageFiles, mode = 'create') => {
  const errors = {}

  // ✅ VALIDAR CAMPOS PRINCIPALES OBLIGATORIOS (solo en modo CREATE)
  if (mode === 'create') {
    REQUIRED_IMAGE_FIELDS.forEach(field => {
      if (!imageFiles[field] || imageFiles[field].length === 0) {
        errors[field] = `Campo ${field} es requerido`
      } else {
        const file = imageFiles[field][0]
        
        // ✅ VALIDAR TIPO MIME
        if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
          errors[field] = `Formato no soportado: ${file.type}. Solo se permiten: ${SUPPORTED_IMAGE_TYPES.join(', ')}`
        }
        
        // ✅ VALIDAR TAMAÑO
        if (file.size > MAX_FILE_SIZE) {
          errors[field] = `Archivo muy grande: ${(file.size / 1024 / 1024).toFixed(2)}MB. Máximo: 10MB`
        }
        
        // ✅ VALIDAR NOMBRE DE ARCHIVO
        if (!file.name || file.name.trim() === '') {
          errors[field] = `Nombre de archivo inválido`
        }
        
        // ✅ VALIDAR EXTENSIÓN
        const extension = file.name.split('.').pop()?.toLowerCase()
        const supportedExtensions = ['jpg', 'jpeg', 'png']
        if (!supportedExtensions.includes(extension)) {
          errors[field] = `Extensión no soportada: .${extension}. Solo se permiten: ${supportedExtensions.join(', ')}`
        }
      }
    })

    // ✅ VALIDAR FOTOS EXTRAS (mínimo 5) - SOLO EN MODO CREATE
    if (mode === 'create') {
      const fotosExtraCount = imageFiles.fotosExtra ? imageFiles.fotosExtra.length : 0
      if (fotosExtraCount < MIN_EXTRA_PHOTOS) {
        errors.fotosExtra = `Se requieren mínimo ${MIN_EXTRA_PHOTOS} fotos extras (total mínimo: ${MIN_EXTRA_PHOTOS + 2} fotos)`
      }
    }
  } else {
    // ✅ MODO EDIT: Validación opcional - el usuario puede editar solo texto sin tocar imágenes
  }

  return errors
}

/**
 * Convierte archivos a FormData optimizado para Cloudinary
 * @param {Object} formData - FormData existente
 * @param {Object} imageFiles - Archivos de imagen
 * @returns {FormData} FormData optimizado
 */
export const createCloudinaryFormData = (formData, imageFiles) => {
  const cloudinaryFormData = new FormData()
  
  // ✅ COPIAR DATOS NO-IMAGEN
  for (let [key, value] of formData.entries()) {
    if (!key.startsWith('foto')) {
      cloudinaryFormData.append(key, value)
    }
  }

  // ✅ AGREGAR ARCHIVOS PREPARADOS
  Object.entries(imageFiles).forEach(([fieldName, fileList]) => {
    if (fileList && fileList.length > 0) {
      const file = fileList[0]
      cloudinaryFormData.append(fieldName, file)
    }
  })

  return cloudinaryFormData
}

/**
 * Prepara un archivo de imagen para envío al backend
 * @param {File} file - Archivo de imagen
 * @param {string} fieldName - Nombre del campo
 * @returns {File} Archivo preparado
 */
export const prepareImageForUpload = (file, fieldName) => {
  // ✅ VERIFICAR QUE SEA UN ARCHIVO VÁLIDO
  if (!(file instanceof File)) {
    throw new Error(`Archivo inválido para ${fieldName}`)
  }
  
  // ✅ VERIFICAR TIPO MIME (EXACTAMENTE COMO EL BACKEND)
  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png']
  if (!supportedTypes.includes(file.type)) {
    throw new Error(`Formato no soportado para ${fieldName}: ${file.type}. Solo se permiten: ${supportedTypes.join(', ')}`)
  }
  
  // ✅ VERIFICAR TAMAÑO
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    throw new Error(`Archivo ${fieldName} muy grande: ${(file.size / 1024 / 1024).toFixed(2)}MB`)
  }
  
  // ✅ VERIFICAR EXTENSIÓN (EXACTAMENTE COMO EL BACKEND)
  const extension = file.name.split('.').pop()?.toLowerCase()
  const supportedExtensions = ['jpg', 'jpeg', 'png']
  if (!supportedExtensions.includes(extension)) {
    throw new Error(`Extensión no soportada para ${fieldName}: .${extension}. Solo se permiten: ${supportedExtensions.join(', ')}`)
  }
  
  // ✅ RETORNAR ARCHIVO VALIDADO
  return file
}

/**
 * Prepara múltiples archivos de imagen para envío
 * @param {Object} imageFiles - Objeto con FileList por campo
 * @returns {Object} Objeto con archivos preparados
 */
export const prepareMultipleImagesForUpload = (imageFiles) => {
  const preparedFiles = {}
  
  Object.entries(imageFiles).forEach(([fieldName, fileList]) => {
    if (fileList && fileList.length > 0) {
      try {
        if (fieldName === 'fotosExtra') {
          // ✅ FOTOS EXTRAS: Procesar archivos múltiples
          const preparedExtraFiles = fileList.map(file => prepareImageForUpload(file, fieldName))
          preparedFiles[fieldName] = preparedExtraFiles
        } else {
          // ✅ FOTOS PRINCIPALES: Solo el primer archivo
          const preparedFile = prepareImageForUpload(fileList[0], fieldName)
          preparedFiles[fieldName] = [preparedFile]
        }
      } catch (error) {
        logger.error('images:utils', `Error preparando ${fieldName}`, { message: error.message })
        throw error
      }
    }
  })
  
  return preparedFiles
} 