/**
 * useImageReducer.js - Hook personalizado para manejar estado de imágenes
 * 
 * @author Indiana Usados
 * @version 1.0.0 - Patrón {existingUrl, file, remove} para campos de imagen
 */

import { useReducer, useCallback, useMemo } from 'react'

// ✅ CAMPOS DE IMAGEN EXACTOS DEL BACKEND
export const IMAGE_FIELDS = [
    'fotoFrontal',
    'fotoTrasera', 
    'fotoLateralIzquierda',
    'fotoLateralDerecha',
    'fotoInterior'
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
    file: null,
    remove: false
})

// ✅ ESTADO INICIAL PARA TODAS LAS IMÁGENES
const createInitialImageState = () => {
    const state = {}
    IMAGE_FIELDS.forEach(key => {
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
            IMAGE_FIELDS.forEach(key => {
                editState[key] = {
                    existingUrl: urls[key] || '',
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
        
        IMAGE_FIELDS.forEach(field => {
            const { file, existingUrl, remove } = imageState[field] || {}
            
            if (mode === 'create') {
                // CREATE: Cada slot debe tener archivo
                if (!file) {
                    errors[field] = `La ${field} es requerida`
                }
            } else {
                // EDIT: Cada slot debe tener (file || existingUrl) || remove
                if (!(file || existingUrl || remove)) {
                    errors[field] = `La ${field} debe tener una imagen existente, una nueva, o marcar quitar`
                }
            }
        })
        
        return errors
    }, [imageState])

    // ✅ CONSTRUIR FORMDATA PARA IMÁGENES
    const buildImageFormData = useCallback((formData) => {
        IMAGE_FIELDS.forEach(key => {
            const { file, existingUrl, remove } = imageState[key] || {}
            
            if (remove) {
                formData.append(`${key}Remove`, '1')
            } else if (file) {
                formData.append(key, file)
            } else if (existingUrl) {
                // ✅ USAR NOMBRE DE CAMPO ORIGINAL (sin sufijo)
                formData.append(key, existingUrl)
            }
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
        IMAGE_FIELDS.forEach(key => {
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
