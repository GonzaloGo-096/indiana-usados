/**
 * VehiculoDetalle - Página de detalle de vehículo
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import autoService, { queryKeys } from '../../service/service'
import img from '../../assets/auto1.jpg'
import DetalleSkeleton from '../../components/skeletons/DetalleSkeleton'
import styles from './VehiculoDetalle.module.css'

const VehiculoDetalle = () => {
    const { id } = useParams()

    const { 
        data: auto, 
        isLoading, 
        isError, 
        error 
    } = useQuery({
        queryKey: queryKeys.auto(id),
        queryFn: () => autoService.getAutoById(id),
        staleTime: 1000 * 60 * 5, // 5 minutos
        cacheTime: 1000 * 60 * 30, // 30 minutos
        retry: 1
    })

    if (isLoading) return <DetalleSkeleton />

    if (isError) return (
        <div className={styles.container}>
            <div className={styles.errorContainer}>
                <div className={styles.alert}>
                    <h4 className={styles.alertTitle}>Error al cargar el vehículo</h4>
                    <p className={styles.alertMessage}>{error.message}</p>
                    <hr className={styles.divider} />
                    <Link to="/vehiculos" className={styles.button}>
                        Volver a la lista de vehículos
                    </Link>
                </div>
            </div>
        </div>
    )

    if (!auto) return (
        <div className={styles.container}>
            <div className={styles.errorContainer}>
                <div className={styles.alert}>
                    <h4 className={styles.alertTitle}>Vehículo no encontrado</h4>
                    <p className={styles.alertMessage}>
                        El vehículo que buscas no existe o ha sido removido.
                    </p>
                    <hr className={styles.divider} />
                    <Link to="/vehiculos" className={styles.button}>
                        Volver a la lista de vehículos
                    </Link>
                </div>
            </div>
        </div>
    )

    // Extraer datos con valores por defecto
    const {
        marca = 'Sin marca',
        modelo = 'Sin modelo', 
        precio = 'Consultar',
        año = 'Sin año',
        color = 'Sin color',
        combustible = 'Sin combustible',
        categoria = 'Sin categoría',
        detalle = 'Sin detalles',
        kms = 'Sin kilometraje',
    } = auto;

    return (
        <div className={styles.container}>
            <div className={styles.backButton}>
                <Link to="/vehiculos" className={styles.backLink}>
                    ← Volver a vehículos
                </Link>
            </div>
            
            <div className={styles.content}>
                <div className={styles.card}>
                    <div className={styles.cardContent}>
                        <div className={styles.imageSection}>
                            <img 
                                src={img} 
                                alt={`${marca} ${modelo}`}
                                className={styles.image}
                            />
                        </div>
                        
                        <div className={styles.detailsSection}>
                            <h2 className={styles.title}>{marca} {modelo}</h2>
                            
                            <div className={styles.tablesContainer}>
                                <div className={styles.tableSection}>
                                    <table className={styles.table}>
                                        <tbody>
                                            <tr>
                                                <th>Precio</th>
                                                <td>${precio}</td>
                                            </tr>
                                            <tr>
                                                <th>Año</th>
                                                <td>{año}</td>
                                            </tr>
                                            <tr>
                                                <th>Kilometraje</th>
                                                <td>{kms} km</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                
                                <div className={styles.tableSection}>
                                    <table className={styles.table}>
                                        <tbody>
                                            <tr>
                                                <th>Combustible</th>
                                                <td>{combustible}</td>
                                            </tr>
                                            <tr>
                                                <th>Color</th>
                                                <td>{color}</td>
                                            </tr>
                                            <tr>
                                                <th>Categoría</th>
                                                <td>{categoria}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            
                            <div className={styles.descriptionSection}>
                                <h4 className={styles.descriptionTitle}>Detalle</h4>
                                <p className={styles.description}>{detalle}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VehiculoDetalle 