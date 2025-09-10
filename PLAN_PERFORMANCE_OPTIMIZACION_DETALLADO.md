# 🚀 PLAN DE OPTIMIZACIÓN DE PERFORMANCE - INDIANA USADOS

## 🎯 OBJETIVO PRINCIPAL

**Transformar la velocidad de carga en el fuerte de la aplicación**

Convertir la experiencia de carga en un **punto diferenciador** donde los usuarios noten inmediatamente la velocidad y fluidez, estableciendo un estándar de excelencia que supere las expectativas del mercado.

---

## 📊 ANÁLISIS DE SITUACIÓN ACTUAL

### **🔍 Estado Actual del Proyecto**

#### **Arquitectura Base**
- **React 18** con SWC (compilación rápida)
- **Vite** como build tool (bundling eficiente)
- **React Query** para gestión de estado del servidor
- **Estructura modular** bien organizada
- **Lazy loading básico** implementado en rutas

#### **Problemas Identificados**
1. **Imágenes**: Carga síncrona de todas las imágenes visibles
2. **Bundle**: Tamaño inicial grande sin optimización granular
3. **Re-renders**: Componentes sin memoización estratégica
4. **Navegación**: Sin preloading de rutas probables
5. **Cache**: Sin estrategia inteligente de cache

#### **Métricas Actuales (Estimadas)**
- **First Contentful Paint (FCP)**: ~2.5s
- **Largest Contentful Paint (LCP)**: ~4.0s
- **Bundle inicial**: ~300KB gzipped
- **Tiempo de carga de imágenes**: ~1.5s promedio
- **Navegación entre páginas**: ~800ms

---

## 🎯 OBJETIVOS ESPECÍFICOS

### **Métricas Objetivo**
- **First Contentful Paint (FCP)**: < 1.2s (mejora del 52%)
- **Largest Contentful Paint (LCP)**: < 2.0s (mejora del 50%)
- **Bundle inicial**: < 150KB gzipped (mejora del 50%)
- **Tiempo de carga de imágenes**: < 300ms (mejora del 80%)
- **Navegación entre páginas**: < 200ms (mejora del 75%)

### **Experiencia de Usuario Objetivo**
- **Carga instantánea**: Usuario ve contenido en < 1.2s
- **Navegación fluida**: Transiciones sin parpadeos
- **Imágenes inteligentes**: Carga progresiva y suave
- **Responsive**: Optimizado para móviles y desktop
- **Offline-ready**: Funcionalidad básica sin conexión

---

## 🏗️ ARQUITECTURA DE OPTIMIZACIÓN

### **Principios de Diseño**

#### **1. Simplicidad sobre Complejidad**
- **Evitar over-engineering**: Soluciones simples y efectivas
- **Mantenibilidad**: Código fácil de entender y modificar
- **Escalabilidad**: Base sólida para futuras mejoras
- **Robustez**: Funcionamiento confiable al 100%

#### **2. Performance por Diseño**
- **Lazy loading inteligente**: Carga solo lo necesario
- **Memoización estratégica**: Evita re-renders innecesarios
- **Code splitting granular**: Bundles optimizados
- **Cache inteligente**: Reutilización eficiente de recursos

#### **3. Experiencia de Usuario**
- **Carga progresiva**: Contenido visible inmediatamente
- **Transiciones suaves**: Sin parpadeos ni saltos
- **Feedback visual**: Estados de carga claros
- **Responsive**: Optimizado para todos los dispositivos

---

## 📋 PLAN DE IMPLEMENTACIÓN DETALLADO

### **FASE 1: LAZY LOADING AVANZADO (Días 1-3)**

#### **1.1 Hook de Intersection Observer Personalizado**

**Archivo**: `src/hooks/useIntersectionObserver.js`

```javascript
/**
 * Hook personalizado para Intersection Observer
 * Optimizado para lazy loading de imágenes con preloading inteligente
 */
import { useState, useEffect, useRef, useCallback } from 'react'

const useIntersectionObserver = (options = {}) => {
    const [isIntersecting, setIsIntersecting] = useState(false)
    const [hasIntersected, setHasIntersected] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef(null)
    const observerRef = useRef(null)

    const defaultOptions = {
        threshold: 0.1,
        rootMargin: '100px', // Preload 100px antes de entrar en viewport
        ...options
    }

    const handleIntersection = useCallback(([entry]) => {
        const isCurrentlyIntersecting = entry.isIntersecting
        
        setIsIntersecting(isCurrentlyIntersecting)
        
        if (isCurrentlyIntersecting && !hasIntersected) {
            setHasIntersected(true)
            setIsVisible(true)
        }
    }, [hasIntersected])

    useEffect(() => {
        if (!ref.current) return

        observerRef.current = new IntersectionObserver(
            handleIntersection,
            defaultOptions
        )

        observerRef.current.observe(ref.current)

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect()
            }
        }
    }, [handleIntersection, defaultOptions])

    return {
        ref,
        isIntersecting,
        hasIntersected,
        isVisible
    }
}

export default useIntersectionObserver
```

**¿Por qué esta implementación?**
- **Control granular**: Decido exactamente cuándo cargar
- **Preloading inteligente**: Carga 100px antes de ser visible
- **Performance**: Evita cargar recursos innecesarios
- **Reutilizable**: Un solo hook para todos los casos de uso

#### **1.2 Hook de Lazy Loading de Imágenes**

**Archivo**: `src/hooks/useLazyImage.js`

```javascript
/**
 * Hook especializado para lazy loading de imágenes
 * Maneja estados de carga, error y optimización
 */
import { useState, useEffect, useCallback } from 'react'
import useIntersectionObserver from './useIntersectionObserver'

const useLazyImage = (src, options = {}) => {
    const [isLoaded, setIsLoaded] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    
    const {
        ref,
        isVisible,
        hasIntersected
    } = useIntersectionObserver({
        threshold: 0.1,
        rootMargin: options.preloadMargin || '100px',
        ...options
    })

    const loadImage = useCallback(() => {
        if (!src || isLoaded || hasError || isLoading) return

        setIsLoading(true)
        setHasError(false)

        const img = new Image()
        
        img.onload = () => {
            setIsLoaded(true)
            setIsLoading(false)
            options.onLoad?.()
        }
        
        img.onerror = () => {
            setHasError(true)
            setIsLoading(false)
            options.onError?.()
        }
        
        img.src = src
    }, [src, isLoaded, hasError, isLoading, options])

    useEffect(() => {
        if (isVisible && !isLoaded && !hasError) {
            loadImage()
        }
    }, [isVisible, isLoaded, hasError, loadImage])

    return {
        ref,
        isLoaded,
        hasError,
        isLoading,
        shouldLoad: isVisible || hasIntersected
    }
}

export default useLazyImage
```

**¿Por qué este hook?**
- **Especializado**: Solo para imágenes, optimizado para este caso
- **Estados claros**: Loading, loaded, error bien definidos
- **Callbacks**: Permite reaccionar a eventos de carga
- **Reutilizable**: Funciona con cualquier imagen

#### **1.3 Componente OptimizedImage Mejorado**

**Archivo**: `src/components/ui/OptimizedImage/OptimizedImage.jsx`

```javascript
/**
 * Componente de imagen optimizada con lazy loading avanzado
 * Mantiene compatibilidad con la implementación actual
 */
import React, { memo, useMemo } from 'react'
import useLazyImage from '@hooks/useLazyImage'
import styles from './OptimizedImage.module.css'

const OptimizedImage = memo(({
    src,
    alt = '',
    fallback = null,
    lazy = true,
    className = '',
    style = {},
    onLoad,
    onError,
    showSkeleton = true,
    preloadMargin = '100px',
    ...props
}) => {
    const {
        ref,
        isLoaded,
        hasError,
        isLoading
    } = useLazyImage(src, {
        onLoad,
        onError,
        preloadMargin: lazy ? preloadMargin : '0px'
    })

    // Memoizar clases CSS para evitar recálculos
    const imageClasses = useMemo(() => {
        const baseClasses = [styles.image]
        if (className) baseClasses.push(className)
        if (isLoaded) baseClasses.push(styles.loaded)
        return baseClasses.join(' ')
    }, [className, isLoaded])

    const containerClasses = useMemo(() => {
        const baseClasses = [styles.container]
        if (className) baseClasses.push(className)
        return baseClasses.join(' ')
    }, [className])

    // Renderizar skeleton de carga
    if (isLoading && showSkeleton) {
        return (
            <div 
                ref={ref}
                className={containerClasses}
                style={style}
                {...props}
            >
                <div className={styles.skeleton}>
                    <div className={styles.skeletonContent} />
                </div>
            </div>
        )
    }

    // Renderizar imagen con error
    if (hasError) {
        return (
            <div 
                ref={ref}
                className={containerClasses}
                style={style}
                {...props}
            >
                <div className={styles.errorContainer}>
                    <div className={styles.errorContent}>
                        <svg className={styles.errorIcon} viewBox="0 0 24 24">
                            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                        </svg>
                        <span className={styles.errorText}>Error al cargar imagen</span>
                    </div>
                </div>
            </div>
        )
    }

    // Renderizar imagen cargada
    return (
        <div 
            ref={ref}
            className={containerClasses}
            style={style}
            {...props}
        >
            {isLoaded && (
                <img
                    src={src}
                    alt={alt}
                    className={imageClasses}
                    loading={lazy ? 'lazy' : 'eager'}
                />
            )}
        </div>
    )
})

OptimizedImage.displayName = 'OptimizedImage'

export default OptimizedImage
```

**¿Por qué esta implementación?**
- **Compatibilidad**: Mantiene la API existente
- **Mejora gradual**: Agrega funcionalidad sin romper nada
- **Performance**: Lazy loading inteligente
- **UX**: Estados de carga claros

#### **1.4 Optimización de ImageCarousel**

**Archivo**: `src/components/ui/ImageCarousel/ImageCarousel.jsx`

```javascript
/**
 * Carrusel de imágenes optimizado con lazy loading
 * Memoización estratégica para mejor performance
 */
import React, { memo, useState, useMemo, useCallback } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from './icons.jsx'
import { processImages } from '@utils/imageUtils'
import OptimizedImage from '@ui/OptimizedImage'
import defaultCarImage from '@assets/auto1.jpg'
import styles from './ImageCarousel.module.css'

const ImageCarousel = memo(({ 
    images = [],
    altText = 'Imagen del vehículo',
    showArrows = true,
    showIndicators = true,
    autoPlay = false,
    autoPlayInterval = 5000
}) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    
    // Memoizar imágenes procesadas para evitar recálculos
    const processedImages = useMemo(() => {
        if (!images || images.length === 0) {
            return [defaultCarImage]
        }
        return processImages(images)
    }, [images])
    
    // Memoizar handlers para evitar re-renders
    const handlers = useMemo(() => ({
        goToPrevious: () => setCurrentIndex(prev => 
            prev === 0 ? processedImages.length - 1 : prev - 1
        ),
        goToNext: () => setCurrentIndex(prev => 
            prev === processedImages.length - 1 ? 0 : prev + 1
        ),
        goToImage: (index) => setCurrentIndex(index)
    }), [processedImages.length])
    
    // Memoizar imagen actual
    const currentImage = useMemo(() => 
        processedImages[currentIndex], 
        [processedImages, currentIndex]
    )
    
    // Memoizar miniaturas
    const thumbnails = useMemo(() => 
        processedImages.map((img, index) => ({
            src: img,
            alt: `${altText} ${index + 1}`,
            index,
            isActive: index === currentIndex
        })), 
        [processedImages, currentIndex, altText]
    )

    return (
        <div className={styles.carousel}>
            {/* Imagen principal con lazy loading */}
            <div className={styles.mainImage}>
                <OptimizedImage
                    src={currentImage}
                    alt={altText}
                    lazy={true}
                    preloadMargin="200px"
                    className={styles.image}
                />
                
                {/* Flechas de navegación */}
                {showArrows && processedImages.length > 1 && (
                    <>
                        <button
                            className={styles.arrowLeft}
                            onClick={handlers.goToPrevious}
                            aria-label="Imagen anterior"
                        >
                            <ChevronLeftIcon />
                        </button>
                        <button
                            className={styles.arrowRight}
                            onClick={handlers.goToNext}
                            aria-label="Imagen siguiente"
                        >
                            <ChevronRightIcon />
                        </button>
                    </>
                )}
            </div>
            
            {/* Miniaturas con lazy loading */}
            {showIndicators && processedImages.length > 1 && (
                <div className={styles.thumbnails}>
                    {thumbnails.map(({ src, alt, index, isActive }) => (
                        <OptimizedImage
                            key={index}
                            src={src}
                            alt={alt}
                            lazy={true}
                            preloadMargin="50px"
                            className={`${styles.thumbnail} ${isActive ? styles.active : ''}`}
                            onClick={() => handlers.goToImage(index)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
})

ImageCarousel.displayName = 'ImageCarousel'

export default ImageCarousel
```

**¿Por qué esta optimización?**
- **Memoización completa**: Evita re-renders innecesarios
- **Lazy loading**: Solo carga imágenes visibles
- **Performance**: Mejor rendimiento en carruseles grandes
- **UX**: Transiciones más suaves

---

### **FASE 2: CODE SPLITTING GRANULAR (Días 4-6)**

#### **2.1 Configuración de Vite Optimizada**

**Archivo**: `vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

export default defineConfig({
    plugins: [react()],
    
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
            '@components': resolve(__dirname, 'src/components'),
            '@vehicles': resolve(__dirname, 'src/components/vehicles'),
            '@ui': resolve(__dirname, 'src/components/ui'),
            '@layout': resolve(__dirname, 'src/components/layout'),
            '@shared': resolve(__dirname, 'src/components/shared'),
            '@hooks': resolve(__dirname, 'src/hooks'),
            '@utils': resolve(__dirname, 'src/utils'),
            '@services': resolve(__dirname, 'src/services'),
            '@api': resolve(__dirname, 'src/api'),
            '@constants': resolve(__dirname, 'src/constants'),
            '@styles': resolve(__dirname, 'src/styles'),
            '@assets': resolve(__dirname, 'src/assets'),
            '@config': resolve(__dirname, 'src/config'),
            '@test': resolve(__dirname, 'src/test')
        }
    },
    
    build: {
        target: 'esnext',
        minify: 'esbuild',
        sourcemap: false,
        chunkSizeWarningLimit: 1000,
        
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    // Vendor chunks - Separar dependencias grandes
                    if (id.includes('node_modules')) {
                        // React core
                        if (id.includes('react') || id.includes('react-dom')) {
                            return 'react'
                        }
                        
                        // React Query
                        if (id.includes('@tanstack')) {
                            return 'query'
                        }
                        
                        // React Router
                        if (id.includes('react-router')) {
                            return 'router'
                        }
                        
                        // HTTP client
                        if (id.includes('axios')) {
                            return 'http'
                        }
                        
                        // UI libraries
                        if (id.includes('react-select') || id.includes('rc-slider')) {
                            return 'ui-libs'
                        }
                        
                        // Resto de vendor
                        return 'vendor'
                    }
                    
                    // Feature chunks - Agrupar por funcionalidad
                    if (id.includes('components/vehicles')) {
                        return 'vehicles'
                    }
                    
                    if (id.includes('components/ui')) {
                        return 'ui-components'
                    }
                    
                    if (id.includes('pages/admin')) {
                        return 'admin'
                    }
                    
                    if (id.includes('hooks')) {
                        return 'hooks'
                    }
                    
                    if (id.includes('utils')) {
                        return 'utils'
                    }
                }
            }
        }
    },
    
    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            '@tanstack/react-query',
            'react-router-dom',
            'axios',
            'react-hook-form',
            'react-select',
            'rc-slider'
        ]
    },
    
    server: {
        port: 8080,
        strictPort: true,
        open: true,
        cors: true
    },
    
    preview: {
        port: 4173,
        open: true
    }
})
```

**¿Por qué esta configuración?**
- **Vendor chunks**: Dependencias separadas para mejor cache
- **Feature chunks**: Componentes relacionados agrupados
- **Tamaño optimizado**: Bundles más pequeños y eficientes
- **Cache inteligente**: Cambios en código no invalidan vendor

#### **2.2 Splitting por Features**

**Archivo**: `src/features/vehicles/index.js`

```javascript
/**
 * Barrel export para componentes de vehículos
 * Permite code splitting granular
 */
export { default as VehiclesList } from '../components/vehicles/List/VehiclesList'
export { default as AutosGrid } from '../components/vehicles/List/ListAutos/AutosGrid'
export { default as CardAuto } from '../components/vehicles/Card/CardAuto/CardAuto'
export { default as FilterFormSimplified } from '../components/vehicles/Filters/filters/FilterFormSimplified/FilterFormSimplified'
export { default as VehicleDetail } from '../components/vehicles/Detail/CardDetalle/CardDetalle'
```

**Archivo**: `src/features/ui/index.js`

```javascript
/**
 * Barrel export para componentes UI
 * Agrupa componentes reutilizables
 */
export { default as OptimizedImage } from '../components/ui/OptimizedImage/OptimizedImage'
export { default as ImageCarousel } from '../components/ui/ImageCarousel/ImageCarousel'
export { default as Button } from '../components/ui/Button/Button'
export { default as LoadingSpinner } from '../components/ui/LoadingSpinner/LoadingSpinner'
export { default as MultiSelect } from '../components/ui/MultiSelect/MultiSelect'
export { default as RangeSlider } from '../components/ui/RangeSlider/RangeSlider'
```

#### **2.3 Preloading Estratégico**

**Archivo**: `src/hooks/usePreloadRoute.js`

```javascript
/**
 * Hook para preloading de rutas
 * Anticipa navegación del usuario
 */
import { useEffect, useRef } from 'react'

const usePreloadRoute = (route, options = {}) => {
    const { priority = 'low', timeout = 5000 } = options
    const timeoutRef = useRef(null)
    
    useEffect(() => {
        // Delay para no sobrecargar la red
        timeoutRef.current = setTimeout(() => {
            const link = document.createElement('link')
            link.rel = priority === 'high' ? 'preload' : 'prefetch'
            link.href = route
            link.as = 'script'
            document.head.appendChild(link)
            
            // Cleanup después de un tiempo
            setTimeout(() => {
                if (document.head.contains(link)) {
                    document.head.removeChild(link)
                }
            }, 30000) // 30 segundos
        }, 1000)
        
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [route, priority, timeout])
}

export default usePreloadRoute
```

**Archivo**: `src/components/layout/Nav/Nav.jsx`

```javascript
/**
 * Navegación con preloading inteligente
 * Anticipa rutas probables
 */
import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import usePreloadRoute from '@hooks/usePreloadRoute'
import styles from './Nav.module.css'

const Nav = memo(() => {
    // Preload rutas más probables
    usePreloadRoute('/vehiculos', { priority: 'high' })
    usePreloadRoute('/vehiculo/1', { priority: 'low' })
    usePreloadRoute('/nosotros', { priority: 'low' })
    
    return (
        <nav className={styles.nav}>
            <Link to="/" className={styles.logo}>
                Indiana Usados
            </Link>
            <div className={styles.links}>
                <Link to="/vehiculos">Vehículos</Link>
                <Link to="/nosotros">Nosotros</Link>
            </div>
        </nav>
    )
})

Nav.displayName = 'Nav'

export default Nav
```

**¿Por qué preloading?**
- **Anticipación**: Carga rutas antes de que se necesiten
- **UX mejorada**: Navegación instantánea
- **Inteligente**: Solo preloada rutas probables
- **Eficiente**: Usa prefetch para no bloquear recursos críticos

---

### **FASE 3: MEMOIZACIÓN ESTRATÉGICA (Días 7-9)**

#### **3.1 Memoización de Componentes Críticos**

**Archivo**: `src/components/vehicles/List/VehiclesList.jsx`

```javascript
/**
 * Lista de vehículos optimizada con memoización estratégica
 * Evita re-renders innecesarios
 */
import React, { memo, useMemo, useCallback, useState } from 'react'
import { useVehiclesList } from '@hooks'
import { useErrorHandler } from '@hooks'
import { FilterFormSimplified, AutosGrid } from '@vehicles'
import { ScrollToTop } from '@ui'
import { VehiclesErrorBoundary } from '@shared'
import styles from './ListAutos/ListAutos.module.css'

const VehiclesList = memo(() => {
    const [isFiltering, setIsFiltering] = useState(false)
    
    // Error handler integrado
    const { handleError, clearError, isError, error } = useErrorHandler({
        autoClearTime: 5000,
        enableAutoClear: true
    })
    
    // Hook unificado optimizado
    const {
        vehicles,
        total,
        hasNextPage,
        loadMore,
        isLoadingMore,
        isLoading,
        isError: isQueryError,
        error: queryError,
        refetch
    } = useVehiclesList()

    // Manejar errores de query
    React.useEffect(() => {
        if (isQueryError && queryError) {
            handleError(queryError, 'vehicles-query')
        }
    }, [isQueryError, queryError, handleError])

    // Memoizar función de aplicar filtros
    const applyFilters = useCallback(async (filters) => {
        setIsFiltering(true)
        clearError()
        
        try {
            await refetch()
        } catch (error) {
            handleError(error, 'apply-filters')
            throw error
        } finally {
            setIsFiltering(false)
        }
    }, [refetch, handleError, clearError])

    // Memoizar función de reintento
    const handleRetry = useCallback(() => {
        clearError()
        refetch()
    }, [clearError, refetch])

    // Memoizar props para FilterFormSimplified
    const filterFormProps = useMemo(() => ({
        onApplyFilters: applyFilters,
        isLoading: isLoading || isFiltering
    }), [applyFilters, isLoading, isFiltering])

    // Memoizar props para AutosGrid
    const autosGridProps = useMemo(() => ({
        vehicles,
        total,
        hasNextPage,
        loadMore,
        isLoadingMore,
        isLoading,
        isError,
        error,
        onRetry: handleRetry
    }), [
        vehicles, total, hasNextPage, loadMore, 
        isLoadingMore, isLoading, isError, error, handleRetry
    ])

    return (
        <VehiclesErrorBoundary>
            <div className={styles.container} data-testid="vehicles-list-container">
                <FilterFormSimplified {...filterFormProps} />
                
                <div className={styles.listContainer} data-testid="catalog-grid">
                    <AutosGrid {...autosGridProps} />
                </div>
                
                <ScrollToTop />
            </div>
        </VehiclesErrorBoundary>
    )
})

VehiclesList.displayName = 'VehiclesList'

export default VehiclesList
```

**¿Por qué esta memoización?**
- **Evita re-renders**: Solo se actualiza cuando cambian los datos relevantes
- **Performance**: Mejor rendimiento en listas grandes
- **UX**: Transiciones más suaves
- **Eficiencia**: Menor uso de CPU

#### **3.2 Optimización de Context Providers**

**Archivo**: `src/context/VehicleContext.jsx`

```javascript
/**
 * Context de vehículos optimizado
 * Evita re-renders innecesarios en componentes hijos
 */
import React, { createContext, useContext, memo, useMemo } from 'react'

const VehicleContext = createContext()

const VehicleProvider = memo(({ children, value }) => {
    // Memoizar valor del context para evitar re-renders
    const memoizedValue = useMemo(() => ({
        vehicles: value.vehicles,
        total: value.total,
        filters: value.filters,
        loading: value.loading,
        error: value.error,
        hasNextPage: value.hasNextPage,
        loadMore: value.loadMore,
        isLoadingMore: value.isLoadingMore
    }), [
        value.vehicles,
        value.total,
        value.filters,
        value.loading,
        value.error,
        value.hasNextPage,
        value.loadMore,
        value.isLoadingMore
    ])
    
    return (
        <VehicleContext.Provider value={memoizedValue}>
            {children}
        </VehicleContext.Provider>
    )
})

VehicleProvider.displayName = 'VehicleProvider'

// Hook para usar el context
const useVehicleContext = () => {
    const context = useContext(VehicleContext)
    if (!context) {
        throw new Error('useVehicleContext debe usarse dentro de VehicleProvider')
    }
    return context
}

export { VehicleProvider, useVehicleContext }
```

**¿Por qué optimizar context?**
- **Evita re-renders**: Solo cuando cambian valores relevantes
- **Performance**: Mejor rendimiento en componentes hijos
- **Precisión**: Dependencias exactas
- **Mantenibilidad**: Fácil de entender y modificar

#### **3.3 Memoización de Hooks Personalizados**

**Archivo**: `src/hooks/useVehiclesList.js`

```javascript
/**
 * Hook de lista de vehículos optimizado
 * Memoización estratégica para mejor performance
 */
import React from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { getMainVehicles } from '@services/vehiclesApi'
import { normalizeVehiclesPage } from '@api/vehicles.normalizer'
import { mapListResponse } from '../../mappers/vehicleMapper'

export const useVehiclesList = (filters = {}) => {
    const PAGE_SIZE = 8
    
    // Memoizar query key para evitar invalidaciones innecesarias
    const queryKey = React.useMemo(() => 
        ['vehicles', JSON.stringify({ filters, limit: PAGE_SIZE })],
        [filters, PAGE_SIZE]
    )
    
    // Memoizar query function
    const queryFn = React.useCallback(async ({ pageParam, signal }) => {
        const result = await getMainVehicles({
            filters,
            limit: PAGE_SIZE,
            cursor: pageParam,
            signal
        })
        return result
    }, [filters, PAGE_SIZE])
    
    // Memoizar getNextPageParam
    const getNextPageParam = React.useCallback((lastRaw) => {
        const page = normalizeVehiclesPage(lastRaw)
        return page.hasNextPage ? page.next : undefined
    }, [])
    
    // Memoizar select function
    const select = React.useCallback((data) => {
        const pages = data.pages.map(mapListResponse)
        return {
            vehicles: pages.flatMap(p => p.vehicles),
            total: pages[0]?.total ?? 0
        }
    }, [])
    
    const query = useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam: 1,
        getNextPageParam,
        select,
        placeholderData: (prev) => prev,
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 30 * 60 * 1000, // 30 minutos
        retry: 2
    })
    
    // Memoizar return value
    return React.useMemo(() => ({
        vehicles: query.data?.vehicles ?? [],
        total: query.data?.total ?? 0,
        hasNextPage: query.hasNextPage,
        loadMore: query.fetchNextPage,
        isLoadingMore: query.isFetchingNextPage,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch
    }), [
        query.data?.vehicles,
        query.data?.total,
        query.hasNextPage,
        query.fetchNextPage,
        query.isFetchingNextPage,
        query.isLoading,
        query.isError,
        query.error,
        query.refetch
    ])
}
```

**¿Por qué memoizar hooks?**
- **Estabilidad**: Evita recreación de funciones
- **Performance**: Mejor rendimiento en componentes
- **Consistencia**: Comportamiento predecible
- **Debugging**: Más fácil de debuggear

---

## 🎯 IMPLEMENTACIÓN PASO A PASO

### **Día 1: Hook de Intersection Observer**
- [ ] Crear `src/hooks/useIntersectionObserver.js`
- [ ] Crear `src/hooks/useLazyImage.js`
- [ ] Testear hooks con casos básicos
- [ ] Verificar que no rompe funcionalidad existente

### **Día 2: OptimizedImage Mejorado**
- [ ] Modificar `src/components/ui/OptimizedImage/OptimizedImage.jsx`
- [ ] Integrar hooks de lazy loading
- [ ] Testear con diferentes tipos de imágenes
- [ ] Verificar estados de carga y error

### **Día 3: ImageCarousel Optimizado**
- [ ] Modificar `src/components/ui/ImageCarousel/ImageCarousel.jsx`
- [ ] Implementar memoización estratégica
- [ ] Testear performance con muchas imágenes
- [ ] Verificar navegación fluida

### **Día 4: Configuración de Vite**
- [ ] Modificar `vite.config.js`
- [ ] Configurar manual chunks
- [ ] Testear build y bundle size
- [ ] Verificar que chunks se cargan correctamente

### **Día 5: Splitting por Features**
- [ ] Crear `src/features/vehicles/index.js`
- [ ] Crear `src/features/ui/index.js`
- [ ] Modificar imports en componentes
- [ ] Testear code splitting

### **Día 6: Preloading Estratégico**
- [ ] Crear `src/hooks/usePreloadRoute.js`
- [ ] Modificar `src/components/layout/Nav/Nav.jsx`
- [ ] Testear preloading de rutas
- [ ] Verificar que no sobrecarga la red

### **Día 7: Memoización de Componentes**
- [ ] Modificar `src/components/vehicles/List/VehiclesList.jsx`
- [ ] Implementar memoización estratégica
- [ ] Testear performance con listas grandes
- [ ] Verificar que evita re-renders

### **Día 8: Optimización de Context**
- [ ] Crear `src/context/VehicleContext.jsx`
- [ ] Implementar memoización de context
- [ ] Testear que evita re-renders en hijos
- [ ] Verificar funcionalidad completa

### **Día 9: Memoización de Hooks**
- [ ] Modificar `src/hooks/useVehiclesList.js`
- [ ] Implementar memoización estratégica
- [ ] Testear estabilidad de funciones
- [ ] Verificar performance general

### **Día 10: Testing y Optimización**
- [ ] Ejecutar tests de performance
- [ ] Medir métricas antes y después
- [ ] Optimizar según resultados
- [ ] Documentar cambios

---

## 📊 MÉTRICAS DE ÉXITO

### **Métricas de Performance**
- **First Contentful Paint (FCP)**: < 1.2s
- **Largest Contentful Paint (LCP)**: < 2.0s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms
- **Time to Interactive (TTI)**: < 3.0s

### **Métricas de Bundle**
- **Bundle inicial**: < 150KB gzipped
- **Vendor chunks**: < 100KB gzipped
- **Route chunks**: < 50KB gzipped
- **Total bundle**: < 300KB gzipped

### **Métricas de Imágenes**
- **Tiempo de carga promedio**: < 300ms
- **Imágenes cargadas innecesariamente**: 0
- **Errores de carga**: < 1%
- **Cache hit rate**: > 80%

### **Métricas de UX**
- **Navegación entre páginas**: < 200ms
- **Re-renders innecesarios**: < 5%
- **Tiempo de respuesta**: < 100ms
- **Satisfacción del usuario**: > 90%

---

## 🛠️ HERRAMIENTAS DE MONITOREO

### **Desarrollo**
- **React DevTools Profiler**: Para identificar re-renders
- **Vite Bundle Analyzer**: Para analizar tamaño de bundles
- **Lighthouse**: Para métricas de performance
- **WebPageTest**: Para análisis detallado

### **Producción**
- **Core Web Vitals**: Métricas de Google
- **Real User Monitoring**: Datos de usuarios reales
- **Performance Budget**: Límites de bundle size
- **Error Tracking**: Monitoreo de errores

---

## 🎯 CONCLUSIÓN

Este plan de optimización está diseñado para **transformar la velocidad de carga en el fuerte de la aplicación** mediante:

### **Implementación Sencilla pero Efectiva**
- **Sin over-engineering**: Soluciones simples y robustas
- **Compatibilidad total**: No rompe funcionalidad existente
- **Mejora gradual**: Cada fase construye sobre la anterior
- **Funcionamiento al 100%**: Implementación confiable y testeada

### **Resultados Esperados**
- **40-60% mejora** en tiempo de carga inicial
- **80% mejora** en tiempo de carga de imágenes
- **75% mejora** en velocidad de navegación
- **Experiencia premium** que supera expectativas

### **Base Sólida para el Futuro**
- **Patrones establecidos** para futuras optimizaciones
- **Métricas implementadas** para monitoreo continuo
- **Arquitectura escalable** para crecimiento
- **Documentación completa** para el equipo

**Este plan convierte la performance en un diferenciador competitivo** que los usuarios notarán inmediatamente, estableciendo un estándar de excelencia en la experiencia de carga. 🚀
