/**
 * Planes - Página de planes de financiación
 * 
 * Muestra todos los planes de financiación disponibles
 * organizados por modelo.
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React, { useMemo, useRef, useState, useEffect } from 'react'
import CarouselDots from '@components/ui/CarouselDots/CarouselDots'
import { Link } from 'react-router-dom'
import { SEOHead } from '@components/SEO'
import { PLANES } from '@data/planes'
import { formatPrice } from '@utils/formatters'
import { getModelo, COLORES } from '@data/modelos'
import { CloudinaryImage } from '@components/ui/CloudinaryImage'
import { ChevronIcon, getBrandIcon } from '@components/ui/icons'
import styles from './Planes.module.css'
import { getClosestChildIndex, scrollToChildIndex } from '@utils/carouselActiveIndex'

/**
 * Obtener imagen para un modelo específico
 * - Para 208: incluir blanco (es el único color disponible)
 * - Para otros modelos: excluir blanco y variar entre los demás colores
 * - Si no hay colores disponibles, usar imagenPrincipal del modelo
 * @param {string} modeloSlug - Slug del modelo (2008, 208, expert, partner)
 * @param {number} planIndex - Índice del plan para variar el color
 * @returns {Object|null} - Objeto con { url, alt } o null
 */
const obtenerImagenPorModelo = (modeloSlug, planIndex = 0) => {
  const modelo = getModelo(modeloSlug)
  if (!modelo) {
    return null
  }
  
  // Si no hay versiones, usar imagenPrincipal como fallback
  if (!modelo.versiones || modelo.versiones.length === 0) {
    if (modelo.imagenPrincipal && modelo.imagenPrincipal.url) {
      return {
        url: modelo.imagenPrincipal.url,
        alt: modelo.imagenPrincipal.alt || `Peugeot ${modelo.nombre}`
      }
    }
    return null
  }
  
  // Obtener todos los colores disponibles de todas las versiones del modelo
  const coloresDisponibles = new Set()
  modelo.versiones.forEach(version => {
    if (version.coloresPermitidos) {
      version.coloresPermitidos.forEach(colorKey => {
        coloresDisponibles.add(colorKey)
      })
    }
  })
  
  // Convertir a array y obtener objetos color
  const coloresArray = Array.from(coloresDisponibles)
    .map(colorKey => COLORES[colorKey])
    .filter(Boolean)
  
  // Si no hay colores, usar imagenPrincipal como fallback
  if (coloresArray.length === 0) {
    if (modelo.imagenPrincipal && modelo.imagenPrincipal.url) {
      return {
        url: modelo.imagenPrincipal.url,
        alt: modelo.imagenPrincipal.alt || `Peugeot ${modelo.nombre}`
      }
    }
    return null
  }
  
  // Para 208: incluir todos los colores (blanco es el único disponible)
  // Para otros modelos: excluir blanco
  const coloresFiltrados = modeloSlug === '208'
    ? coloresArray
    : coloresArray.filter(color => {
        const key = color.key.toLowerCase()
        return !key.includes('blanco') && !key.includes('white')
      })
  
  // Si después de filtrar no hay colores, usar todos los disponibles
  const coloresFinales = coloresFiltrados.length > 0 ? coloresFiltrados : coloresArray
  
  // Seleccionar color basado en el índice del plan (para variar entre planes)
  const indiceColor = planIndex % coloresFinales.length
  const colorSeleccionado = coloresFinales[indiceColor]
  
  if (!colorSeleccionado || !colorSeleccionado.url) {
    // Fallback a imagenPrincipal si el color no tiene URL
    if (modelo.imagenPrincipal && modelo.imagenPrincipal.url) {
      return {
        url: modelo.imagenPrincipal.url,
        alt: modelo.imagenPrincipal.alt || `Peugeot ${modelo.nombre}`
      }
    }
    return null
  }
  
  return {
    url: colorSeleccionado.url,
    alt: `Peugeot ${modelo.nombre} ${colorSeleccionado.label}`
  }
}

/**
 * Extraer versión del plan basándose en el nombre del plan y los modelos
 * @param {Object} plan - Objeto del plan
 * @param {string} modeloSlug - Slug del modelo (2008, 208, expert, partner)
 * @returns {string} - Nombre de la versión
 */
const obtenerVersionDelPlan = (plan, modeloSlug) => {
  const modeloData = getModelo(modeloSlug)
  if (!modeloData || !modeloData.versiones) return ''
  
  const nombrePlan = plan.plan.toLowerCase()
  const modelosPlan = plan.modelos.map(m => m.toLowerCase())
  
  // Mapeo específico por plan
  const mapeoVersiones = {
    '2008-allure-t200': 'ALLURE',
    '2008-active-t200': 'ACTIVE',
    'easy': 'ALLURE',
    'plus-at': 'ALLURE AT',
    'plus-208': 'ALLURE',
    'expert-carga': 'L3 HDI 120 - Carga',
    'partner-hdi': 'CONFORT 1.6 HDI 92'
  }
  
  // Buscar por ID del plan
  if (mapeoVersiones[plan.id]) {
    return mapeoVersiones[plan.id]
  }
  
  // Buscar versión en los nombres de modelos del plan
  for (const nombreModelo of modelosPlan) {
    for (const version of modeloData.versiones) {
      const versionNombre = version.nombre.toLowerCase()
      const versionNombreCorto = version.nombreCorto.toLowerCase()
      
      if (nombreModelo.includes(versionNombre) || nombreModelo.includes(versionNombreCorto)) {
        return version.nombreCorto || version.nombre
      }
    }
  }
  
  return ''
}

const Planes = () => {
  // Agrupar planes por modelo
  const planesPorModelo = React.useMemo(() => {
    const grupos = {}
    
    PLANES.forEach(plan => {
      plan.modelos.forEach(nombreModelo => {
        // Extraer el modelo base (2008, 208, Expert, Partner)
        const modeloBase = extraerModeloBase(nombreModelo)
        
        if (!grupos[modeloBase]) {
          grupos[modeloBase] = []
        }
        
        // Evitar duplicados
        if (!grupos[modeloBase].find(p => p.id === plan.id)) {
          grupos[modeloBase].push(plan)
        }
      })
    })
    
    return grupos
  }, [])

  return (
    <>
      <SEOHead
        title="Planes de Financiación | Indiana Usados"
        description="Conocé todos nuestros planes de financiación disponibles para modelos Peugeot 0km. Cuotas desde $236.591. Planes flexibles y adaptados a tus necesidades."
        keywords="planes de financiación, Peugeot, 0km, cuotas, financiación automotriz"
      />
      
      {/* Iconos de Indiana - Solo para visualización */}
      <div className={styles.indianaIconsPreview}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '24px' }}>Iconos de Indiana</h2>
        <div className={styles.iconsGrid}>
          <div className={styles.iconItem}>
            <img 
              src="/assets/logos/logos-indiana/indiana-final.webp" 
              alt="Indiana Final" 
              style={{ maxWidth: '200px', height: 'auto' }}
            />
            <p>indiana-final</p>
          </div>
          <div className={styles.iconItem}>
            <img 
              src="/assets/logos/logos-indiana/desktop/azul-chico-desktop.webp" 
              alt="Azul Chico Desktop" 
              style={{ maxWidth: '200px', height: 'auto' }}
            />
            <p>azul-chico-desktop</p>
          </div>
          <div className={styles.iconItem}>
            <img 
              src="/assets/logos/logos-indiana/desktop/azul-solo-desktop.webp" 
              alt="Azul Solo Desktop" 
              style={{ maxWidth: '200px', height: 'auto' }}
            />
            <p>azul-solo-desktop</p>
          </div>
          <div className={styles.iconItem}>
            <img 
              src="/assets/logos/logos-indiana/desktop/indiana-chico-negro-desktop.webp" 
              alt="Indiana Chico Negro Desktop" 
              style={{ maxWidth: '200px', height: 'auto' }}
            />
            <p>indiana-chico-negro-desktop</p>
          </div>
          <div className={styles.iconItem}>
            <img 
              src="/assets/logos/logos-indiana/desktop/logo-chico-solid.webp" 
              alt="Logo Chico Solid" 
              style={{ maxWidth: '200px', height: 'auto' }}
            />
            <p>logo-chico-solid</p>
          </div>
          <div className={styles.iconItem}>
            <img 
              src="/assets/logos/logos-indiana/mobile/azul-solo-mobile.webp" 
              alt="Azul Solo Mobile" 
              style={{ maxWidth: '200px', height: 'auto' }}
            />
            <p>azul-solo-mobile</p>
          </div>
          <div className={styles.iconItem}>
            <img 
              src="/assets/logos/logos-indiana/mobile/indiana-chico-negro-mobile.webp" 
              alt="Indiana Chico Negro Mobile" 
              style={{ maxWidth: '200px', height: 'auto' }}
            />
            <p>indiana-chico-negro-mobile</p>
          </div>
          <div className={styles.iconItem}>
            <img 
              src="/assets/logos/logos-indiana/mobile/indiana-grande azul-mobile.webp" 
              alt="Indiana Grande Azul Mobile" 
              style={{ maxWidth: '200px', height: 'auto' }}
            />
            <p>indiana-grande azul-mobile</p>
          </div>
          <div className={styles.iconItem}>
            <img 
              src="/assets/logos/logos-indiana/mobile/logo-chico-solid-fallback-transparente.webp" 
              alt="Logo Chico Solid Fallback Transparente" 
              style={{ maxWidth: '200px', height: 'auto' }}
            />
            <p>logo-chico-solid-fallback-transparente</p>
          </div>
          <div className={styles.iconItem}>
            <img 
              src="/assets/logos/logos-indiana/mobile/negro-chico-mobile.webp" 
              alt="Negro Chico Mobile" 
              style={{ maxWidth: '200px', height: 'auto' }}
            />
            <p>negro-chico-mobile</p>
          </div>
        </div>
      </div>

      {/* Iconos de Peugeot - Solo para visualización */}
      <div className={styles.indianaIconsPreview}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '24px' }}>Iconos de Peugeot</h2>
        <div className={styles.iconsGrid}>
          <div className={styles.iconItem}>
            <img 
              src="/assets/logos/logos-peugeot/Peugeot_logo_PNG8.webp" 
              alt="Peugeot Logo PNG8" 
              style={{ maxWidth: '200px', height: 'auto' }}
            />
            <p>Peugeot_logo_PNG8</p>
          </div>
          <div className={styles.iconItem}>
            <img 
              src="/assets/logos/logos-peugeot/Peugeot_logo_PNG9.webp" 
              alt="Peugeot Logo PNG9 (Vintage)" 
              style={{ maxWidth: '200px', height: 'auto' }}
            />
            <p>Peugeot_logo_PNG9 (vintage)</p>
          </div>
          {/* Variante en fondo oscuro para el logo blanco */}
          <div className={styles.iconItem} style={{ background: '#0a0d14' }}>
            <img 
              src="/assets/logos/logos-peugeot/Peugeot_logo_PNG8.webp" 
              alt="Peugeot Logo Blanco (fondo oscuro)" 
              style={{ maxWidth: '200px', height: 'auto' }}
            />
            <p style={{ color: '#fff' }}>Peugeot blanco (fondo oscuro)</p>
          </div>
        </div>
      </div>
      
      <div className={styles.planesPage}>
        <div className={styles.header}>
          <h1 className={styles.title}>Planes de Financiación</h1>
          <p className={styles.subtitle}>
            Encontrá el plan perfecto para tu próximo Peugeot 0km
          </p>
        </div>

        <div className={styles.content}>
          {Object.entries(planesPorModelo).map(([modelo, planes]) => (
            <ModeloSection key={modelo} modelo={modelo} planes={planes} />
          ))}
        </div>
      </div>
    </>
  )
}

/**
 * Componente para mostrar planes de un modelo específico en un carrusel
 */
const ModeloSection = ({ modelo, planes }) => {
  const modeloDisplay = modelo.charAt(0).toUpperCase() + modelo.slice(1)
  const scrollContainerRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  
  // Obtener icono de Peugeot
  const PeugeotIcon = getBrandIcon('Peugeot')
  
  // Obtener imagen para este modelo (usar índice 0 para la primera imagen)
  const imagenModelo = useMemo(() => {
    return obtenerImagenPorModelo(modelo, 0)
  }, [modelo])
  
  // Verificar si se puede scrollear
  const checkScrollability = () => {
    if (!scrollContainerRef.current) return
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10) // 10px de tolerancia
  }

  // Indicador por ÍTEM (no por página)
  const itemCount = (imagenModelo && imagenModelo.url ? 1 : 0) + (planes?.length || 0)
  const [activeItem, setActiveItem] = useState(0)
  const checkActiveItem = () => {
    if (!scrollContainerRef.current) return
    setActiveItem(getClosestChildIndex(scrollContainerRef.current))
  }
  
  useEffect(() => {
    checkScrollability()
    checkActiveItem()
    const container = scrollContainerRef.current
    if (container) {
      const onScroll = () => { checkScrollability(); checkActiveItem() }
      const onResize = () => { checkScrollability(); checkActiveItem() }
      container.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onResize)
      return () => {
        container.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onResize)
      }
    }
  }, [planes])
  
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -400,
        behavior: 'smooth'
      })
    }
  }
  
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 400,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section className={styles.modeloSection}>
      <h2 className={styles.modeloTitle}>
        {PeugeotIcon && <PeugeotIcon className={styles.modeloTitleIcon} size={48} color="#000000" />}
        Peugeot {modeloDisplay}
      </h2>
      
      {/* Carrusel de cards */}
      <div className={styles.carouselContainer}>
        {/* Flecha izquierda */}
        {canScrollLeft && (
          <button 
            className={styles.arrowButton}
            onClick={scrollLeft}
            aria-label="Anterior"
          >
            <ChevronIcon direction="left" />
          </button>
        )}
        
        {/* Contenedor de cards con scroll */}
        <div 
          ref={scrollContainerRef}
          className={styles.carouselTrack}
        >
          {/* Primera card: Imagen del modelo */}
          {imagenModelo && imagenModelo.url && (
            <div className={styles.modeloImageCard}>
              <CloudinaryImage
                image={imagenModelo.url}
                alt={imagenModelo.alt || `Peugeot ${modeloDisplay}`}
                variant="fluid"
                loading="lazy"
                className={styles.modeloImage}
                sizes="(max-width: 768px) 320px, 400px"
              />
              {/* Botón Ver modelo centrado debajo de la imagen */}
              <div className={styles.modeloImageButtonContainer}>
                <Link 
                  to={`/0km/${modelo}`} 
                  className={styles.modeloImageButton}
                >
                  Ver modelo
                </Link>
              </div>
            </div>
          )}
          
          {/* Cards de planes */}
          {planes.map(plan => (
            <PlanCard key={plan.id} plan={plan} modelo={modelo} />
          ))}
        </div>
        
        {/* Flecha derecha */}
        {canScrollRight && (
          <button 
            className={`${styles.arrowButton} ${styles.arrowRight}`}
            onClick={scrollRight}
            aria-label="Siguiente"
          >
            <ChevronIcon direction="right" />
          </button>
        )}
      </div>

      {/* Indicador de páginas del carrusel */}
      <div className={styles.carouselDots}>
        <CarouselDots
          count={itemCount}
          activeIndex={activeItem}
          variant="autocity"
          onDotClick={(i) => {
            if (!scrollContainerRef.current) return
            scrollToChildIndex(scrollContainerRef.current, i)
          }}
        />
      </div>
    </section>
  )
}

/**
 * Componente PlanCard - Card individual para cada plan
 */
const PlanCard = ({ plan, modelo }) => {
  const {
    plan: nombrePlan,
    cuotas_desde,
    valor_movil_con_imp,
    valor_movil_sin_imp,
    caracteristicas
  } = plan
  
  const modeloDisplay = modelo.charAt(0).toUpperCase() + modelo.slice(1)
  const version = obtenerVersionDelPlan(plan, modelo)
  const cuotasTotales = caracteristicas?.cuotas_totales || null

  return (
    <div className={styles.planCard}>
      {/* Header del plan - Alineado a la izquierda */}
      <div className={styles.planHeader}>
        <h3 className={styles.planTitle}>Plan {nombrePlan}</h3>
      </div>

      {/* Información principal */}
      <div className={styles.planContent}>
        {/* Título del modelo y versión */}
        <div className={styles.modeloVersionContainer}>
          <h4 className={styles.modeloVersionTitle}>
            {modeloDisplay}
            {version && (
              <span className={styles.versionSeparator}> {version}</span>
            )}
          </h4>
        </div>
        
        {/* Cuota desde - Grande, azul, cursiva, con cuotas al lado */}
        <div className={styles.cuotaDesdeContainer}>
          <span className={styles.cuotaDesdeLabel}>Valor cuota</span>
          <div className={styles.cuotaDesdeRow}>
            <span className={styles.cuotaDesdeValue}>{formatPrice(cuotas_desde)}</span>
            {cuotasTotales && (
              <span className={styles.cuotasTotales}>{cuotasTotales} cuotas</span>
            )}
          </div>
        </div>

        {/* Valor móvil y otro dato - Contenedor de 2 columnas simétricas */}
        <div className={styles.infoBottomRow}>
          {/* Columna izquierda: Valor móvil - Un solo valor grande */}
          <div className={styles.infoBottomItem}>
            <span className={styles.infoBottomLabel}>Valor móvil</span>
            <span className={styles.infoBottomValue}>
              {formatPrice(valor_movil_con_imp)}
            </span>
          </div>

          {/* Columna derecha: Tipo de plan y Adjudicación pactada */}
          <div className={styles.infoBottomColumn}>
            {caracteristicas?.tipo_plan && (
              <div className={styles.infoBottomItem}>
                <span className={styles.infoBottomLabel}>Tipo de plan</span>
                <span className={styles.infoBottomValue}>{caracteristicas.tipo_plan}</span>
              </div>
            )}
            
            {caracteristicas?.adjudicacion_pactada && caracteristicas.adjudicacion_pactada.length > 0 && (
              <div className={styles.infoBottomItem}>
                <span className={styles.infoBottomLabel}>Adjudicación pactada</span>
                <span className={styles.infoBottomValue}>
                  Cuota {caracteristicas.adjudicacion_pactada.join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className={styles.planActions}>
          <Link 
            to={`/planes/${plan.id}`} 
            className={styles.actionButton}
          >
            Ver plan
          </Link>
        </div>
      </div>
    </div>
  )
}

/**
 * Extraer modelo base del nombre del modelo
 * @param {string} nombreModelo - Nombre completo del modelo
 * @returns {string} - Modelo base (2008, 208, expert, partner)
 */
const extraerModeloBase = (nombreModelo) => {
  const nombre = nombreModelo.toLowerCase()
  
  if (nombre.includes('2008')) return '2008'
  if (nombre.includes('208')) return '208'
  if (nombre.includes('expert')) return 'expert'
  if (nombre.includes('partner')) return 'partner'
  
  return 'otros'
}

export default Planes

