/**
 * ListAutos - Componente principal para lista de vehículos
 * 
 * Responsabilidades:
 * - Layout y estructura visual
 * - Integración de componentes de filtros
 * - Renderizado del grid de autos
 * - Manejo directo de datos sin contexto
 * - Paginación infinita con scroll automático
 * 
 * @author Indiana Usados
 * @version 10.2.0 - CORREGIDO PARA NUEVA API
 */

import React, { memo, useState, useCallback } from 'react'
import { useGetCars } from '../../../hooks/useGetCars'
import FilterFormSimplified from '../../filters/FilterFormSimplified/FilterFormSimplified'
import AutosGrid from './AutosGrid'
import styles from './ListAutos.module.css'

/**
 * Componente principal con manejo directo de datos
 */
const ListAutos = memo(() => {
    const [isFiltering, setIsFiltering] = useState(false)
    
    // ✅ CORREGIDO: Usar nueva API de useGetCars
    const {
        cars,                    // ✅ CORREGIDO: Se llama 'cars'
        isLoading,
        isError,
        error,
        hasNextPage,
        isFetchingNextPage,
        onLoadMore,              // ✅ CORREGIDO: Se llama 'onLoadMore'
        refetch
    } = useGetCars({}, 12)       // ✅ CORREGIDO: Solo filtros y pageSize

    // ✅ CORREGIDO: Función para aplicar filtros
    const applyFilters = useCallback(async (filters) => {
        setIsFiltering(true)
        try {
            // Aquí iría la lógica para aplicar filtros al backend
            // Por ahora, solo simulamos la aplicación
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // Refetch para obtener datos actualizados
            await refetch()
            
        } catch (error) {
            console.error('❌ Error al aplicar filtros:', error)
            throw error
        } finally {
            setIsFiltering(false)
        }
    }, [refetch])

    // ===== RENDERIZADO =====
    
    return (
        <div className={styles.container}>
            {/* ===== FILTROS SIMPLIFICADOS ===== */}
            <FilterFormSimplified 
                onApplyFilters={applyFilters}
                isLoading={isLoading || isFiltering}
            />

            {/* ===== CONTENEDOR DE LISTA CON TÍTULO ===== */}
            <div className={styles.listContainer}>
                {/* Línea vertical sutil */}
                <div className={styles.verticalLine}></div>
                
                {/* Título principal */}
                <div className={styles.titleSection}>
                    <h1 className={styles.mainTitle}>Nuestros Usados</h1>
                </div>

                {/* ===== GRID DE VEHÍCULOS ===== */}
                <div className={styles.content}>
                                    <AutosGrid 
                    autos={cars}
                    isLoading={isLoading}
                    isError={isError}
                    error={error}
                    onLoadMore={onLoadMore}
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    onRetry={refetch}
                />
                </div>
            </div>
        </div>
    )
})

// ✅ AGREGADO: Display name para debugging
ListAutos.displayName = 'ListAutos'

export default ListAutos