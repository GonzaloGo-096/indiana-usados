/**
 * useImageReducer.js - Hook personalizado para manejar estado de imágenes
 * 
 * @author Indiana Usados
 * @version 1.0.0 - Patrón {existingUrl, file, remove} para campos de imagen
 */

import React, { useReducer, useCallback, useMemo } from 'react'
import { logger } from '@utils/logger'

// ✅ CAMPOS DE IMAGEN (estructura actualizada)
export const IMAGE_FIELDS = {
    principales: ['fotoPrincipal', 'fotoHover']
    // extras ahora se manejan de forma diferente - como array en vez de campos individuales
}

// ✅ CAMPOS INDIVIDUALES (solo principales)
export const ALL_IMAGE_FIELDS = [
    ...IMAGE_FIELDS.principales
]

// ✅ CAMPOS LEGACY PARA CARGAR FOTOS EXISTENTES DEL BACKEND
const LEGACY_EXTRA_FIELDS = ['fotoExtra1', 'fotoExtra2', 'fotoExtra3', 'fotoExtra4', 'fotoExtra5', 'fotoExtra6', 'fotoExtra7', 'fotoExtra8']

// ✅ ACCIONES DEL REDUCER DE IMÁGENES
export const IMAGE_ACTIONS = {
    INIT_CREATE: 'INIT_CREATE',
    INIT_EDIT: 'INIT_EDIT',
    SET_FILE: 'SET_FILE',
    REMOVE_IMAGE: 'REMOVE_IMAGE',
    RESET: 'RESET',
    // ✅ NUEVAS ACCIONES PARA FOTOS EXTRAS
    SET_MULTIPLE_EXTRAS: 'SET_MULTIPLE_EXTRAS',        // Para input múltiple
    REMOVE_EXISTING_EXTRA: 'REMOVE_EXISTING_EXTRA',   // Para eliminar foto existente
    RESTORE_EXISTING_EXTRA: 'RESTORE_EXISTING_EXTRA'  // Para restaurar foto existente
}

// ✅ ESTADO INICIAL PARA UNA IMAGEN
const createEmptyImageState = () => ({
    existingUrl: '',
    publicId: '',        // ✅ NUEVO: public_id de Cloudinary
    originalName: '',    // ✅ NUEVO: nombre original del archivo
    file: null,
    remove: false
})

// ✅ ESTADO INICIAL PARA TODAS LAS IMÁGENES
const createInitialImageState = () => {
    const state = {
        // ✅ FOTOS EXTRAS: Separadas en dos arrays
        existingExtras: [],  // Fotos que ya existen en el backend
        fotosExtra: []       // Archivos nuevos del input múltiple
    }
    
    // Solo campos principales como campos individuales
    ALL_IMAGE_FIELDS.forEach(key => {
        state[key] = createEmptyImageState()
    })
    
    return state
}

// ✅ REDUCER PARA MANEJO DE IMÁGENES
const imageReducer = (state, action) => {
    switch (action.type) {
        case IMAGE_ACTIONS.INIT_CREATE:
            return createInitialImageState()
            
        case IMAGE_ACTIONS.INIT_EDIT:
            const { urls = {} } = action.payload
            const editState = {
                existingExtras: [],  // Se llenará con fotos del backend
                fotosExtra: []       // Vacío inicialmente
            }
            
            // ✅ PROCESAR IMÁGENES PRINCIPALES
            ALL_IMAGE_FIELDS.forEach(key => {
                const imageData = urls[key]
                let url = ''
                let publicId = ''
                let originalName = ''
                
                if (imageData) {
                    if (typeof imageData === 'string') {
                        url = imageData
                    } else if (typeof imageData === 'object') {
                        url = imageData.url || imageData.secure_url || ''
                        publicId = imageData.public_id || ''
                        originalName = imageData.original_name || ''
                    }
                }
                
                editState[key] = {
                    existingUrl: url,
                    publicId: publicId,
                    originalName: originalName,
                    file: null,
                    remove: false
                }
            })
            
            // ✅ PROCESAR FOTOS EXTRAS - Cargar como array de existentes
            LEGACY_EXTRA_FIELDS.forEach(fieldKey => {
                const imageData = urls[fieldKey]
                if (imageData) {
                    let url = ''
                    let publicId = ''
                    let originalName = ''
                    
                    if (typeof imageData === 'string') {
                        url = imageData
                    } else if (typeof imageData === 'object') {
                        url = imageData.url || imageData.secure_url || ''
                        publicId = imageData.public_id || ''
                        originalName = imageData.original_name || ''
                    }
                    
                    if (url) {
                        editState.existingExtras.push({
                            url: url,
                            publicId: publicId,
                            originalName: originalName,
                            remove: false // Inicialmente no está marcada para eliminar
                        })
                    }
                }
            })
            
            return editState
            
        case IMAGE_ACTIONS.SET_FILE:
            const { key, file } = action.payload
            return {
                ...state,
                [key]: {
                    ...state[key],
                    file,
                    remove: false // ✅ EDGE CASE: Al seleccionar archivo, restaurar automáticamente
                }
            }
            
        case IMAGE_ACTIONS.REMOVE_IMAGE:
            const { key: removeKey } = action.payload
            return {
                ...state,
                [removeKey]: {
                    ...state[removeKey],
                    file: null,
                    remove: true
                }
            }
            
        case IMAGE_ACTIONS.SET_MULTIPLE_EXTRAS:
            // ✅ REEMPLAZAR ARCHIVOS DESDE INPUT MÚLTIPLE
            const { files } = action.payload
            
            logger.debug('image:setMultipleExtras', 'Files recibidos', {
                count: files?.length || 0,
                isArray: Array.isArray(files),
                firstFile: files?.[0]?.name || 'No hay archivos'
            })
            
            return {
                ...state,
                fotosExtra: files || [] // ✅ Ya es Array, usar directamente
            }
            
        case IMAGE_ACTIONS.REMOVE_EXISTING_EXTRA:
            // ✅ MARCAR FOTO EXISTENTE COMO ELIMINADA
            const { index } = action.payload
            logger.debug('image:removeExistingExtra', 'Marcando foto para eliminar', {
                index,
                currentState: state.existingExtras?.[index]
            })
            
            const existingExtras = [...state.existingExtras]
            
            if (existingExtras[index]) {
                existingExtras[index] = {
                    ...existingExtras[index],
                    remove: true
                }
                logger.debug('image:removeExistingExtra', 'Foto marcada para eliminar', {
                    index,
                    photo: existingExtras[index]
                })
            } else {
                logger.warn('image:removeExistingExtra', 'No se encontró foto en índice', { index })
            }
            
            return {
                ...state,
                existingExtras
            }
            
        case IMAGE_ACTIONS.RESTORE_EXISTING_EXTRA:
            // ✅ RESTAURAR FOTO EXISTENTE MARCADA COMO ELIMINADA
            const { index: restoreIndex } = action.payload
            logger.debug('image:restoreExistingExtra', 'Restaurando foto', {
                index: restoreIndex,
                currentState: state.existingExtras?.[restoreIndex]
            })
            
            const existingExtrasToRestore = [...state.existingExtras]
            
            if (existingExtrasToRestore[restoreIndex]) {
                existingExtrasToRestore[restoreIndex] = {
                    ...existingExtrasToRestore[restoreIndex],
                    remove: false
                }
                logger.debug('image:restoreExistingExtra', 'Foto restaurada', {
                    index: restoreIndex,
                    photo: existingExtrasToRestore[restoreIndex]
                })
            } else {
                logger.warn('image:restoreExistingExtra', 'No se encontró foto en índice', { index: restoreIndex })
            }
            
            return {
                ...state,
                existingExtras: existingExtrasToRestore
            }
            
        case IMAGE_ACTIONS.RESET:
            return createInitialImageState()
            
        default:
            return state
    }
}

// ✅ HOOK PRINCIPAL
export const useImageReducer = (mode, initialData = {}) => {
    const [imageState, dispatch] = useReducer(imageReducer, {}, () => {
        if (mode === 'edit' && initialData.urls) {
            return imageReducer(undefined, { 
                type: IMAGE_ACTIONS.INIT_EDIT, 
                payload: initialData 
            })
        }
        return createInitialImageState()
    })

    // ✅ INICIALIZAR ESTADO SEGÚN MODO
    const initImageState = useCallback((newMode, newInitialData = {}) => {
        if (newMode === 'create') {
            dispatch({ type: IMAGE_ACTIONS.INIT_CREATE })
        } else if (newMode === 'edit') {
            dispatch({ 
                type: IMAGE_ACTIONS.INIT_EDIT, 
                payload: newInitialData 
            })
        }
    }, [])

    // ✅ MANEJADORES DE IMÁGENES
    const setFile = useCallback((key, file) => {
        dispatch({ type: IMAGE_ACTIONS.SET_FILE, payload: { key, file } })
    }, [])

    const removeImage = useCallback((key) => {
        dispatch({ type: IMAGE_ACTIONS.REMOVE_IMAGE, payload: { key } })
    }, [])

    // ✅ NUEVA FUNCIÓN: Restaurar imagen eliminada
    const restoreImage = useCallback((key) => {
        dispatch({ 
            type: IMAGE_ACTIONS.SET_FILE, 
            payload: { key, file: null } // Esto resetea remove=false y mantiene existingUrl
        })
    }, [])

    const resetImages = useCallback(() => {
        dispatch({ type: IMAGE_ACTIONS.RESET })
    }, [])

    // ✅ NUEVOS MANEJADORES PARA FOTOS EXTRAS
    const setMultipleExtras = useCallback((files) => {
        logger.debug('image:setMultipleExtras', 'Función llamada', {
            filesCount: files?.length || 0,
            currentFotosExtra: imageState.fotosExtra?.length || 0,
            filesType: typeof files,
            isFileList: files instanceof FileList
        })
        
        // ✅ CONVERTIR FileList a Array ANTES del dispatch
        const filesArray = Array.from(files || [])
        logger.debug('image:setMultipleExtras', 'Convertido a Array', { count: filesArray.length })
        
        dispatch({ type: IMAGE_ACTIONS.SET_MULTIPLE_EXTRAS, payload: { files: filesArray } })
        logger.debug('image:setMultipleExtras', 'Dispatch ejecutado')
    }, [imageState.fotosExtra])

    const removeExistingExtra = useCallback((index) => {
        logger.debug('image:removeExistingExtra', 'Marcando foto para eliminar', {
            index,
            currentState: imageState.existingExtras?.[index]
        })
        dispatch({ type: IMAGE_ACTIONS.REMOVE_EXISTING_EXTRA, payload: { index } })
    }, [imageState.existingExtras])

    const restoreExistingExtra = useCallback((index) => {
        logger.debug('image:restoreExistingExtra', 'Restaurando foto', {
            index,
            currentState: imageState.existingExtras?.[index]
        })
        dispatch({ type: IMAGE_ACTIONS.RESTORE_EXISTING_EXTRA, payload: { index } })
    }, [imageState.existingExtras])

    // ✅ VALIDACIÓN DE IMÁGENES
    const validateImages = useCallback((mode) => {
        const errors = {}

        logger.debug('image:validateImages', 'Iniciando validación', {
            mode,
            newExtrasCount: imageState.newExtras?.length || 0
        })

        if (mode === 'create') {
            logger.debug('image:validateImages', 'Modo CREATE - Validando cantidad de fotos')
            
            // ✅ VALIDAR IMÁGENES PRINCIPALES
            IMAGE_FIELDS.principales.forEach(field => {
                const { file } = imageState[field] || {}
                if (!file) {
                    errors[field] = `La ${field} es requerida`
                }
            })

            // ✅ VALIDAR FOTOS EXTRAS - Contar archivos nuevos del input múltiple
            const fotosExtraCount = imageState.fotosExtra?.length || 0

            logger.debug('image:validateImages', 'Modo CREATE - Contando fotos extras', { fotosExtraCount })

            if (fotosExtraCount < 5) {
                errors.fotosExtra = 'Se requieren mínimo 5 fotos extras (total mínimo: 7 fotos)'
                logger.warn('image:validateImages', 'Error: Se requieren mínimo 5 fotos extras')
            }
            
            if (fotosExtraCount > 8) {
                errors.fotosExtra = 'Máximo 8 fotos extras permitidas'
            }
        } else {
            // ✅ EDIT: Validación opcional - usuario puede editar solo texto sin tocar imágenes
        }

        return errors
    }, [imageState])

    // ✅ CONSTRUIR FORMDATA PARA IMÁGENES (nueva estructura manteniendo compatibilidad backend)
    const buildImageFormData = useCallback((formData) => {
        logger.debug('image:buildImageFormData', 'Construyendo FormData')
        
        // ✅ PRINCIPALES - Overwrite automático por backend
        IMAGE_FIELDS.principales.forEach(key => {
            const { file, remove, publicId, existingUrl } = imageState[key] || {}
            if (file) {
                formData.append(key, file)
                logger.debug('image:buildImageFormData', 'Archivo nuevo enviado', {
                    field: key,
                    name: file.name,
                    size: file.size
                })
            } else {
                logger.debug('image:buildImageFormData', 'Mantener imagen existente', { field: key })
            }
            
            // Nota: Backend hace overwrite con mismo public_id, no genera zombies
            // Ver docs/MEJORAS_FUTURAS.md - Sección "Eliminación de Imágenes"
        })
        
        // ✅ FOTOS EXTRAS - Nueva lógica pero mismo output
        const extraFiles = []
        
        // 1. Agregar archivos nuevos del input múltiple
        if (imageState.fotosExtra && imageState.fotosExtra.length > 0) {
            extraFiles.push(...imageState.fotosExtra)
            logger.debug('image:buildImageFormData', 'Agregando archivos del input múltiple', {
                count: imageState.fotosExtra.length
            })
        }
        
        // 2. Recopilar públic_ids de fotos existentes marcadas para eliminar
        const publicIdsToDelete = []
        if (imageState.existingExtras) {
            imageState.existingExtras.forEach((existingPhoto, index) => {
                if (existingPhoto.remove && existingPhoto.publicId) {
                    publicIdsToDelete.push(existingPhoto.publicId)
                    logger.debug('image:buildImageFormData', 'Foto existente marcada para eliminar', {
                        index,
                        publicId: existingPhoto.publicId,
                        url: existingPhoto.url 
                    })
                }
            })
        }
        
        // 3. STRATEGY B: Estructura JSON completa en un solo campo
        const fotosState = {
            fotosNuevas: extraFiles.length > 0 ? extraFiles.map(file => ({
                name: file.name,
                size: file.size,
                type: file.type,
                // No podemos enviar el archivo directo en JSON, pero el backend puede usar esto para validación
                sent: true
            })) : [],
            eliminadas: publicIdsToDelete,
            timestamp: new Date().toISOString(),
            hasChanges: extraFiles.length > 0 || publicIdsToDelete.length > 0
        }
        
        // ✅ STRATEGY B: Enviar estado completo como JSON
        formData.append('fotosState', JSON.stringify(fotosState))
        logger.debug('image:buildImageFormData', 'STRATEGY B: Enviando estructura completa', { fotosState })
        
        // ✅ SOLUCIÓN DEFINITIVA: Siempre enviar algo a fotosExtra
        if (extraFiles.length > 0) {
            extraFiles.forEach(file => {
                formData.append('fotosExtra', file)
            })
            logger.debug('image:buildImageFormData', 'Enviando archivos nuevos al backend', {
                count: extraFiles.length
            })
        } else {
            // ✅ CRITICAL: El backend necesita este campo para procesar correctamente
            // Enviar placeholder JSON que el backend puede ignorar pero reconoce el campo
            formData.append('fotosExtraState', JSON.stringify({ preserve: true }))
            logger.debug('image:buildImageFormData', 'Enviando flag para preservar fotos (backend compatibility)')
        }
        
        // ✅ MANTENER COMPATIBILIDAD: También enviar eliminadas si existen
        if (publicIdsToDelete.length > 0) {
            formData.append('eliminadas', JSON.stringify(publicIdsToDelete))
            logger.debug('image:buildImageFormData', 'Enviando fotos eliminadas al backend', {
                publicIdsToDelete
            })
        } else {
            formData.append('eliminadas', JSON.stringify([]))
            logger.debug('image:buildImageFormData', 'Enviando array vacío de eliminadas')
        }
        
        return formData
    }, [imageState])

    // ✅ OBTENER PREVIEW PARA UNA IMAGEN
    const getPreviewFor = useCallback((key) => {
        const { file, existingUrl, remove } = imageState[key] || {}
        
        if (remove) return null
        
        if (file) {
            try {
                return URL.createObjectURL(file)
            } catch (_) {
                return null
            }
        }
        
        const preview = existingUrl || null
        if (!preview && key.startsWith('fotoExtra')) {
            // 🔍 Diagnóstico: por qué no hay preview para extras
            logger.debug('image:getPreviewFor', 'Sin preview disponible', {
                key,
                existingUrl,
                hasFile: !!file,
                remove
            })
        }
        return preview
    }, [imageState])

    // ✅ LIMPIAR OBJETOS URL CREADOS
    const cleanupObjectUrls = useCallback(() => {
        ALL_IMAGE_FIELDS.forEach(key => {
            const { file } = imageState[key] || {}
            if (file) {
                try {
                    URL.revokeObjectURL(URL.createObjectURL(file))
                } catch (_) {
                    // Ignorar errores de limpieza
                }
            }
        })
    }, [imageState])


    return {
        imageState,
        initImageState,
        setFile,
        removeImage,
        restoreImage,
        resetImages,
        validateImages,
        buildImageFormData,
        getPreviewFor,
        cleanupObjectUrls,
        // ✅ NUEVAS FUNCIONES PARA FOTOS EXTRAS
        setMultipleExtras,      // Para input múltiple
        removeExistingExtra,    // Para eliminar foto existente
        restoreExistingExtra    // Para restaurar foto existente
    }
}
