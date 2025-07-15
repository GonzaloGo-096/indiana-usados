/**
 * FilterDrawer - Drawer lateral para mostrar filtros en dispositivos móviles
 * 
 * Se desliza desde la derecha y contiene el formulario de filtros
 * Incluye overlay para cerrar al hacer clic fuera del drawer
 * 
 * @author Indiana Usados
 * @version 3.0.0
 */

import React, { useEffect } from 'react'
import FilterForm from '../FilterForm/FilterForm'
import styles from './FilterDrawer.module.css'

const FilterDrawer = ({ 
    isOpen, 
    onClose, 
    onFiltersChange, 
    onApplyFilters,
    isSubmitting = false,
    initialValues
}) => {
    // Cerrar drawer con Escape
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            // Prevenir scroll del body cuando el drawer está abierto
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    // Si no está abierto, no renderizar nada
    if (!isOpen) return null

    return (
        <>
            {/* Overlay para cerrar al hacer clic fuera */}
            <div 
                className={styles.overlay}
                onClick={onClose}
                aria-label="Cerrar filtros"
            />
            
            {/* Drawer */}
            <div className={styles.drawer}>
                <div className={styles.drawerHeader}>
                    <h2 className={styles.drawerTitle}>Filtrar Vehículos</h2>
                    <button 
                        onClick={onClose}
                        className={styles.closeButton}
                        aria-label="Cerrar filtros"
                    >
                        <svg 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2"
                        >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                
                <div className={styles.drawerContent}>
                    <FilterForm 
                        variant="mobile"
                        initialValues={initialValues}
                        onFiltersChange={onFiltersChange}
                        onApplyFilters={onApplyFilters}
                        isLoading={false}
                        isFiltering={isSubmitting}
                        showClearButtonAtBottom={true}
                        showApplyButton={true}
                    />
                </div>
            </div>
        </>
    )
}

export default FilterDrawer 