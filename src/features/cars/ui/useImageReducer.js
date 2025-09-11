/**
 * useImageReducer.js - Hook personalizado para manejar estado de imágenes
 * 
 * @author Indiana Usados
 * @version 1.0.0 - Patrón {existingUrl, file, remove} para campos de imagen
 */

import { useReducer, useCallback, useMemo } from 'react'

// ✅ NUEVOS CAMPOS DE IMAGEN (estructura del backend actualizada)
export const IMAGE_FIELDS = {
    principales: ['fotoPrincipal', 'fotoHover'],
    extras: ['fotoExtra1', 'fotoExtra2', 'fotoExtra3', 'fotoExtra4', 'fotoExtra5', 'fotoExtra6', 'fotoExtra7', 'fotoExtra8']
}


// ✅ TODOS LOS CAMPOS (estructura limpia)
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
                
                // ✅ NUEVA LÓGICA: Manejar objetos {url, public_id, original_name}
                if (imageData) {
                    if (typeof imageData === 'string') {
                        // Compatibilidad hacia atrás - URL como string
                        url = imageData
                    } else if (typeof imageData === 'object') {
                        // ✅ NUEVO: Objeto completo del backend
                        url = imageData.url || ''
                        publicId = imageData.public_id || ''
                        originalName = imageData.original_name || ''
                    }
                }
                
                editState[key] = {
                    existingUrl: url,
                    publicId: publicId,          // ✅ NUEVO: Guardar public_id
                    originalName: originalName,  // ✅ NUEVO: Guardar nombre original
                    file: null,
                    remove: false
                }
            })
            // ✅ DEBUG: Solo mostrar resumen
            const imageCount = Object.values(editState).filter(state => state.existingUrl).length
            if (imageCount > 0) {
                console.log('🔍 INIT_EDIT:', { imageCount, hasExtras: Object.keys(urls).some(k => k.startsWith('fotoExtra') && urls[k]) })
            }
            return editState
            
        case IMAGE_ACTIONS.SET_FILE:
            const { key, file } = action.payload
            return {
                ...state,
                [key]: {
                    ...state[key],
                    file,
                    remove: false // Al seleccionar archivo, no está marcada para quitar
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

    const resetImages = useCallback(() => {
        dispatch({ type: IMAGE_ACTIONS.RESET })
    }, [])

    // ✅ VALIDACIÓN DE IMÁGENES
    const validateImages = useCallback((mode) => {
        const errors = {}
        
        if (mode === 'create') {
            // CREATE: 2 principales + mínimo 5 extras = 7 fotos total
            IMAGE_FIELDS.principales.forEach(field => {
                const { file } = imageState[field] || {}
                if (!file) {
                    errors[field] = `La ${field} es requerida`
                }
            })
            
            const extrasCount = IMAGE_FIELDS.extras.filter(field => 
                imageState[field]?.file
            ).length
            
            if (extrasCount < 5) {
                errors.fotosExtra = 'Se requieren mínimo 5 fotos extras (total mínimo: 7 fotos)'
            }
        } else {
            // EDIT: Todo opcional - no validaciones obligatorias
            // Solo validar formato si se suben archivos
            ALL_IMAGE_FIELDS.forEach(field => {
                const { file } = imageState[field] || {}
                if (file && !file.type.startsWith('image/')) {
                    errors[field] = `El archivo debe ser una imagen`
                }
            })
        }
        
        return errors
    }, [imageState])

    // ✅ CONSTRUIR FORMDATA PARA IMÁGENES (nueva estructura)
    const buildImageFormData = useCallback((formData) => {
        // Principales
        IMAGE_FIELDS.principales.forEach(key => {
            const { file } = imageState[key] || {}
            if (file) {
                formData.append(key, file)
            }
        })
        
        // Extras - enviar como array de archivos
        const extraFiles = IMAGE_FIELDS.extras
            .map(key => imageState[key]?.file)
            .filter(Boolean)
        
        extraFiles.forEach(file => {
            formData.append('fotosExtra', file)
        })
        
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
        
        return existingUrl || null
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
        resetImages,
        validateImages,
        buildImageFormData,
        getPreviewFor,
        cleanupObjectUrls
    }
}
