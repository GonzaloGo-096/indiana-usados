/**
 * useImageReducer.js - Hook personalizado para manejar estado de imágenes
 * 
 * @author Indiana Usados
 * @version 1.0.0 - Patrón {existingUrl, file, remove} para campos de imagen
 */

import React, { useReducer, useCallback, useMemo } from 'react'
import { logger } from '@utils/logger'

// ✅ NUEVOS CAMPOS DE IMAGEN (estructura del backend actualizada)
export const IMAGE_FIELDS = {
    principales: ['fotoPrincipal', 'fotoHover'],
    extras: ['fotoExtra1', 'fotoExtra2', 'fotoExtra3', 'fotoExtra4', 'fotoExtra5', 'fotoExtra6', 'fotoExtra7', 'fotoExtra8']
}


// ✅ TODOS LOS CAMPOS (estructura limpia)volver c
export const ALL_IMAGE_FIELDS = [
    ...IMAGE_FIELDS.principales,
    ...IMAGE_FIELDS.extras
]

// ✅ ACCIONES DEL REDUCER DE IMÁGENES
export const IMAGE_ACTIONS = {
    INIT_CREATE: 'INIT_CREATE',
    INIT_EDIT: 'INIT_EDIT',
    SET_FILE: 'SET_FILE',
    REMOVE_IMAGE: 'REMOVE_IMAGE',
    RESET: 'RESET'
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
    const state = {}
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
            const editState = {}
            ALL_IMAGE_FIELDS.forEach(key => {
                const imageData = urls[key]
                let url = ''
                let publicId = ''
                let originalName = ''
                
                // ✅ LÓGICA ORIGINAL: Manejar objetos del backend directamente
                if (imageData) {
                    if (typeof imageData === 'string') {
                        // URL como string
                        url = imageData
                    } else if (typeof imageData === 'object') {
                        // Objeto del backend: puede tener url, secure_url, etc.
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

    // ✅ VALIDACIÓN DE IMÁGENES
    const validateImages = useCallback((mode) => {
        const errors = {}

        console.log('🔍 ===== VALIDATE IMAGES START =====')
        console.log('🔍 validateImages - mode:', mode, 'type:', typeof mode)
        console.log('🔍 validateImages - imageState keys:', Object.keys(imageState))
        console.log('🔍 validateImages - imageState completo:', imageState)

        if (mode === 'create') {
            console.log('🔍 MODO CREATE - Validando cantidad de fotos')
            // CREATE: 2 principales + mínimo 5 extras = 7 fotos total
            IMAGE_FIELDS.principales.forEach(field => {
                const { file } = imageState[field] || {}
                if (!file) {
                    errors[field] = `La ${field} es requerida`
                }
            })

            // ✅ EN MODO CREATE: Solo contar archivos nuevos (no hay fotos existentes)
            const extrasCount = IMAGE_FIELDS.extras.filter(field =>
                imageState[field]?.file
            ).length

            console.log('🔍 MODO CREATE - extrasCount (archivos nuevos):', extrasCount)

            if (extrasCount < 5) {
                errors.fotosExtra = 'Se requieren mínimo 5 fotos extras (total mínimo: 7 fotos)'
                console.log('❌ MODO CREATE - Error: Se requieren mínimo 5 fotos extras')
            }
        } else {
            console.log('🔍 MODO EDIT - SIN VALIDACIONES DE IMÁGENES')
            // ✅ EDIT: NO VALIDAR NADA DE IMÁGENES - TODO OPCIONAL
            // El usuario puede editar solo texto sin tocar imágenes
            console.log('✅ Modo EDIT: Sin validaciones de imágenes - todo opcional')
        }

        console.log('🔍 validateImages - errors finales:', errors)
        console.log('🔍 ===== VALIDATE IMAGES END =====')
        return errors
    }, [imageState])

        // ✅ CONSTRUIR FORMDATA PARA IMÁGENES (nueva estructura con eliminadas)
    const buildImageFormData = useCallback((formData) => {
        // ✅ ARRAY DE PUBLIC_IDS PARA ELIMINAR (principales y extras)
        const publicIdsToDelete = []
        
        // Principales - solo enviar si hay archivo NUEVO (no enviar si solo existe imagen)
        IMAGE_FIELDS.principales.forEach(key => {
            const { file, remove, publicId, existingUrl } = imageState[key] || {}
            if (file) {
                formData.append(key, file)
                console.log(`📁 ${key} - archivo nuevo enviado:`, { name: file.name, size: file.size })
            } else {
                console.log(`📷 ${key} - mantener imagen existente (no enviar archivo)`)
            }
            // ✅ Recolectar eliminadas (si usuario marcó eliminar y existe public_id)
            if (remove && publicId && existingUrl) {
                publicIdsToDelete.push(publicId)
                console.log(`🗑️ ${key} marcada para eliminar:`, { publicId, url: existingUrl })
            }
        })
        
        // Extras - enviar como array de archivos Y recopilar eliminadas
        const extraFiles = []
        
        IMAGE_FIELDS.extras.forEach(key => {
            const { file, remove, publicId, existingUrl } = imageState[key] || {}
            
            // ✅ RECOPILAR ELIMINADAS: Solo fotos extras con public_id válido
            if (remove && publicId && existingUrl) {
                publicIdsToDelete.push(publicId)
                console.log(`🗑️ ${key} marcada para eliminar:`, { publicId, url: existingUrl })
            }
            
            // ✅ RECOPILAR ARCHIVOS NUEVOS: Solo si hay archivo y no está eliminado
            if (file && !remove) {
                extraFiles.push(file)
                console.log(`📁 ${key} archivo nuevo:`, { name: file.name, size: file.size })
            }
        })
        
        // ✅ ENVIAR FOTOS EXTRAS - Solo si hay archivos nuevos (backend no quiere nada si no hay cambios)
        if (extraFiles.length > 0) {
            extraFiles.forEach(file => {
                formData.append('fotosExtra', file)
            })
            console.log(`📁 fotosExtra - enviando ${extraFiles.length} archivos nuevos`)
        } else {
            // ✅ SI NO HAY ARCHIVOS NUEVOS, NO ENVIAR NADA (backend no quiere recibir nada)
            console.log('📷 fotosExtra - sin archivos nuevos (NO enviar nada al backend)')
        }
        
        // Fase 1: no enviar eliminadas; solo archivos nuevos y datos
        
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
        restoreImage, // ✅ NUEVA FUNCIÓN EXPORTADA
        resetImages,
        validateImages,
        buildImageFormData,
        getPreviewFor,
        cleanupObjectUrls
    }
}
