/**
 * VehiculoDetalle - Página de detalle de vehículo optimizada
 * 
 * @author Indiana Usados
 * @version 3.1.0 - Performance optimizada
 */

import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useVehicleDetail } from '@hooks/vehicles'
import { CardDetalle, SimilarVehiclesCarousel, PriceRangeCarousel } from '@vehicles'
import { ErrorState } from '@ui'
import { DetalleSkeleton } from '@shared'
import { useScrollPosition } from '@hooks'
import { VehicleSEOHead, SEOHead, StructuredData } from '@components/SEO'
import { SEO_CONFIG } from '@config/seo'
import styles from './VehiculoDetalle.module.css'

const VehiculoDetalle = () => {
    const { id } = useParams()
    
    // Hook para preservar scroll
    const { navigateWithScroll } = useScrollPosition({
        key: 'vehicles-list',
        enabled: true
    })

    // Scroll hacia arriba al cargar la página
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // ✅ USAR DATOS DEL CACHE SI ESTÁN DISPONIBLES
    const { 
        auto,
        isLoading, 
        isError, 
        error 
    } = useVehicleDetail(id, { enabled: true })

    // Función para volver preservando scroll
    const handleBack = () => {
        navigateWithScroll('/usados')
    }

    // Estado de carga
    if (isLoading) return <DetalleSkeleton />

    // Estado de error
    if (isError) {
        return (
            <>
                <SEOHead
                    title="Error al cargar el vehículo"
                    description="No se pudo cargar la información del vehículo solicitado."
                    noindex={true}
                />
                <ErrorState
                    title="Error al cargar el vehículo"
                    message={error?.message || 'No se pudo cargar la información del vehículo'}
                    actionText="Volver a la lista de vehículos"
                    actionLink="/usados"
                    variant="error"
                />
            </>
        )
    }

    // Vehículo no encontrado
    if (!auto) {
        return (
            <>
                <VehicleSEOHead vehicle={null} />
                <ErrorState
                    title="Vehículo no encontrado"
                    message="El vehículo que buscas no existe o ha sido removido."
                    actionText="Volver a la lista de vehículos"
                    actionLink="/usados"
                    variant="notFound"
                />
            </>
        )
    }

    // Structured Data: Product para vehículo usado
    const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: `${auto.marca || ''} ${auto.modelo || ''}`.trim(),
        brand: {
            '@type': 'Brand',
            name: auto.marca || ''
        },
        description: `${auto.marca || ''} ${auto.modelo || ''} ${auto.anio || ''} usado en venta en Tucumán. ${auto.kilometraje ? `${auto.kilometraje.toLocaleString('es-AR')} km` : ''}${auto.transmision ? `, ${auto.transmision}` : ''}${auto.combustible ? `, ${auto.combustible}` : ''}.`,
        image: auto.fotoPrincipal || '',
        url: `${SEO_CONFIG.siteUrl}/vehiculo/${auto.id}`,
        category: 'Automotive',
        itemCondition: 'https://schema.org/UsedCondition',
        offers: {
            '@type': 'Offer',
            priceCurrency: 'ARS',
            price: auto.precio || 0,
            availability: 'https://schema.org/InStock',
            url: `${SEO_CONFIG.siteUrl}/vehiculo/${auto.id}`,
            seller: {
                '@type': 'AutomotiveBusiness',
                name: SEO_CONFIG.business.name,
                address: {
                    '@type': 'PostalAddress',
                    addressLocality: SEO_CONFIG.business.address.addressLocality,
                    addressRegion: SEO_CONFIG.business.address.addressRegion,
                    addressCountry: SEO_CONFIG.business.address.addressCountry
                }
            }
        },
        // Propiedades adicionales del vehículo
        ...(auto.anio && { productionDate: `${auto.anio}` }),
        ...(auto.kilometraje && { mileageFromOdometer: {
            '@type': 'QuantitativeValue',
            value: auto.kilometraje,
            unitCode: 'KMT'
        }})
    }

    // Breadcrumb para detalle
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Inicio',
                item: SEO_CONFIG.siteUrl
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Autos Usados',
                item: `${SEO_CONFIG.siteUrl}/usados`
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: `${auto.marca || ''} ${auto.modelo || ''}`.trim(),
                item: `${SEO_CONFIG.siteUrl}/vehiculo/${auto.id}`
            }
        ]
    }

    return (
        <>
            <VehicleSEOHead vehicle={auto} />
            <StructuredData schema={productSchema} id="vehicle-product" />
            <StructuredData schema={breadcrumbSchema} id="vehicle-breadcrumb" />
            <div className={styles.container}>
            {/* Botón de volver con preservación de scroll */}
            <div className={styles.backButton}>
                <button onClick={handleBack} className={styles.backLink}>
                    Lista completa
                </button>
            </div>
            
            {/* Contenido principal */}
            <div className={styles.content}>
                <CardDetalle auto={auto} />
                
                {/* CTA Contacto - Antes de los carruseles */}
                <div className={styles.ctaContainer}>
                    <section className={styles.ctaSection}>
                        <p className={styles.ctaText}>
                            ¿Querés más información sobre este vehículo?
                        </p>
                        <a 
                            href={`https://wa.me/543816295959?text=${encodeURIComponent(`Hola! Me interesa el ${auto.marca || ''} ${auto.modelo || ''} ${auto.anio || ''} usado`)}`}
                            className={styles.ctaButton}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <svg 
                                className={styles.whatsappIcon} 
                                width="20" 
                                height="20" 
                                viewBox="0 0 24 24" 
                                fill="currentColor"
                            >
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                            <span>Contactanos por WhatsApp</span>
                        </a>
                    </section>
                </div>
                
                {/* Carrusel de vehículos de la misma marca */}
                <SimilarVehiclesCarousel currentVehicle={auto} />
                
                {/* Carrusel de vehículos en rango de precio similar */}
                <PriceRangeCarousel currentVehicle={auto} />
            </div>
            </div>
        </>
    )
}

export default VehiculoDetalle 