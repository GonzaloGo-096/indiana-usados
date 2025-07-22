/**
 * VehiculoDetalle - Página de detalle de vehículo
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import autoService, { queryKeys } from '../../services/service'
import img from '../../assets/auto1.jpg'
import DetalleSkeleton from '../../components/skeletons/DetalleSkeleton'
import styles from './VehiculoDetalle.module.css'

// Iconos SVG
const GmailIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
)

const WhatsAppIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
  </svg>
)

// Función helper para mostrar "-" cuando el valor esté vacío
const formatValue = (value) => {
  if (!value || value === '' || value === 'null' || value === 'undefined') {
    return '-'
  }
  return value
}

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
        marca = '',
        modelo = '', 
        precio = '',
        año = '',
        color = '',
        combustible = '',
        categoria = '',
        detalle = '',
        kms = '',
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
                                alt={`${formatValue(marca)} ${formatValue(modelo)}`}
                                className={styles.image}
                            />
                        </div>
                        
                        <div className={styles.detailsSection}>
                            <h2 className={styles.title}>
                                {formatValue(marca)} {formatValue(modelo)}
                            </h2>
                            
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
                                                <th>Combustible</th>
                                                <td>{formatValue(combustible)}</td>
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
                            
                            <div className={styles.contactSection}>
                                <h4 className={styles.contactTitle}>Contacto</h4>
                                <div className={styles.contactButtons}>
                                    <a 
                                        href="mailto:info@indianausados.com" 
                                        className={styles.contactButton}
                                        title="Enviar email"
                                    >
                                        <GmailIcon />
                                        <span>Email</span>
                                    </a>
                                    <a 
                                        href="https://wa.me/5491112345678?text=Hola, me interesa el vehículo" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className={styles.contactButton}
                                        title="Contactar por WhatsApp"
                                    >
                                        <WhatsAppIcon />
                                        <span>WhatsApp</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VehiculoDetalle 