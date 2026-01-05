/**
 * Vehiculos - Página principal de vehículos
 * 
 * Responsabilidades:
 * - Orquestación de URL state (filtros y sorting sincronizados con URL)
 * - Coordinación entre FilterFormSimple, AutosGrid y SortDropdown
 * - Manejo de sorting local (ordenamiento en frontend)
 * - Detección de datos mock para desarrollo
 * - Layout y renderizado de la página completa
 * 
 * Arquitectura:
 * - Esta página orquesta múltiples responsabilidades por diseño
 * - Es normal que una página conecte URL, estado local y componentes hijos
 * - La complejidad real es baja-media (182 líneas, bien organizada)
 * - La lógica pesada (fetch, paginación, cache) está delegada a useVehiclesList hook
 * - URL es la fuente de verdad para filtros (single source of truth)
 * 
 * Flujo de datos:
 * - URL → parseFilters → useVehiclesList → Backend → Página → UI
 * - Usuario → Filtros → URL → Re-fetch → Actualizar UI
 * - Usuario → Sorting → Estado local → Re-ordenar → Actualizar UI
 * 
 * Nota sobre Testing:
 * - Testing se recomienda a nivel de integración
 * - Validar flujo completo: URL → filtros → fetch → display → sorting
 * - Testing unitario de handlers individuales tiene valor limitado
 * - Simular cambios de URL y verificar comportamiento de componentes hijos
 * 
 * Nota sobre Documentación:
 * - Ver docs/GUIA_DIDACTICA_PAGINA_VEHICULOS.md para explicación detallada
 * - La guía explica paso a paso cómo funciona cada parte
 * 
 * @author Indiana Usados
 * @version 3.3.0 - Documentación mejorada: responsabilidades, arquitectura y flujos
 */

import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { parseFilters, serializeFilters, hasAnyFilter, sortVehicles } from '@utils'
import { useVehiclesList } from '@hooks'
import { AutosGrid, BrandsCarousel } from '@vehicles'
import FilterFormSimple from '@vehicles/Filters/FilterFormSimple'
import SortDropdown from '@vehicles/Filters/SortDropdown'
import { VehiclesListSEOHead } from '@components/SEO'
import styles from './Vehiculos.module.css'

const Vehiculos = () => {
    const [sp, setSp] = useSearchParams()
    const navigate = useNavigate()
    const [isUsingMockData, setIsUsingMockData] = useState(false)
    const filterFormRef = useRef(null)
    const sortButtonRef = useRef(null)
    
    // ✅ SIMPLIFICADO: Estado de sorting simple
    const [selectedSort, setSelectedSort] = useState(null)
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
    
    // ✅ NUEVO: Estado local para marca cuando el formulario está abierto
    const [localMarca, setLocalMarca] = useState(null)

    // ✅ SIMPLIFICADO: Sincronización con URL para sorting
    useEffect(() => {
        setSelectedSort(sp.get('sort'))
    }, [sp])

    // ✅ OPTIMIZADO: Parsear filtros del querystring (memoizado)
    const urlFilters = useMemo(() => {
        return parseFilters(sp)
    }, [sp.toString()])

    // ✅ OPTIMIZADO: Verificar si hay filtros activos (memoizado)
    const isFiltered = useMemo(() => {
        return hasAnyFilter(urlFilters)
    }, [urlFilters])
    
    // ✅ NUEVO: Determinar si el formulario está visible
    const isFiltersVisible = filterFormRef.current?.isFiltersVisible || false
    
    // ✅ OPTIMIZADO: Obtener marca actual (memoizado)
    const currentMarca = useMemo(() => {
        return isFiltersVisible && localMarca !== null ? localMarca : (urlFilters.marca || [])
    }, [isFiltersVisible, localMarca, urlFilters.marca])
    
    // ✅ OPTIMIZADO: Filtros combinados (memoizado)
    const filters = useMemo(() => {
        return { ...urlFilters, marca: currentMarca }
    }, [urlFilters, currentMarca])

    // ✅ NUEVO: Hook unificado para vehículos (siempre usa URL como fuente de verdad para fetch)
    const { vehicles, total, hasNextPage, loadMore, isLoadingMore, isLoading, isError, error, refetch } = useVehiclesList(urlFilters)

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

    // ✅ OPTIMIZADO: Handlers para filtros (memoizados)
    const onApply = useCallback((newFilters) => {
        // Aplicar filtros de forma declarativa
        setSp(serializeFilters(newFilters), { replace: false })
    }, [setSp])
    
    const onClear = useCallback(() => {
        setSp(new URLSearchParams(), { replace: false })
    }, [setSp])

    // ✅ OPTIMIZADO: Handler para el botón Filtrar del título (toggle, memoizado)
    const handleFilterClick = useCallback(() => {
        if (filterFormRef.current) {
            filterFormRef.current.toggleFilters()
        }
    }, [])

    // ✅ NUEVO: Handler para selección de marca en carrusel
    const handleBrandSelect = (brandName) => {
        const isFiltersVisible = filterFormRef.current?.isFiltersVisible || false
        
        if (isFiltersVisible) {
            // Panel abierto: obtener estado actual del formulario (puede tener cambios no guardados)
            const currentFilters = filterFormRef.current?.getCurrentFilters?.() || { marca: [] }
            const currentMarcaList = currentFilters.marca || []
            const isSelected = currentMarcaList.includes(brandName)
            const newMarca = isSelected 
                ? currentMarcaList.filter(m => m !== brandName) // Deseleccionar: remover del array
                : [...currentMarcaList, brandName] // Seleccionar: agregar al array existente
            
            // Actualizar estado local del padre
            setLocalMarca(newMarca)
            
            // Actualizar estado del formulario sin submit inmediato
            if (filterFormRef.current?.updateMarcaFilter) {
                filterFormRef.current.updateMarcaFilter(newMarca)
            }
        } else {
            // Panel cerrado: actualizar URL directamente (dispara fetch automático)
            const currentMarcaList = urlFilters.marca || []
            const isSelected = currentMarcaList.includes(brandName)
            const newMarca = isSelected 
                ? currentMarcaList.filter(m => m !== brandName) // Deseleccionar: remover del array
                : [...currentMarcaList, brandName] // Seleccionar: agregar al array existente
            
            const newFilters = { ...urlFilters, marca: newMarca }
            setSp(serializeFilters(newFilters), { replace: false })
        }
    }

    // ✅ OPTIMIZADO: Handlers para sorting (memoizados)
    const handleSortClick = useCallback(() => {
        setIsSortDropdownOpen(!isSortDropdownOpen)
    }, [isSortDropdownOpen])
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
    const handleCloseSortDropdown = useCallback(() => {
        setIsSortDropdownOpen(false)
    }, [])

    return (
        <div className={styles.page}>
            <VehiclesListSEOHead vehicleCount={total} />
            
            {/* ✅ Título en contenedor independiente */}
            <div className={styles.titleContainer}>
                {/* ✅ Banner de datos mock */}
                {isUsingMockData && (
                    <div className={styles.mockDataBanner}>
                        <strong>📱 Modo Demostración</strong>
                        <small>Mostrando datos de ejemplo. Conecta tu backend para ver datos reales.</small>
                    </div>
                )}

                {/* ✅ MODIFICADO: Título sin botones */}
                <div className={styles.titleSection}>
                    <h1 className={styles.mainTitle}>
                        Nuestros Usados
                    </h1>
                </div>
            </div>

            {/* ✅ NUEVO: Sección del carrusel a todo el ancho con botones integrados */}
            <div className={styles.carouselSection}>
                <BrandsCarousel 
                    selectedBrands={currentMarca}
                    onBrandSelect={handleBrandSelect}
                    isFiltersVisible={isFiltersVisible}
                />
                
                {/* ✅ Formulario de filtros entre carrusel y botones */}
                <div className={styles.filtersWrapper}>
                    <FilterFormSimple
                        ref={filterFormRef}
                        onApplyFilters={onApply}
                        isLoading={isLoading}
                        isError={isError}
                        error={error}
                        onRetry={refetch}
                    />
                </div>
                
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
                            ref={sortButtonRef}
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
                            triggerRef={sortButtonRef}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.container}>

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
                        onClick={() => navigate('/usados')}
                        className={styles.backButton}
                    >
                        Volver a lista principal
                    </button>
                </div>
            )}
            </div>
        </div>
    )
}

export default Vehiculos 