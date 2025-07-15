/**
 * FilterForm - Formulario de filtros para catálogo de vehículos
 * 
 * Utiliza React Hook Form para manejo eficiente del estado del formulario
 * Los filtros se aplican manualmente con botón
 * 
 * @author Indiana Usados
 * @version 3.0.0
 */

import React, { forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { 
    FILTER_OPTIONS, 
    DEFAULT_FILTER_VALUES, 
    generateYearOptions 
} from '../../../constants'
import styles from './FilterForm.module.css'

const FilterForm = forwardRef(({ 
    onFiltersChange, 
    onApplyFilters,
    isLoading = false, 
    isFiltering = false,
    showClearButtonAtBottom = false, 
    showApplyButton = true,
    initialValues,
    variant = 'desktop' // 'desktop' | 'mobile'
}, ref) => {
    // Configuración inicial de React Hook Form
    const { 
        register, 
        watch, 
        reset, 
        setValue,
        handleSubmit,
        formState: { errors } 
    } = useForm({
        defaultValues: initialValues || DEFAULT_FILTER_VALUES
    })

    // Sincronizar con valores externos cuando cambien
    React.useEffect(() => {
        if (initialValues && Object.keys(initialValues).length > 0) {
            // Solo actualizar si los valores son diferentes
            const currentValues = watch()
            const hasChanges = Object.entries(initialValues).some(([key, value]) => 
                currentValues[key] !== value
            )
            
            if (hasChanges) {
                Object.entries(initialValues).forEach(([key, value]) => {
                    setValue(key, value, { shouldValidate: false, shouldDirty: false })
                })
            }
        }
    }, [initialValues, setValue, watch])

    // Observar cambios en todos los campos
    const watchedValues = watch((data) => {
        onFiltersChange(data) // Solo actualiza estado pendiente
    })

    // Función para limpiar todos los filtros
    const handleClearFilters = () => {
        reset(DEFAULT_FILTER_VALUES)
        onFiltersChange(DEFAULT_FILTER_VALUES)
    }

    // Función para aplicar filtros
    const handleApplyFilters = (data) => {
        onApplyFilters(data)
    }

    // Exponer funciones para uso externo
    useImperativeHandle(ref, () => ({
        reset: handleClearFilters,
        setValues: (values) => {
            Object.entries(values).forEach(([key, value]) => {
                setValue(key, value)
            })
        },
        getValues: () => watchedValues
    }), [setValue, watchedValues])

    // Obtener opciones desde constantes
    const { marcas, combustibles, transmisiones, colores } = FILTER_OPTIONS

    return (
        <form onSubmit={handleSubmit(handleApplyFilters)} className={`${styles.filterForm} ${styles[variant]}`}>
            {/* Header solo si el botón va arriba */}
            {!showClearButtonAtBottom && (
                <div className={styles.formHeader}>
                    <h3 className={styles.formTitle}>Filtrar Vehículos</h3>
                    <div className={styles.headerButtons}>
                        <button 
                            type="button" 
                            onClick={handleClearFilters}
                            className={styles.clearButton}
                            disabled={isLoading || isFiltering}
                        >
                            Limpiar Filtros
                        </button>
                        {showApplyButton && (
                            <button 
                                type="submit"
                                className={styles.applyButtonHeader}
                                disabled={isLoading || isFiltering}
                            >
                                {isFiltering ? 'Aplicando...' : 'Aplicar Filtros'}
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div className={styles.formGrid}>
                {/* Marca */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Marca</label>
                    <select 
                        {...register('marca')}
                        className={styles.select}
                        disabled={isLoading || isFiltering}
                    >
                        <option value="">--Seleccione--</option>
                        {marcas.map(marca => (
                            <option key={marca} value={marca}>{marca}</option>
                        ))}
                    </select>
                </div>

                {/* Año Desde */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Año Desde</label>
                    <select 
                        {...register('añoDesde')}
                        className={styles.select}
                        disabled={isLoading || isFiltering}
                    >
                        <option value="">0</option>
                        {generateYearOptions().map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                {/* Año Hasta */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Año Hasta</label>
                    <select 
                        {...register('añoHasta')}
                        className={styles.select}
                        disabled={isLoading || isFiltering}
                    >
                        <option value="">--Hasta--</option>
                        {generateYearOptions().map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                {/* Precio Desde */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Precio Desde ($)</label>
                    <input
                        type="number"
                        placeholder="0"
                        {...register('precioDesde', {
                            min: { value: 0, message: 'El precio debe ser mayor a 0' }
                        })}
                        className={styles.input}
                        disabled={isLoading || isFiltering}
                    />
                    {errors.precioDesde && (
                        <span className={styles.error}>{errors.precioDesde.message}</span>
                    )}
                </div>

                {/* Precio Hasta */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Precio Hasta ($)</label>
                    <input
                        type="number"
                        placeholder="--Hasta--"
                        {...register('precioHasta', {
                            min: { value: 0, message: 'El precio debe ser mayor a 0' }
                        })}
                        className={styles.input}
                        disabled={isLoading || isFiltering}
                    />
                    {errors.precioHasta && (
                        <span className={styles.error}>{errors.precioHasta.message}</span>
                    )}
                </div>

                {/* Combustible */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Combustible</label>
                    <select 
                        {...register('combustible')}
                        className={styles.select}
                        disabled={isLoading || isFiltering}
                    >
                        <option value="">--Seleccione--</option>
                        {combustibles.map(combustible => (
                            <option key={combustible} value={combustible}>{combustible}</option>
                        ))}
                    </select>
                </div>

                {/* Transmisión */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Transmisión</label>
                    <select 
                        {...register('transmision')}
                        className={styles.select}
                        disabled={isLoading || isFiltering}
                    >
                        <option value="">--Seleccione--</option>
                        {transmisiones.map(transmision => (
                            <option key={transmision} value={transmision}>{transmision}</option>
                        ))}
                    </select>
                </div>

                {/* Kilometraje Desde */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Kms Desde</label>
                    <input
                        type="number"
                        placeholder="0"
                        {...register('kilometrajeDesde', {
                            min: { value: 0, message: 'El kilometraje debe ser mayor a 0' }
                        })}
                        className={styles.input}
                        disabled={isLoading || isFiltering}
                    />
                    {errors.kilometrajeDesde && (
                        <span className={styles.error}>{errors.kilometrajeDesde.message}</span>
                    )}
                </div>

                {/* Kilometraje Hasta */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Kms Hasta</label>
                    <input
                        type="number"
                        placeholder="--Hasta--"
                        {...register('kilometrajeHasta', {
                            min: { value: 0, message: 'El kilometraje debe ser mayor a 0' }
                        })}
                        className={styles.input}
                        disabled={isLoading || isFiltering}
                    />
                    {errors.kilometrajeHasta && (
                        <span className={styles.error}>{errors.kilometrajeHasta.message}</span>
                    )}
                </div>

                {/* Color */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Color</label>
                    <select 
                        {...register('color')}
                        className={styles.select}
                        disabled={isLoading || isFiltering}
                    >
                        <option value="">--Seleccione--</option>
                        {colores.map(color => (
                            <option key={color} value={color}>{color}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Botones para mobile */}
            {showClearButtonAtBottom && (
                <div className={styles.actionButtons}>
                    <button 
                        type="submit"
                        className={styles.applyButton}
                        disabled={isLoading || isFiltering}
                    >
                        {isFiltering ? 'Aplicando...' : 'Aplicar Filtros'}
                    </button>
                    <button 
                        type="button" 
                        onClick={handleClearFilters}
                        className={styles.clearButtonBottom}
                        disabled={isLoading || isFiltering}
                    >
                        Limpiar Filtros
                    </button>
                </div>
            )}
        </form>
    )
})

FilterForm.displayName = 'FilterForm'

export default FilterForm 