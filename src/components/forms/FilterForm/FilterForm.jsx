/**
 * FilterForm - Formulario de filtros para catálogo de vehículos
 * 
 * Utiliza React Hook Form para manejo eficiente del estado del formulario
 * Todos los campos son opcionales y se aplican automáticamente al cambiar
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React, { forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { FormInput } from '../../ui/FormInput'
import { 
    FILTER_OPTIONS, 
    DEFAULT_FILTER_VALUES, 
    generateYearOptions 
} from '../../../constants/filterOptions'
import styles from './FilterForm.module.css'

const FilterForm = forwardRef(({ 
    onFiltersChange, 
    isSubmitting = false, 
    showClearButtonAtBottom = false, 
    initialValues,
    variant = 'desktop' // 'desktop' | 'mobile'
}, ref) => {
    // Configuración inicial de React Hook Form
    const { 
        register, 
        handleSubmit, 
        watch, 
        reset, 
        setValue,
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

    // Observar cambios en todos los campos inmediatamente
    const watchedValues = watch((data) => {
        onFiltersChange(data)
    })

    // Función para limpiar todos los filtros
    const handleClearFilters = () => {
        reset()
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

    // Función para manejar el submit
    const onSubmit = (data) => {
        console.log('Filtros aplicados:', data)
        onFiltersChange(data)
        // Aquí en el futuro se conectaría con la API
        // const queryParams = getQueryParams(data)
        // refetch({ queryParams })
    }

    // Obtener opciones desde constantes
    const { marcas, combustibles, transmisiones, colores } = FILTER_OPTIONS

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={`${styles.filterForm} ${styles[variant]}`}>
            {/* Header solo si el botón va arriba */}
            {!showClearButtonAtBottom && (
                <div className={styles.formHeader}>
                    <h3 className={styles.formTitle}>Filtrar Vehículos</h3>
                    <button 
                        type="button" 
                        onClick={handleClearFilters}
                        className={styles.clearButton}
                        disabled={isSubmitting}
                    >
                        Limpiar Filtros
                    </button>
                </div>
            )}

            <div className={styles.formGrid}>
                {/* Marca */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Marca</label>
                    <select 
                        {...register('marca')}
                        className={styles.select}
                        disabled={isSubmitting}
                    >
                        <option value="">Todas las marcas</option>
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
                        disabled={isSubmitting}
                    >
                        <option value="">Cualquier año</option>
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
                        disabled={isSubmitting}
                    >
                        <option value="">Cualquier año</option>
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
                        disabled={isSubmitting}
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
                        placeholder="Sin límite"
                        {...register('precioHasta', {
                            min: { value: 0, message: 'El precio debe ser mayor a 0' }
                        })}
                        className={styles.input}
                        disabled={isSubmitting}
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
                        disabled={isSubmitting}
                    >
                        <option value="">Todos los combustibles</option>
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
                        disabled={isSubmitting}
                    >
                        <option value="">Todas las transmisiones</option>
                        {transmisiones.map(transmision => (
                            <option key={transmision} value={transmision}>{transmision}</option>
                        ))}
                    </select>
                </div>

                {/* Kilometraje Desde */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Kilometraje Desde (km)</label>
                    <input
                        type="number"
                        placeholder="0"
                        {...register('kilometrajeDesde', {
                            min: { value: 0, message: 'El kilometraje debe ser mayor a 0' }
                        })}
                        className={styles.input}
                        disabled={isSubmitting}
                    />
                    {errors.kilometrajeDesde && (
                        <span className={styles.error}>{errors.kilometrajeDesde.message}</span>
                    )}
                </div>

                {/* Kilometraje Hasta */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Kilometraje Hasta (km)</label>
                    <input
                        type="number"
                        placeholder="Sin límite"
                        {...register('kilometrajeHasta', {
                            min: { value: 0, message: 'El kilometraje debe ser mayor a 0' }
                        })}
                        className={styles.input}
                        disabled={isSubmitting}
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
                        disabled={isSubmitting}
                    >
                        <option value="">Todos los colores</option>
                        {colores.map(color => (
                            <option key={color} value={color}>{color}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Botón Aplicar Filtros en desktop */}
            {!showClearButtonAtBottom && (
                <div className={styles.desktopActions}>
                    <button 
                        type="submit"
                        className={styles.applyButton}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Aplicando...' : 'Aplicar Filtros'}
                    </button>
                </div>
            )}

            {/* Botones de acción en mobile */}
            {showClearButtonAtBottom && (
                <div className={styles.actionButtons}>
                    <button 
                        type="submit"
                        className={styles.applyButton}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Aplicando...' : 'Aplicar Filtros'}
                    </button>
                    
                    <button 
                        type="button" 
                        onClick={handleClearFilters}
                        className={styles.clearButtonBottom}
                        disabled={isSubmitting}
                    >
                        Limpiar Filtros
                    </button>
                </div>
            )}
        </form>
    )
})

export default FilterForm 