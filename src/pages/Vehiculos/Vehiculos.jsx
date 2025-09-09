/**
 * Vehiculos - Página principal de vehículos con sistema de filtros unificado
 * 
 * @author Indiana Usados
 * @version 3.2.0 - Título "Nuestros Usados" restaurado
 */

import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { parseFilters, serializeFilters, hasAnyFilter } from '@utils'
import { useVehiclesList } from '@hooks'
import { FilterFormSimplified, AutosGrid } from '@vehicles'
import { useScrollPosition } from '@hooks/useScrollPosition'
import styles from './Vehiculos.module.css'

const Vehiculos = () => {
    const [sp, setSp] = useSearchParams()
    const navigate = useNavigate()
    const [isUsingMockData, setIsUsingMockData] = useState(false)

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

    // ✅ NUEVO: Handlers para filtros
    const onApply = (newFilters) => {
            setSp(serializeFilters(newFilters), { replace: false })
    }
    const onClear = () => {
        setSp(new URLSearchParams(), { replace: false })
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

            {/* ✅ NUEVO: Formulario de filtros simplificado */}
            <FilterFormSimplified 
                onApplyFilters={onApply}
                isLoading={isLoading}
            />

            {/* ✅ RESTAURADO: Título "Nuestros Usados" */}
            <div style={{
                textAlign: 'center',
                marginBottom: '30px',
                padding: '20px 0'
                /* ✅ ELIMINADO: borderBottom para quitar la línea */
            }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: '700',
                    color: '#333',
                    margin: '0',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                    Nuestros Usados
                </h1>
                <p style={{
                    fontSize: '1.1rem',
                    color: '#666',
                    margin: '10px 0 0 0',
                    fontStyle: 'italic'
                }}>
                    Encuentra el vehículo perfecto para ti
                </p>
            </div>

            {/* ✅ NUEVO: Grid de vehículos unificado */}
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

            {/* ✅ NUEVO: Botón para volver a lista principal */}
            {isFiltered && (
                <div style={{ marginTop: 16, textAlign: 'center' }}>
                    <button 
                        onClick={() => navigate('/vehiculos')}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Volver a lista principal
                    </button>
                </div>
            )}
        </div>
    )
}

export default Vehiculos 