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
  // Refs para las secciones de modelos
  const modeloRefs = React.useRef({})
  
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

  // Función para hacer scroll a una sección de modelo
  const scrollToModelo = (modelo) => {
    const elemento = modeloRefs.current[modelo]
    if (elemento) {
      elemento.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Obtener lista de modelos disponibles
  const modelosDisponibles = Object.keys(planesPorModelo).sort()

  return (
    <>
      <SEOHead
        title="Planes de Financiación | Indiana Usados"
        description="Conocé todos nuestros planes de financiación disponibles para modelos Peugeot 0km. Cuotas desde $236.591. Planes flexibles y adaptados a tus necesidades."
        keywords="planes de financiación, Peugeot, 0km, cuotas, financiación automotriz"
      />
      
      <div className={styles.planesPage}>
        <div className={styles.header}>
          <h1 className={styles.title}>Planes de Financiación</h1>
          <p className={styles.subtitle}>
            Encontrá el plan perfecto para tu próximo modelo Peugeot
          </p>
          
          {/* Botones de modelos */}
          <div className={styles.modelosButtons}>
            {modelosDisponibles.map((modelo) => {
              const modeloDisplay = modelo.charAt(0).toUpperCase() + modelo.slice(1)
              return (
                <button
                  key={modelo}
                  className={styles.modeloButton}
                  onClick={() => scrollToModelo(modelo)}
                  aria-label={`Ver planes de Peugeot ${modeloDisplay}`}
                >
                  {modeloDisplay}
                </button>
              )
            })}
          </div>
        </div>

        <div className={styles.content}>
          {Object.entries(planesPorModelo).map(([modelo, planes]) => (
            <ModeloSection 
              key={modelo} 
              modelo={modelo} 
              planes={planes}
              ref={(el) => {
                if (el) {
                  modeloRefs.current[modelo] = el
                }
              }}
            />
          ))}
        </div>
      </div>
    </>
  )
}

/**
 * Componente para mostrar planes de un modelo específico en un carrusel
 */
const ModeloSection = React.forwardRef(({ modelo, planes }, ref) => {
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
    <section ref={ref} className={styles.modeloSection}>
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
                loading="eager"
                fetchpriority="high"
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
})

ModeloSection.displayName = 'ModeloSection'

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
  const modeloLower = modelo.toLowerCase()
  const version = obtenerVersionDelPlan(plan, modelo)
  const cuotasTotales = caracteristicas?.cuotas_totales || null
  
  // Solo mostrar modelo en el título si es 208
  const mostrarModeloEnVersion = modeloLower === '208'

  return (
    <div className={styles.planCard}>
      {/* Header del plan - Alineado a la izquierda */}
      <div className={styles.planHeader}>
        <h3 className={styles.planTitle}>Plan {nombrePlan}</h3>
      </div>

      {/* Información principal */}
      <div className={styles.planContent}>
        {/* Título de versión (con modelo solo para 208) */}
        {version && (
          <div className={styles.modeloVersionContainer}>
            <h4 className={styles.modeloVersionTitle}>
              {mostrarModeloEnVersion && modeloDisplay}
              {mostrarModeloEnVersion && version && (
                <span className={styles.versionSeparator}> {version}</span>
              )}
              {!mostrarModeloEnVersion && version}
            </h4>
          </div>
        )}
        
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

