/**
 * Vehiculos - Página principal de vehículos con sistema de filtros unificado
 * 
 * @author Indiana Usados
 * @version 3.2.0 - Título "Nuestros Usados" restaurado
 */

import React, { useEffect, useState, useRef, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { parseFilters, serializeFilters, hasAnyFilter, sortVehicles } from '@utils'
import { useVehiclesList } from '@hooks'
import { AutosGrid } from '@vehicles'
import LazyFilterFormSimple from '@vehicles/Filters/LazyFilterFormSimple'
import SortDropdown from '@vehicles/Filters/SortDropdown'
import styles from './Vehiculos.module.css'

const Vehiculos = () => {
    const [sp, setSp] = useSearchParams()
    const navigate = useNavigate()
    const [isUsingMockData, setIsUsingMockData] = useState(false)
    const filterFormRef = useRef(null)
    
    // ✅ SIMPLIFICADO: Estado de sorting simple
    const [selectedSort, setSelectedSort] = useState(null)
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)

    // ✅ SIMPLIFICADO: Sincronización con URL para sorting
    useEffect(() => {
        setSelectedSort(sp.get('sort'))
    }, [sp])

    // ✅ NUEVO: Parsear filtros del querystring
    const filters = parseFilters(sp)
    const isFiltered = hasAnyFilter(filters)

    // ✅ NUEVO: Hook unificado para vehículos
    const { vehicles, total, hasNextPage, loadMore, isLoadingMore, isLoading, isError, error, refetch } = useVehiclesList(filters)

    // ✅ SIMPLIFICADO: Vehículos ordenados
    const sortedVehicles = useMemo(() => {
        return sortVehicles(vehicles, selectedSort)
    }, [vehicles, selectedSort])



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

    // ✅ SIMPLIFICADO: Handlers para sorting
    const handleSortClick = () => setIsSortDropdownOpen(!isSortDropdownOpen)
    const handleSortChange = (sortOption) => {
        setSelectedSort(sortOption)
        setIsSortDropdownOpen(false)
        const newParams = new URLSearchParams(sp)
        if (sortOption) {
            newParams.set('sort', sortOption)
        } else {
            newParams.delete('sort')
        }
        setSp(newParams, { replace: true })
    }
    const handleCloseSortDropdown = () => setIsSortDropdownOpen(false)

    return (
        <div className={styles.container}>
            {/* ✅ Banner de datos mock */}
            {isUsingMockData && (
                <div className={styles.mockDataBanner}>
                    <strong>📱 Modo Demostración</strong>
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
                    
                    <div style={{ position: 'relative' }}>
                        <button 
                            className={`${styles.actionButton} ${selectedSort ? styles.active : ''}`}
                            onClick={handleSortClick}
                            disabled={isLoading || isLoadingMore}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 6h18"></path>
                                <path d="M6 12h12"></path>
                                <path d="M9 18h6"></path>
                            </svg>
                            Ordenar
                        </button>
                        
                        <SortDropdown
                            isOpen={isSortDropdownOpen}
                            selectedSort={selectedSort}
                            onSortChange={handleSortChange}
                            onClose={handleCloseSortDropdown}
                            disabled={isLoading || isLoadingMore}
                        />
                    </div>
                </div>
            </div>

            {/* ✅ NUEVO: Formulario de filtros debajo del título */}
        <LazyFilterFormSimple
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
                    vehicles={sortedVehicles}
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