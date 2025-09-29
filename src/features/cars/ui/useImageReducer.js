/**
 * useImageReducer.js - Hook personalizado para manejar estado de imágenes
 * 
 * @author Indiana Usados
 * @version 1.0.0 - Patrón {existingUrl, file, remove} para campos de imagen
 */

import React, { useReducer, useCallback, useMemo } from 'react'

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
            
            console.log('🔧 SET_MULTIPLE_EXTRAS - Files recibidos:', files?.length || 0)
            console.log('🔧 SET_MULTIPLE_EXTRAS - Files es Array:', Array.isArray(files))
            console.log('🔧 SET_MULTIPLE_EXTRAS - Primer archivo:', files?.[0]?.name || 'No hay archivos')
            
            return {
                ...state,
                fotosExtra: files || [] // ✅ Ya es Array, usar directamente
            }
            
        case IMAGE_ACTIONS.REMOVE_EXISTING_EXTRA:
            // ✅ MARCAR FOTO EXISTENTE COMO ELIMINADA
            const { index } = action.payload
            console.log(`🗑️ REDUCER REMOVE_EXISTING_EXTRA - index: ${index}`)
            console.log(`🗑️ REDUCER - Estado antes:`, state.existingExtras?.[index])
            
            const existingExtras = [...state.existingExtras]
            
            if (existingExtras[index]) {
                existingExtras[index] = {
                    ...existingExtras[index],
                    remove: true
                }
                console.log(`🗑️ REDUCER - Foto marcada para eliminar:`, existingExtras[index])
            } else {
                console.log(`❌ REDUCER - No se encontró foto en índice ${index}`)
            }
            
            return {
                ...state,
                existingExtras
            }
            
        case IMAGE_ACTIONS.RESTORE_EXISTING_EXTRA:
            // ✅ RESTAURAR FOTO EXISTENTE MARCADA COMO ELIMINADA
            const { index: restoreIndex } = action.payload
            console.log(`↺ REDUCER RESTORE_EXISTING_EXTRA - index: ${restoreIndex}`)
            console.log(`↺ REDUCER - Estado antes:`, state.existingExtras?.[restoreIndex])
            
            const existingExtrasToRestore = [...state.existingExtras]
            
            if (existingExtrasToRestore[restoreIndex]) {
                existingExtrasToRestore[restoreIndex] = {
                    ...existingExtrasToRestore[restoreIndex],
                    remove: false
                }
                console.log(`↺ REDUCER - Foto restaurada:`, existingExtrasToRestore[restoreIndex])
            } else {
                console.log(`❌ REDUCER - No se encontró foto en índice ${restoreIndex}`)
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
        console.log('🔧 setMultipleExtras - Llamado con:', {
            filesCount: files?.length || 0,
            currentFotosExtra: imageState.fotosExtra?.length || 0,
            filesType: typeof files,
            isFileList: files instanceof FileList
        })
        
        // ✅ CONVERTIR FileList a Array ANTES del dispatch
        const filesArray = Array.from(files || [])
        console.log('🔧 setMultipleExtras - Convertido a Array:', filesArray.length)
        
        dispatch({ type: IMAGE_ACTIONS.SET_MULTIPLE_EXTRAS, payload: { files: filesArray } })
        console.log('🔧 setMultipleExtras - Dispatch ejecutado')
    }, [imageState.fotosExtra])

    const removeExistingExtra = useCallback((index) => {
        console.log(`🗑️ removeExistingExtra - Marcando foto ${index} para eliminar`)
        console.log(`🗑️ removeExistingExtra - Estado antes:`, imageState.existingExtras?.[index])
        dispatch({ type: IMAGE_ACTIONS.REMOVE_EXISTING_EXTRA, payload: { index } })
    }, [imageState.existingExtras])

    const restoreExistingExtra = useCallback((index) => {
        console.log(`↺ restoreExistingExtra - Restaurando foto ${index}`)
        console.log(`↺ restoreExistingExtra - Estado antes:`, imageState.existingExtras?.[index])
        dispatch({ type: IMAGE_ACTIONS.RESTORE_EXISTING_EXTRA, payload: { index } })
    }, [imageState.existingExtras])

    // ✅ VALIDACIÓN DE IMÁGENES
    const validateImages = useCallback((mode) => {
        const errors = {}

        console.log('🔍 ===== VALIDATE IMAGES START =====')
        console.log('🔍 validateImages - mode:', mode)
        console.log('🔍 validateImages - newExtras count:', imageState.newExtras?.length || 0)

        if (mode === 'create') {
            console.log('🔍 MODO CREATE - Validando cantidad de fotos')
            
            // ✅ VALIDAR IMÁGENES PRINCIPALES
            IMAGE_FIELDS.principales.forEach(field => {
                const { file } = imageState[field] || {}
                if (!file) {
                    errors[field] = `La ${field} es requerida`
                }
            })

            // ✅ VALIDAR FOTOS EXTRAS - Contar archivos nuevos del input múltiple
            const fotosExtraCount = imageState.fotosExtra?.length || 0

            console.log('🔍 MODO CREATE - fotosExtraCount:', fotosExtraCount)

            if (fotosExtraCount < 5) {
                errors.fotosExtra = 'Se requieren mínimo 5 fotos extras (total mínimo: 7 fotos)'
                console.log('❌ MODO CREATE - Error: Se requieren mínimo 5 fotos extras')
            }
            
            if (fotosExtraCount > 8) {
                errors.fotosExtra = 'Máximo 8 fotos extras permitidas'
                console.log('❌ MODO CREATE - Error: Máximo 8 fotos extras')
            }
        } else {
            console.log('🔍 MODO EDIT - SIN VALIDACIONES DE IMÁGENES')
            // ✅ EDIT: NO VALIDAR NADA - TODO OPCIONAL
            console.log('✅ Modo EDIT: Sin validaciones de imágenes - todo opcional')
        }

        console.log('🔍 validateImages - errors finales:', errors)
        console.log('🔍 ===== VALIDATE IMAGES END =====')
        return errors
    }, [imageState])

    // ✅ CONSTRUIR FORMDATA PARA IMÁGENES (nueva estructura manteniendo compatibilidad backend)
    const buildImageFormData = useCallback((formData) => {
        console.log('🔧 buildImageFormData - Construyendo FormData...')
        
        // ✅ PRINCIPALES - Mantener lógica existente
        IMAGE_FIELDS.principales.forEach(key => {
            const { file, remove, publicId, existingUrl } = imageState[key] || {}
            if (file) {
                formData.append(key, file)
                console.log(`📁 ${key} - archivo nuevo enviado:`, { name: file.name, size: file.size })
            } else {
                console.log(`📷 ${key} - mantener imagen existente (no enviar archivo)`)
            }
            
            // TODO: En el futuro implementar eliminadas para principales también
            if (remove && publicId && existingUrl) {
                console.log(`🗑️ ${key} marcada para eliminar (pendiente implementar):`, { publicId })
            }
        })
        
        // ✅ FOTOS EXTRAS - Nueva lógica pero mismo output
        const extraFiles = []
        
        // 1. Agregar archivos nuevos del input múltiple
        if (imageState.fotosExtra && imageState.fotosExtra.length > 0) {
            extraFiles.push(...imageState.fotosExtra)
            console.log(`📁 Agregando ${imageState.fotosExtra.length} archivos nuevos del input múltiple`)
        }
        
        // 2. Recopilar públic_ids de fotos existentes marcadas para eliminar
        const publicIdsToDelete = []
        if (imageState.existingExtras) {
            imageState.existingExtras.forEach((existingPhoto, index) => {
                if (existingPhoto.remove && existingPhoto.publicId) {
                    publicIdsToDelete.push(existingPhoto.publicId)
                    console.log(`🗑️ Foto existente marcada para eliminar:`, { 
                        index, 
                        publicId: existingPhoto.publicId,
                        url: existingPhoto.url 
                    })
                }
            })
        }
        
        // 3. Enviar archivos al backend (mantener exactamente la misma estructura que antes)
        if (extraFiles.length > 0) {
            extraFiles.forEach(file => {
                formData.append('fotosExtra', file)
            })
            console.log(`📁 fotosExtra - enviando ${extraFiles.length} archivos nuevos al backend`)
        } else {
            console.log('📷 fotosExtra - sin archivos nuevos (NO enviar nada al backend)')
        }
        
        // ✅ ENVIAR ARRAY DE ELIMINADAS AL BACKEND
        if (publicIdsToDelete.length > 0) {
            formData.append('eliminadas', JSON.stringify(publicIdsToDelete))
            console.log(`🗑️ eliminadas - enviando al backend:`, publicIdsToDelete)
        } else {
            console.log('🗑️ eliminadas - sin fotos para eliminar')
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
            console.log('🔎 getPreviewFor sin preview:', key, { existingUrl, hasFile: !!file, remove })
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
