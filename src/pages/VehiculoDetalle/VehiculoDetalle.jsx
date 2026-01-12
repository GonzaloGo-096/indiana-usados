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