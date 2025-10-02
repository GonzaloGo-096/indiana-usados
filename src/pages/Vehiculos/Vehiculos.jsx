/**
 * Vehiculos - Página principal de vehículos con sistema de filtros unificado
 * 
 * @author Indiana Usados
 * @version 3.2.0 - Título "Nuestros Usados" restaurado
 */

import React, { useEffect, useState, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { parseFilters, serializeFilters, hasAnyFilter } from '@utils'
import { useVehiclesList } from '@hooks'
import { AutosGrid } from '@vehicles'
import LazyFilterForm from '@vehicles/Filters/LazyFilterForm'
import { useScrollPosition } from '@hooks/useScrollPosition'
import styles from './Vehiculos.module.css'

const Vehiculos = () => {
    const [sp, setSp] = useSearchParams()
    const navigate = useNavigate()
    const [isUsingMockData, setIsUsingMockData] = useState(false)
    const filterFormRef = useRef(null)

    // ✅ NUEVO: Hook para restaurar scroll
    const { restoreScrollPosition } = useScrollPosition({
        key: 'vehicles-list',
        enabled: true
    })


    // ✅ NUEVO: Restaurar scroll cuando el componente se monte
    useEffect(() => {
        // Pequeño delay para asegurar que el DOM esté renderizado
        const timer = setTimeout(() => {
            restoreScrollPosition()
        }, 100)
        
        return () => clearTimeout(timer)
    }, [restoreScrollPosition])

    // ✅ NUEVO: Parsear filtros del querystring
    const filters = parseFilters(sp)
    const isFiltered = hasAnyFilter(filters)

    // ✅ NUEVO: Hook unificado para vehículos
    const { vehicles, total, hasNextPage, loadMore, isLoadingMore, isLoading, isError, error, refetch } = useVehiclesList(filters)



    // ✅ NUEVO: Detectar si se están usando datos mock
    useEffect(() => {
        if (vehicles.length > 0 && vehicles[0]?.id?.startsWith('mock-')) {
            setIsUsingMockData(true)
        } else {
            setIsUsingMockData(false)
        }
    }, [vehicles])

    // ✅ Handlers para filtros
    const onApply = (newFilters) => {
        // Aplicar filtros de forma declarativa
        setSp(serializeFilters(newFilters), { replace: false })
    }
    const onClear = () => {
        setSp(new URLSearchParams(), { replace: false })
    }

    // ✅ NUEVO: Handler para el botón Filtrar del título (toggle)
    const handleFilterClick = () => {
        if (filterFormRef.current) {
            filterFormRef.current.toggleFilters()
        }
    }

    return (
        <div className={styles.container}>
            {/* ✅ NUEVO: Indicador de datos mock */}
            {isUsingMockData && (
                <div style={{
                    backgroundColor: '#fff3cd',
                    border: '1px solid #ffeaa7',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    marginBottom: '20px',
                    textAlign: 'center',
                    color: '#856404'
                }}>
                    <strong>📱 Modo Demostración</strong>
                    <br />
                    <small>Mostrando datos de ejemplo. Conecta tu backend para ver datos reales.</small>
                </div>
            )}

            {/* ✅ MODIFICADO: Título con botones en la misma línea */}
            <div className={styles.titleSection}>
                <h1 className={styles.mainTitle}>
                    Nuestros Usados
                </h1>
                
                <div className={styles.actionButtons}>
                    <button 
                        className={styles.actionButton}
                        onClick={handleFilterClick}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"></polygon>
                        </svg>
                        Filtrar
                    </button>
                    
                    <button 
                        className={styles.actionButton}
                        onClick={() => console.log('Ordenar clicked')}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18"></path>
                            <path d="M6 12h12"></path>
                            <path d="M9 18h6"></path>
                        </svg>
                        Ordenar
                    </button>
                </div>
            </div>

            {/* ✅ NUEVO: Formulario de filtros debajo del título */}
        <LazyFilterForm
          ref={filterFormRef}
          onApplyFilters={onApply}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={refetch}
        />

            {/* ✅ NUEVO: Grid de vehículos unificado */}
            <div className={styles.vehiclesGrid}>
                <AutosGrid
                    vehicles={vehicles}
                    isLoading={isLoading}
                    hasNextPage={hasNextPage}
                    isLoadingMore={isLoadingMore}
                    onLoadMore={loadMore}
                    total={total}
                    isError={isError}
                    error={error}
                />
            </div>

            {/* ✅ NUEVO: Botón para volver a lista principal */}
            {isFiltered && (
                <div className={styles.backButtonContainer}>
                    <button 
                        onClick={() => navigate('/vehiculos')}
                        className={styles.backButton}
                    >
                        Volver a lista principal
                    </button>
                </div>
            )}
        </div>
    )
}

export default Vehiculos 