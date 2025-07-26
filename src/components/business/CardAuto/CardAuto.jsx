/**
 * CardAuto - Componente para mostrar información de un vehículo
 * 
 * Funcionalidades:
 * - Mostrar información del vehículo
 * - Navegación al detalle
 * - Imagen con lazy loading
 * - Hover effects
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../ui/Button'
import styles from './CardAuto.module.css'
// Importar imagen por defecto
import defaultCarImage from '../../../assets/auto1.jpg'

// Función helper para mostrar "-" cuando el valor esté vacío
const formatValue = (value) => {
  if (!value || value === '' || value === 'null' || value === 'undefined') {
    return '-'
  }
  return value
}

// Función de comparación personalizada para memo
const arePropsEqual = (prevProps, nextProps) => {
  const prevAuto = prevProps.auto
  const nextAuto = nextProps.auto
  
  // Comparar solo las propiedades que afectan el render
  return (
    prevAuto.id === nextAuto.id &&
    prevAuto.marca === nextAuto.marca &&
    prevAuto.modelo === nextAuto.modelo &&
    prevAuto.precio === nextAuto.precio &&
    prevAuto.año === nextAuto.año &&
    prevAuto.kms === nextAuto.kms &&
    prevAuto.caja === nextAuto.caja &&
    prevAuto.color === nextAuto.color &&
    prevAuto.categoria === nextAuto.categoria &&
    prevAuto.imagen === nextAuto.imagen
  )
}

/**
 * Componente CardAuto
 * @param {Object} auto - Objeto con información del vehículo
 * @param {string} auto.id - ID del vehículo
 * @param {string} auto.marca - Marca del vehículo
 * @param {string} auto.modelo - Modelo del vehículo
 * @param {string} auto.precio - Precio del vehículo
 * @param {string} auto.año - Año del vehículo
 * @param {string} auto.kms - Kilometraje del vehículo
 * @param {string} auto.caja - Tipo de caja del vehículo
 * @param {string} auto.color - Color del vehículo
 * @param {string} auto.categoria - Categoría del vehículo
 */
export const CardAuto = memo(({ auto }) => {
    // Validación de props
    if (!auto) return null

    // Extraer datos con valores por defecto
    const {
        id,
        marca = '',
        modelo = '',
        precio = '',
        año = '',
        kms = '',
        caja = '',
        color = '',
        categoria = ''
    } = auto

    return (
        <div className={styles.card}>
            {/* Contenedor de imagen */}
            <div className={styles.imageContainer}>
                <img 
                    src={auto.imagen || defaultCarImage} 
                    className={styles.image} 
                    alt={`${formatValue(marca)} ${formatValue(modelo)}`}
                    loading="lazy"
                />
            </div>
            
            {/* Cuerpo de la tarjeta */}
            <div className={styles.body}>
                <h5 className={styles.title}>
                    {formatValue(marca)} {formatValue(modelo)}
                </h5>
                
                {/* Detalles del vehículo */}
                <div className={styles.details}>
                    <div className={styles.tablesContainer}>
                        <div className={styles.tableSection}>
                            <table className={styles.table}>
                                <tbody>
                                    <tr>
                                        <th>Precio</th>
                                        <td>{precio ? `$${precio}` : '-'}</td>
                                    </tr>
                                    <tr>
                                        <th>Año</th>
                                        <td>{formatValue(año)}</td>
                                    </tr>
                                    <tr>
                                        <th>Kms</th>
                                        <td>{formatValue(kms)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                        <div className={styles.tableSection}>
                            <table className={styles.table}>
                                <tbody>
                                    <tr>
                                        <th>Caja</th>
                                        <td>{formatValue(caja)}</td>
                                    </tr>
                                    <tr>
                                        <th>Color</th>
                                        <td>{formatValue(color)}</td>
                                    </tr>
                                    <tr>
                                        <th>Categoría</th>
                                        <td>{formatValue(categoria)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Footer con botón */}
            <div className={styles.footer}>
                <Link to={`/vehiculo/${id}`}>
                    <Button 
                        variant="primary" 
                        className={styles.button}
                    >
                        Ver más
                    </Button>
                </Link>
            </div>
        </div>
    )
}, arePropsEqual) // ✅ AGREGADO: Función de comparación personalizada

// Agregar displayName para debugging
CardAuto.displayName = 'CardAuto' 