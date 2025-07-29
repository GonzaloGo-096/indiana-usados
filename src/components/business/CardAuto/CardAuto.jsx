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

import React, { memo, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../ui/Button'
import { formatValue } from '../../../utils/imageUtils'
import { useMainImage } from '../../../hooks/useImageOptimization'
import styles from './CardAuto.module.css'

// Función de comparación personalizada para memo - OPTIMIZADA
const arePropsEqual = (prevProps, nextProps) => {
  const prevAuto = prevProps.auto
  const nextAuto = nextProps.auto
  
  // ✅ OPTIMIZADO: Comparación directa de ID primero
  if (prevAuto?.id !== nextAuto?.id) {
    return false
  }
  
  // ✅ OPTIMIZADO: Comparar solo propiedades críticas
  const criticalProps = ['marca', 'modelo', 'precio', 'año', 'imagen']
  
  for (const prop of criticalProps) {
    if (prevAuto?.[prop] !== nextAuto?.[prop]) {
      return false
    }
  }
  
  return true
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
    // ✅ CORREGIDO: Hooks siempre primero, antes de cualquier early return
    const mainImage = useMainImage(auto)
    const altText = useMemo(() => 
        `${formatValue(auto?.marca || '')} ${formatValue(auto?.modelo || '')}`, 
        [auto?.marca, auto?.modelo]
    )

    // ✅ CORREGIDO: Validación después de hooks
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
                    src={mainImage} 
                    className={styles.image} 
                    alt={altText}
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