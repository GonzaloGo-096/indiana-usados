/**
 * FilterForm - Formulario de filtros para catálogo de vehículos
 * 
 * Utiliza React Hook Form para manejo eficiente del estado del formulario
 * Los filtros se aplican manualmente con botón
 * 
 * @author Indiana Usados
 * @version 3.0.0
 */

import React, { forwardRef, useImperativeHandle, useState, useRef } from 'react'
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
        getValues: () => watchedValues,
        clearField: (key) => setValue(key, '')
    }), [setValue, watchedValues])

    // Obtener opciones desde constantes
    const { marcas, combustibles, transmisiones, colores } = FILTER_OPTIONS

    // Estado para dropdown de marcas
    const [isMarcaOpen, setIsMarcaOpen] = useState(false);
    const marcaRef = useRef();
    const marcasSeleccionadas = watch('marca') || [];

    // Manejar selección de marcas
    const handleMarcaChange = (marca) => {
        let nuevas;
        if (marcasSeleccionadas.includes(marca)) {
            nuevas = marcasSeleccionadas.filter(m => m !== marca);
        } else {
            nuevas = [...marcasSeleccionadas, marca];
        }
        setValue('marca', nuevas);
        onFiltersChange({ ...watch(), marca: nuevas });
    };

    // Cerrar dropdown al hacer click fuera
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

    // Estado y lógica para Combustible
    const [isCombustibleOpen, setIsCombustibleOpen] = useState(false);
    const combustibleRef = useRef();
    const combustiblesSeleccionados = watch('combustible') || [];
    const handleCombustibleChange = (combustible) => {
        let nuevas;
        if (combustiblesSeleccionados.includes(combustible)) {
            nuevas = combustiblesSeleccionados.filter(c => c !== combustible);
        } else {
            nuevas = [...combustiblesSeleccionados, combustible];
        }
        setValue('combustible', nuevas);
        onFiltersChange({ ...watch(), combustible: nuevas });
    };
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

    // Estado y lógica para Transmisión
    const [isTransmisionOpen, setIsTransmisionOpen] = useState(false);
    const transmisionRef = useRef();
    const transmisionesSeleccionadas = watch('transmision') || [];
    const handleTransmisionChange = (transmision) => {
        let nuevas;
        if (transmisionesSeleccionadas.includes(transmision)) {
            nuevas = transmisionesSeleccionadas.filter(t => t !== transmision);
        } else {
            nuevas = [...transmisionesSeleccionadas, transmision];
        }
        setValue('transmision', nuevas);
        onFiltersChange({ ...watch(), transmision: nuevas });
    };
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
    const handleColorChange = (color) => {
        let nuevas;
        if (coloresSeleccionados.includes(color)) {
            nuevas = coloresSeleccionados.filter(c => c !== color);
        } else {
            nuevas = [...coloresSeleccionados, color];
        }
        setValue('color', nuevas);
        onFiltersChange({ ...watch(), color: nuevas });
    };
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

                {/* Año Desde (range) */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Año Desde</label>
                    <input
                        type="range"
                        min="1990"
                        max="2024"
                        step="1"
                        defaultValue="1990"
                        {...register('añoDesde')}
                        className={styles.input}
                        disabled={isLoading || isFiltering}
                    />
                    <span>{watch('añoDesde') || '1990'}</span>
                </div>

                {/* Año Hasta (range) */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Año Hasta</label>
                    <input
                        type="range"
                        min="1990"
                        max="2024"
                        step="1"
                        defaultValue="2024"
                        {...register('añoHasta')}
                        className={styles.input}
                        disabled={isLoading || isFiltering}
                    />
                    <span>{watch('añoHasta') || '2024'}</span>
                </div>

                {/* Precio Desde (range) */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Precio Desde ($)</label>
                    <input
                        type="range"
                        min="0"
                        max="10000000"
                        step="10000"
                        {...register('precioDesde')}
                        className={styles.input}
                        disabled={isLoading || isFiltering}
                    />
                    <span>{watch('precioDesde') || '0'}</span>
                </div>

                {/* Precio Hasta (range) */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Precio Hasta ($)</label>
                    <input
                        type="range"
                        min="0"
                        max="10000000"
                        step="10000"
                        {...register('precioHasta')}
                        className={styles.input}
                        disabled={isLoading || isFiltering}
                    />
                    <span>{watch('precioHasta') || '10000000'}</span>
                </div>

                {/* Combustible (dropdown custom con checkboxes) */}
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

                {/* Transmisión (dropdown custom con checkboxes) */}
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

                {/* Color (dropdown custom con checkboxes) */}
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

                {/* Kilometraje Desde (range) */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Kms Desde</label>
                    <input
                        type="range"
                        min="0"
                        max="500000"
                        step="1000"
                        {...register('kilometrajeDesde')}
                        className={styles.input}
                        disabled={isLoading || isFiltering}
                    />
                    <span>{watch('kilometrajeDesde') || '0'}</span>
                </div>

                {/* Kilometraje Hasta (range) */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Kms Hasta</label>
                    <input
                        type="range"
                        min="0"
                        max="500000"
                        step="1000"
                        {...register('kilometrajeHasta')}
                        className={styles.input}
                        disabled={isLoading || isFiltering}
                    />
                    <span>{watch('kilometrajeHasta') || '500000'}</span>
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
})

FilterForm.displayName = 'FilterForm'

export default FilterForm 