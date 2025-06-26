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

/**
 * Componente CardAuto
 * @param {Object} auto - Objeto con información del vehículo
 * @param {string} auto.id - ID del vehículo
 * @param {string} auto.marca - Marca del vehículo
 * @param {string} auto.modelo - Modelo del vehículo
 * @param {string} auto.precio - Precio del vehículo
 * @param {string} auto.año - Año del vehículo
 * @param {string} auto.kms - Kilometraje del vehículo
 */
export const CardAuto = memo(({ auto }) => {
    // Validación de props
    if (!auto) return null

    // Extraer datos con valores por defecto
    const {
        id,
        marca = 'Sin marca',
        modelo = 'Sin modelo',
        precio = "Consultar",
        año = "Consultar",
        kms = "Consultar"
    } = auto

    return (
        <div className={styles.card}>
            {/* Contenedor de imagen */}
            <div className={styles.imageContainer}>
                <img 
                    src={auto.imagen || '/placeholder-car.jpg'} 
                    className={styles.image} 
                    alt={`${marca} ${modelo}`}
                    loading="lazy"
                />
            </div>
            
            {/* Cuerpo de la tarjeta */}
            <div className={styles.body}>
                <h5 className={styles.title}>{marca} {modelo}</h5>
                
                {/* Detalles del vehículo */}
                <div className={styles.details}>
                    <div className={styles.detail}>
                        <span className={styles.label}>Precio:</span>
                        <span className={styles.value}>{precio}</span>
                    </div>
                    <div className={styles.detail}>
                        <span className={styles.label}>Año:</span>
                        <span className={styles.value}>{año}</span>
                    </div>
                    <div className={styles.detail}>
                        <span className={styles.label}>Kilómetros:</span>
                        <span className={styles.value}>{kms}</span>
                    </div>
                </div>
            </div>
            
            {/* Footer con botón */}
            <div className={styles.footer}>
                <Link to={`/vehiculo/${id}`}>
                    <Button variant="primary" className={styles.button}>
                        Ver más
                    </Button>
                </Link>
            </div>
        </div>
    )
}) 