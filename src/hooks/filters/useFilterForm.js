/**
 * useFilterForm - Hook modular para manejo de formulario de filtros
 * 
 * Responsabilidades:
 * - Manejo de React Hook Form
 * - Validación de filtros
 * - Estado del formulario
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { useForm } from 'react-hook-form'
import { useCallback } from 'react'
import { DEFAULT_FILTER_VALUES } from '../../constants'
import { getValidFilters } from '../../utils/filterUtils'

export const useFilterForm = () => {
    // Configuración de React Hook Form
    const {
        register,
        watch,
        reset,
        setValue,
        handleSubmit,
        formState: { errors, isDirty }
    } = useForm({
        defaultValues: DEFAULT_FILTER_VALUES,
        mode: 'onChange'
    })

    // Observar cambios en todos los campos
    const watchedValues = watch()

    // Obtener filtros válidos del formulario
    const getValidFormFilters = useCallback(() => {
        return getValidFilters(watchedValues)
    }, [watchedValues])

    // Limpiar formulario
    const clearForm = useCallback(() => {
        reset(DEFAULT_FILTER_VALUES)
    }, [reset])

    // Verificar si hay filtros válidos
    const hasValidFilters = useCallback(() => {
        const validFilters = getValidFormFilters()
        return Object.keys(validFilters).length > 0
    }, [getValidFormFilters])

    // Obtener valores actuales del formulario
    const getFormValues = useCallback(() => {
        return watchedValues
    }, [watchedValues])

    return {
        // React Hook Form
        register,
        watch,
        reset,
        setValue,
        handleSubmit,
        errors,
        isDirty,
        
        // Valores del formulario
        formValues: watchedValues,
        
        // Funciones de utilidad
        getValidFormFilters,
        clearForm,
        hasValidFilters,
        getFormValues
    }
} 