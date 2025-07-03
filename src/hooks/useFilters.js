/**
 * useFilters - Hook personalizado para manejar filtros de vehículos
 * 
 * Optimizado para trabajar con React Hook Form:
 * - No duplica estado (usa el estado de React Hook Form)
 * - Maneja loading y queries de manera eficiente
 * - Proporciona funciones para reset y limpieza
 * 
 * @author Indiana Usados
 * @version 2.0.0
 */

import { useState, useCallback, useMemo, useRef } from 'react'

export const useFilters = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const timeoutRef = useRef(null)

    /**
     * Función para manejar cambios en filtros con loading
     * Optimizada para evitar múltiples llamadas simultáneas
     * @param {Object} filters - Filtros del formulario (desde React Hook Form)
     */
    const handleFiltersChange = useCallback((filters) => {
        console.log('Filtros aplicados:', filters)
        
        // Limpiar timeout anterior para evitar múltiples llamadas
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        
        // Simular loading (en el futuro se conectaría con API)
        setIsSubmitting(true)
        
        // Sin delay - respuesta inmediata
        setIsSubmitting(false)
    }, [])

    /**
     * Preparar objeto de queries para API
     * Solo incluye filtros con valores
     * @param {Object} filters - Filtros actuales
     */
    const getQueryParams = useCallback((filters) => {
        const params = {}
        
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== '') {
                params[key] = value
            }
        })
        
        return params
    }, [])

    /**
     * Contar filtros activos (campos con valor)
     * @param {Object} filters - Filtros actuales
     */
    const getActiveFiltersCount = useCallback((filters) => {
        return Object.values(filters).filter(value => value !== '').length
    }, [])

    return {
        // Estado
        isSubmitting,
        
        // Acciones
        handleFiltersChange,
        getQueryParams,
        getActiveFiltersCount,
        setIsSubmitting
    }
} 