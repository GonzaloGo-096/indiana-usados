/**
 * FilterForm - Formulario de filtros para catálogo de vehículos
 * 
 * Utiliza React Hook Form para manejo eficiente del estado del formulario
 * Los filtros se aplican manualmente con botón
 * 
 * @author Indiana Usados
 * @version 3.0.0
 */

import React, { forwardRef, useImperativeHandle, useState, useRef, useCallback, memo } from 'react'
import { useForm } from 'react-hook-form'
import { 
    FILTER_OPTIONS, 
    DEFAULT_FILTER_VALUES, 
    generateYearOptions 
} from '../../../constants'
import styles from './FilterForm.module.css'

const FilterForm = memo(forwardRef(({ 
    onFiltersChange, 
    onApplyFilters,
    isLoading = false, 
    isFiltering = false,
    showClearButtonAtBottom = false, 
    showApplyButton = true,
    initialValues,
    variant = 'desktop', // 'desktop' | 'mobile'
    filterSummary
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

    // ===== FUNCIONES MEMOIZADAS =====
    
    // Función para limpiar todos los filtros - MEMOIZADA
    const handleClearFilters = useCallback(() => {
        reset(DEFAULT_FILTER_VALUES)
        onFiltersChange(DEFAULT_FILTER_VALUES)
    }, [reset, onFiltersChange])

    // Función para aplicar filtros - MEMOIZADA
    const handleApplyFilters = useCallback((data) => {
        onApplyFilters(data)
    }, [onApplyFilters])

    // Exponer funciones para uso externo
    useImperativeHandle(ref, () => ({
        reset: handleClearFilters,
        setValues: (values) => {
            Object.entries(values).forEach(([key, value]) => {
                setValue(key, value)
            })
        },
        getValues: () => watchedValues,
        clearField: (key) => setValue(key, '')
    }), [setValue, watchedValues, handleClearFilters])

    // Obtener opciones desde constantes
    const { marcas, combustibles, transmisiones, colores } = FILTER_OPTIONS

    // Estado para dropdown de marcas
    const [isMarcaOpen, setIsMarcaOpen] = useState(false);
    const marcaRef = useRef();
    const marcasSeleccionadas = watch('marca') || [];

    // Manejar selección de marcas - MEMOIZADA
    const handleMarcaChange = useCallback((marca) => {
        let nuevas;
        if (marcasSeleccionadas.includes(marca)) {
            nuevas = marcasSeleccionadas.filter(m => m !== marca);
        } else {
            nuevas = [...marcasSeleccionadas, marca];
        }
        setValue('marca', nuevas);
        onFiltersChange({ ...watch(), marca: nuevas });
    }, [marcasSeleccionadas, setValue, onFiltersChange, watch])

    // Cerrar dropdown al hacer clic fuera
    React.useEffect(() => {
        function handleClickOutside(event) {
            if (marcaRef.current && !marcaRef.current.contains(event.target)) {
                setIsMarcaOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Estado para dropdown de combustibles
    const [isCombustibleOpen, setIsCombustibleOpen] = useState(false);
    const combustibleRef = useRef();
    const combustiblesSeleccionados = watch('combustible') || [];

    // Manejar selección de combustibles - MEMOIZADA
    const handleCombustibleChange = useCallback((combustible) => {
        let nuevas;
        if (combustiblesSeleccionados.includes(combustible)) {
            nuevas = combustiblesSeleccionados.filter(c => c !== combustible);
        } else {
            nuevas = [...combustiblesSeleccionados, combustible];
        }
        setValue('combustible', nuevas);
        onFiltersChange({ ...watch(), combustible: nuevas });
    }, [combustiblesSeleccionados, setValue, onFiltersChange, watch])

    // Cerrar dropdown al hacer clic fuera
    React.useEffect(() => {
        function handleClickOutside(event) {
            if (combustibleRef.current && !combustibleRef.current.contains(event.target)) {
                setIsCombustibleOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Estado para dropdown de transmisiones
    const [isTransmisionOpen, setIsTransmisionOpen] = useState(false);
    const transmisionRef = useRef();
    const transmisionesSeleccionadas = watch('transmision') || [];

    // Manejar selección de transmisiones - MEMOIZADA
    const handleTransmisionChange = useCallback((transmision) => {
        let nuevas;
        if (transmisionesSeleccionadas.includes(transmision)) {
            nuevas = transmisionesSeleccionadas.filter(t => t !== transmision);
        } else {
            nuevas = [...transmisionesSeleccionadas, transmision];
        }
        setValue('transmision', nuevas);
        onFiltersChange({ ...watch(), transmision: nuevas });
    }, [transmisionesSeleccionadas, setValue, onFiltersChange, watch])

    // Cerrar dropdown al hacer clic fuera
    React.useEffect(() => {
        function handleClickOutside(event) {
            if (transmisionRef.current && !transmisionRef.current.contains(event.target)) {
                setIsTransmisionOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Estado y lógica para Color
    const [isColorOpen, setIsColorOpen] = useState(false);
    const colorRef = useRef();
    const coloresSeleccionados = watch('color') || [];
    
    // Manejar selección de colores - MEMOIZADA
    const handleColorChange = useCallback((color) => {
        let nuevas;
        if (coloresSeleccionados.includes(color)) {
            nuevas = coloresSeleccionados.filter(c => c !== color);
        } else {
            nuevas = [...coloresSeleccionados, color];
        }
        setValue('color', nuevas);
        onFiltersChange({ ...watch(), color: nuevas });
    }, [coloresSeleccionados, setValue, onFiltersChange, watch])

    React.useEffect(() => {
        function handleClickOutside(event) {
            if (colorRef.current && !colorRef.current.contains(event.target)) {
                setIsColorOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <form onSubmit={handleSubmit(handleApplyFilters)} className={`${styles.filterForm} ${styles[variant]}`}>
            {/* FilterSummary integrado arriba del formulario en mobile */}
            {filterSummary && variant === 'mobile' && (
                <div style={{ marginBottom: 8 }}>
                    {filterSummary}
                </div>
            )}

            {/* Header del formulario */}
            <div className={styles.formHeader}>
                <div>
                    <h3 className={styles.formTitle}>Filtros</h3>
                </div>
                <div>
                    <button 
                        type="button" 
                        onClick={handleClearFilters}
                        className={styles.clearButton}
                        disabled={isLoading || isFiltering}
                    >
                        Limpiar
                    </button>
                    {showApplyButton && (
                        <button 
                            type="submit"
                            className={styles.applyButtonHeader}
                            disabled={isLoading || isFiltering}
                        >
                            Aplicar
                        </button>
                    )}
                </div>
            </div>

            <div className={styles.formGrid}>
                {/* Marca (dropdown custom con checkboxes) */}
                <div className={`${styles.formGroup} ${styles.dropdownGroup}`} ref={marcaRef}>
                    <label className={styles.label}>Marca</label>
                    <div className={`${styles.dropdownMulti} ${styles.dropdownMarca}`}>
                        <div
                            className={styles.dropdownMultiInput}
                            tabIndex={0}
                            onClick={() => setIsMarcaOpen((open) => !open)}
                        >
                            <span>--Seleccione--</span>
                            <span className={styles.dropdownArrow}>&#9660;</span>
                        </div>
                        {isMarcaOpen && (
                            <div className={styles.dropdownList}>
                                {marcas.map(marca => (
                                    <div key={marca} className={styles.dropdownOption}>
                                        <input
                                            type="checkbox"
                                            className={styles.dropdownCheckbox}
                                            checked={marcasSeleccionadas.includes(marca)}
                                            onChange={() => handleMarcaChange(marca)}
                                            id={`marca-${marca}`}
                                        />
                                        <label htmlFor={`marca-${marca}`}>{marca}</label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Combustible */}
                <div className={`${styles.formGroup} ${styles.dropdownGroup}`} ref={combustibleRef}>
                    <label className={styles.label}>Combustible</label>
                    <div className={`${styles.dropdownMulti} ${styles.dropdownCombustible}`}>
                        <div
                            className={styles.dropdownMultiInput}
                            tabIndex={0}
                            onClick={() => setIsCombustibleOpen((open) => !open)}
                        >
                            <span>--Seleccione--</span>
                            <span className={styles.dropdownArrow}>&#9660;</span>
                        </div>
                        {isCombustibleOpen && (
                            <div className={styles.dropdownList}>
                                {combustibles.map(combustible => (
                                    <div key={combustible} className={styles.dropdownOption}>
                                        <input
                                            type="checkbox"
                                            className={styles.dropdownCheckbox}
                                            checked={combustiblesSeleccionados.includes(combustible)}
                                            onChange={() => handleCombustibleChange(combustible)}
                                            id={`combustible-${combustible}`}
                                        />
                                        <label htmlFor={`combustible-${combustible}`}>{combustible}</label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Transmisión */}
                <div className={`${styles.formGroup} ${styles.dropdownGroup}`} ref={transmisionRef}>
                    <label className={styles.label}>Transmisión</label>
                    <div className={`${styles.dropdownMulti} ${styles.dropdownTransmision}`}>
                        <div
                            className={styles.dropdownMultiInput}
                            tabIndex={0}
                            onClick={() => setIsTransmisionOpen((open) => !open)}
                        >
                            <span>--Seleccione--</span>
                            <span className={styles.dropdownArrow}>&#9660;</span>
                        </div>
                        {isTransmisionOpen && (
                            <div className={styles.dropdownList}>
                                {transmisiones.map(transmision => (
                                    <div key={transmision} className={styles.dropdownOption}>
                                        <input
                                            type="checkbox"
                                            className={styles.dropdownCheckbox}
                                            checked={transmisionesSeleccionadas.includes(transmision)}
                                            onChange={() => handleTransmisionChange(transmision)}
                                            id={`transmision-${transmision}`}
                                        />
                                        <label htmlFor={`transmision-${transmision}`}>{transmision}</label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Color */}
                <div className={`${styles.formGroup} ${styles.dropdownGroup}`} ref={colorRef}>
                    <label className={styles.label}>Color</label>
                    <div className={`${styles.dropdownMulti} ${styles.dropdownColor}`}>
                        <div
                            className={styles.dropdownMultiInput}
                            tabIndex={0}
                            onClick={() => setIsColorOpen((open) => !open)}
                        >
                            <span>--Seleccione--</span>
                            <span className={styles.dropdownArrow}>&#9660;</span>
                        </div>
                        {isColorOpen && (
                            <div className={styles.dropdownList}>
                                {colores.map(color => (
                                    <div key={color} className={styles.dropdownOption}>
                                        <input
                                            type="checkbox"
                                            className={styles.dropdownCheckbox}
                                            checked={coloresSeleccionados.includes(color)}
                                            onChange={() => handleColorChange(color)}
                                            id={`color-${color}`}
                                        />
                                        <label htmlFor={`color-${color}`}>{color}</label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Año desde */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Año desde</label>
                    <select {...register('añoDesde')} className={styles.select}>
                        <option value="">--Seleccione--</option>
                        {generateYearOptions().map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                {/* Año hasta */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Año hasta</label>
                    <select {...register('añoHasta')} className={styles.select}>
                        <option value="">--Seleccione--</option>
                        {generateYearOptions().map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                {/* Precio desde */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Precio desde</label>
                    <input 
                        type="number" 
                        {...register('precioDesde')} 
                        className={styles.input}
                        placeholder="0"
                    />
                </div>

                {/* Precio hasta */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Precio hasta</label>
                    <input 
                        type="number" 
                        {...register('precioHasta')} 
                        className={styles.input}
                        placeholder="999999"
                    />
                </div>

                {/* Kilometraje desde */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Kms desde</label>
                    <input 
                        type="number" 
                        {...register('kmsDesde')} 
                        className={styles.input}
                        placeholder="0"
                    />
                </div>

                {/* Kilometraje hasta */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Kms hasta</label>
                    <input 
                        type="number" 
                        {...register('kmsHasta')} 
                        className={styles.input}
                        placeholder="999999"
                    />
                </div>

                {/* Modelo */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Modelo</label>
                    <input 
                        type="text" 
                        {...register('modelo')} 
                        className={styles.input}
                        placeholder="Ej: Corolla"
                    />
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
                        {isFiltering ? (
                            <>
                                <svg className={styles.spinner} width="20" height="20" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="31.416" strokeDashoffset="31.416">
                                        <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                                        <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
                                    </circle>
                                </svg>
                                Aplicando...
                            </>
                        ) : 'Aplicar Filtros'}
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

            {/* FilterSummary integrado debajo de los botones solo en desktop */}
            {filterSummary && variant !== 'mobile' && (
                <div style={{ marginTop: 8 }}>
                    {filterSummary}
                </div>
            )}
        </form>
    )
}))

FilterForm.displayName = 'FilterForm'

export default FilterForm 