/**
 * ScrollParallaxTransition208 - Sección premium de transición visual con scroll parallax
 * 
 * Componente específico para el modelo Peugeot 208.
 * 
 * Efecto: Transición visual editorial donde un vehículo recortado se desplaza
 * horizontalmente mientras el usuario hace scroll, cruzando el límite entre
 * un fondo oscuro y un fondo blanco.
 * 
 * Características técnicas:
 * - Movimiento ligado al scroll (no animación automática)
 * - Solo transform: translateX() (sin propiedades que afecten layout)
 * - IntersectionObserver para controlar activación
 * - requestAnimationFrame para updates suaves
 * - will-change solo cuando está activo
 * - CLS = 0 (dimensiones reservadas)
 * 
 * @version 3.1.0 - Corrección: Progreso correcto (empieza arriba) + Interpolación con dirección correcta
 */

import React, { useEffect, useRef, useState, useCallback, memo } from 'react'
import { Link } from 'react-router-dom'
import { getPlanesPorModelo, getPlanPorId } from '@data/planes'
import { formatPrice } from '@utils/formatters'
import { getModelo } from '@data/modelos'
import styles from './ScrollParallaxTransition208.module.css'

// URLs de imágenes reales
const IMAGE_MOBILE = 'https://res.cloudinary.com/drbeomhcu/image/upload/v1767738011/color-allurepk-artense_smykvm.webp'
const IMAGE_DESKTOP = 'https://res.cloudinary.com/drbeomhcu/image/upload/v1767737965/color-allurepk-artense_vu93if.webp'

// Constantes de configuración
const BREAKPOINT = 992 // Breakpoint unificado (coincide con CSS)

// Configuración de posiciones (porcentajes que se convertirán a píxeles dinámicamente)
// Semántica: X positivo = entra desde la derecha
// startXPercent: porcentaje positivo = fuera del viewport a la derecha
// endXPercent: porcentaje = 0 = centro real del viewport
const CONFIG = {
  mobile: {
    startXPercent: 50,   // Fuera a la derecha (50% del viewport) - Más afuera del viewport
    endXPercent: -10,    // Más a la izquierda del centro (-10% del viewport) - Aumenta desplazamiento total
    startProgress: 0.0,  // El movimiento empieza inmediatamente (0% del scroll) - Arranca mucho antes
    endProgress: 0.5,    // El movimiento termina cuando está al 50% del scroll - Llega antes al destino
  },
  desktop: {
    startXPercent: 35,   // Fuera a la derecha (35% del viewport) - Reducido considerablemente
    endXPercent: 0,      // Centro real (0% = centro del viewport)
    startProgress: 0.02,  // El movimiento empieza cuando el contenedor está al 2% del scroll - Reducido considerablemente
    endProgress: 0.45,    // El movimiento termina cuando está al 45% del scroll - Reducido considerablemente
  },
}

/**
 * Interpolación lineal (lerp)
 * @param {number} start - Valor inicial
 * @param {number} end - Valor final
 * @param {number} t - Progreso (0 a 1)
 * @returns {number} Valor interpolado
 */
const lerp = (start, end, t) => start + (end - start) * t

/**
 * Clamp: Limitar un valor entre min y max
 * @param {number} value - Valor a limitar
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {number} Valor limitado
 */
const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

/**
 * Componente PlanCardDesktop - Card del plan (misma estructura que página de planes)
 */
const PlanCardDesktop = ({ plan, modelo, obtenerVersionDelPlan }) => {
  const {
    plan: nombrePlan,
    cuotas_desde,
    valor_movil_con_imp,
    caracteristicas
  } = plan
  
  const modeloDisplay = modelo.charAt(0).toUpperCase() + modelo.slice(1)
  const modeloLower = modelo.toLowerCase()
  const version = obtenerVersionDelPlan(plan, modelo)
  const cuotasTotales = caracteristicas?.cuotas_totales || null
  const mostrarModeloEnVersion = modeloLower === '208'
  
  return (
    <div className={styles.planCardDesktop}>
      {/* Header del plan */}
      <div className={styles.planHeaderDesktop}>
        <h3 className={styles.planTitleDesktop}>Plan {nombrePlan}</h3>
      </div>

      {/* Información principal */}
      <div className={styles.planContentDesktop}>
        {/* Título de versión */}
        {version && (
          <div className={styles.modeloVersionContainerDesktop}>
            <h4 className={styles.modeloVersionTitleDesktop}>
              {mostrarModeloEnVersion && modeloDisplay}
              {mostrarModeloEnVersion && version && (
                <span className={styles.versionSeparatorDesktop}> {version}</span>
              )}
              {!mostrarModeloEnVersion && version}
            </h4>
          </div>
        )}
        
        {/* Cuota desde */}
        <div className={styles.cuotaDesdeContainerDesktop}>
          <span className={styles.cuotaDesdeLabelDesktop}>Valor cuota</span>
          <div className={styles.cuotaDesdeRowDesktop}>
            <span className={styles.cuotaDesdeValueDesktop}>{formatPrice(cuotas_desde)}</span>
            {cuotasTotales && (
              <span className={styles.cuotasTotalesDesktop}>{cuotasTotales} cuotas</span>
            )}
          </div>
        </div>

        {/* Valor móvil y otro dato */}
        <div className={styles.infoBottomRowDesktop}>
          <div className={styles.infoBottomItemDesktop}>
            <span className={styles.infoBottomLabelDesktop}>Valor móvil</span>
            <span className={styles.infoBottomValueDesktop}>
              {formatPrice(valor_movil_con_imp)}
            </span>
          </div>

          <div className={styles.infoBottomColumnDesktop}>
            {caracteristicas?.tipo_plan && (
              <div className={styles.infoBottomItemDesktop}>
                <span className={styles.infoBottomLabelDesktop}>Tipo de plan</span>
                <span className={styles.infoBottomValueDesktop}>{caracteristicas.tipo_plan}</span>
              </div>
            )}
            
            {caracteristicas?.adjudicacion_pactada && caracteristicas.adjudicacion_pactada.length > 0 && (
              <div className={styles.infoBottomItemDesktop}>
                <span className={styles.infoBottomLabelDesktop}>Adjudicación pactada</span>
                <span className={styles.infoBottomValueDesktop}>
                  Cuota {caracteristicas.adjudicacion_pactada.join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Botón de acción */}
        <div className={styles.planActionsDesktop}>
          <Link 
            to={`/planes/${plan.id}`} 
            className={styles.actionButtonDesktop}
          >
            Ver plan
          </Link>
        </div>
      </div>
    </div>
  )
}

/**
 * Componente ScrollParallaxTransition208
 * Memoizado para evitar re-renders innecesarios
 * 
 * @param {Object} props
 * @param {string} props.modelo - Modelo del vehículo (ej: '208', '2008')
 */
const ScrollParallaxTransition208Component = ({ modelo = '208' }) => {
  // Refs
  const containerRef = useRef(null)
  const vehicleWrapperRef = useRef(null)
  const mainTitleRef = useRef(null)
  const textRef = useRef(null)
  // Refs para mobile
  const hiddenTitleMobileRef = useRef(null)
  const textMobileRef = useRef(null)
  
  // Estado
  const [isActive, setIsActive] = useState(false)
  const [planSeleccionado, setPlanSeleccionado] = useState(null)
  
  // RAF ID para cleanup
  const rafIdRef = useRef(null)
  
  // Obtener planes del modelo
  const planes = getPlanesPorModelo(modelo)
  
  // Seleccionar el primer plan por defecto
  useEffect(() => {
    if (planes.length > 0 && !planSeleccionado) {
      setPlanSeleccionado(planes[0])
    }
  }, [planes, planSeleccionado])
  
  // Función para obtener versión del plan
  const obtenerVersionDelPlan = (plan, modeloSlug) => {
    const modeloData = getModelo(modeloSlug)
    if (!modeloData || !modeloData.versiones) return ''
    
    const nombrePlan = plan.plan.toLowerCase()
    const modelosPlan = plan.modelos.map(m => m.toLowerCase())
    
    const mapeoVersiones = {
      '2008-allure-t200': 'ALLURE',
      '2008-active-t200': 'ACTIVE',
      'easy': 'ALLURE',
      'plus-at': 'ALLURE AT',
      'plus-208': 'ALLURE',
      'expert-carga': 'L3 HDI 120 - Carga',
      'partner-hdi': 'CONFORT 1.6 HDI 92'
    }
    
    if (mapeoVersiones[plan.id]) {
      return mapeoVersiones[plan.id]
    }
    
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

  /**
   * Calcular progreso normalizado (0 a 1) basado en la posición del contenedor
   * progress = 0 → cuando el componente empieza a entrar
   * progress = 1 → cuando el componente sale
   */
  const calculateProgress = useCallback(() => {
    if (!containerRef.current) return 0

    const rect = containerRef.current.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const containerHeight = rect.height
    const containerTop = rect.top
    
    // Fórmula correcta: progress = 0 cuando entra, progress = 1 cuando sale
    // Situación → Resultado:
    // - Componente abajo → ~0
    // - Entra al viewport → empieza a subir
    // - Centro visible → ~0.5
    // - Sale por arriba → ~1
    const rawProgress = (viewportHeight - containerTop) / (viewportHeight + containerHeight)
    const scrollProgress = Math.max(0, Math.min(1, rawProgress))
    
    return scrollProgress
  }, [])

  /**
   * Calcular translateX usando interpolación lineal directa
   * Semántica: X positivo = entra desde la derecha
   */
  const calculateTranslateX = useCallback((progress) => {
    const viewportWidth = window.innerWidth
    const isMobile = viewportWidth < BREAKPOINT
    const config = isMobile ? CONFIG.mobile : CONFIG.desktop
    
    // Calcular posiciones en píxeles basadas en el viewport actual
    const startX = (config.startXPercent / 100) * viewportWidth
    const endX = (config.endXPercent / 100) * viewportWidth
    
    // Calcular rango de progreso para movimiento
    const progressRange = config.endProgress - config.startProgress
    const movementProgress = progressRange > 0 
      ? clamp((progress - config.startProgress) / progressRange, 0, 1)
      : 1
    
    // Interpolación lineal directa entre startX y endX
    // En mobile, multiplicar el progreso para que se mueva más rápido (más cantidad por scroll)
    const effectiveProgress = isMobile ? movementProgress * 1.2 : movementProgress
    const finalProgress = clamp(effectiveProgress, 0, 1)
    const translateX = lerp(startX, endX, finalProgress)
    
    return Math.round(translateX)
  }, [])

  /**
   * Setup IntersectionObserver para controlar activación
   */
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Verificar soporte de IntersectionObserver
    if (typeof IntersectionObserver === 'undefined') {
      return
    }

    // Opciones del observer
    const observerOptions = {
      root: null, // viewport
      rootMargin: '200% 0px', // Activar mucho antes (cuando está lejos abajo)
      threshold: 0
    }

    // Observer para activar/desactivar según visibilidad del contenedor
    const containerObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setIsActive(entry.isIntersecting)
      })
    }, observerOptions)

    // Observar el contenedor completo
    containerObserver.observe(container)

    // Cleanup
    return () => {
      containerObserver.disconnect()
    }
  }, [])

  /**
   * Calcular opacidad y transform para el texto (aparición gradual)
   */
  const calculateTextAnimation = useCallback((progress) => {
    // El texto empieza a aparecer mucho antes (0.05 a 0.25) - Mobile aparece antes
    const textStartProgress = 0.05
    const textEndProgress = 0.25
    
    let opacity = 0
    let translateY = 20 // Empieza 20px más abajo
    
    if (progress >= textStartProgress && progress <= textEndProgress) {
      // Interpolación dentro del rango
      const textProgress = (progress - textStartProgress) / (textEndProgress - textStartProgress)
      opacity = textProgress
      translateY = 20 * (1 - textProgress) // Se mueve hacia arriba mientras aparece
    } else if (progress > textEndProgress) {
      // Completamente visible después del rango
      opacity = 1
      translateY = 0
    }
    
    return { opacity, translateY }
  }, [])

  /**
   * Consolidado: RAF loop + will-change + aplicación directa de transform + animación de texto
   */
  useEffect(() => {
    if (!isActive || !containerRef.current || !vehicleWrapperRef.current) {
      // Limpiar cuando no está activo
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
      if (vehicleWrapperRef.current) {
        vehicleWrapperRef.current.style.willChange = 'auto'
        vehicleWrapperRef.current.style.transform = 'translate3d(0, 0, 0)'
      }
      // Resetear texto (opacidad inicial más alta para que sea visible)
      if (mainTitleRef.current) {
        mainTitleRef.current.style.opacity = '0.3'
        mainTitleRef.current.style.transform = 'translateY(20px)'
      }
      if (textRef.current) {
        textRef.current.style.opacity = '0.3'
        textRef.current.style.transform = 'translateY(20px)'
      }
      return
    }

    // Activar will-change para optimización
    vehicleWrapperRef.current.style.willChange = 'transform'
    
    // RAF loop
    const update = () => {
      if (!containerRef.current || !vehicleWrapperRef.current) return
      
      const progress = calculateProgress()
      const translateX = calculateTranslateX(progress)
      const textAnimation = calculateTextAnimation(progress)
      
      // Aplicar transform al vehículo directamente al DOM (sin estado React)
      vehicleWrapperRef.current.style.transform = `translate3d(${translateX}px, 0, 0)`
      
      // Aplicar animación al título principal y texto (desktop)
      if (mainTitleRef.current) {
        mainTitleRef.current.style.opacity = textAnimation.opacity
        mainTitleRef.current.style.transform = `translateY(${textAnimation.translateY}px)`
        mainTitleRef.current.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out'
      }
      if (textRef.current) {
        // El texto aparece después del título
        const textDelay = 0.05 // 5% de delay
        const textProgress = Math.max(0, textAnimation.opacity - textDelay)
        const textTranslateY = textAnimation.translateY + (textDelay * 10)
        textRef.current.style.opacity = textProgress
        textRef.current.style.transform = `translateY(${textTranslateY}px)`
        textRef.current.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out'
      }
      
      // Aplicar animación al título y texto (mobile)
      if (hiddenTitleMobileRef.current) {
        hiddenTitleMobileRef.current.style.opacity = textAnimation.opacity
        hiddenTitleMobileRef.current.style.transform = `translateY(${textAnimation.translateY}px)`
        hiddenTitleMobileRef.current.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out'
      }
      if (textMobileRef.current) {
        // El texto aparece un poco después del título
        const textDelay = 0.03 // 3% de delay
        const textProgress = Math.max(0, textAnimation.opacity - textDelay)
        const textTranslateY = textAnimation.translateY + (textDelay * 10)
        textMobileRef.current.style.opacity = textProgress
        textMobileRef.current.style.transform = `translateY(${textTranslateY}px)`
        textMobileRef.current.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out'
      }
      
      // Continuar loop solo si está activo
      if (isActive) {
        rafIdRef.current = requestAnimationFrame(update)
      }
    }
    
    rafIdRef.current = requestAnimationFrame(update)
    
    // Cleanup
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
      if (vehicleWrapperRef.current) {
        vehicleWrapperRef.current.style.willChange = 'auto'
      }
    }
  }, [isActive, calculateProgress, calculateTranslateX, calculateTextAnimation])

  return (
    <section 
      ref={containerRef}
      className={styles.transitionSection}
      aria-label="Transición visual premium del Peugeot 208"
    >
      {/* Fondo oscuro que transiciona a blanco */}
      <div className={styles.darkBackground} />
      <div className={styles.lightBackground} />

      {/* Contenedor del vehículo */}
      <div 
        ref={vehicleWrapperRef}
        className={styles.vehicleWrapper}
      >
        {/* Botón "Ver todos los planes" - Solo desktop, arriba del auto */}
        <Link 
          to="/planes"
          className={styles.verTodosPlanesButton}
        >
          Ver todos los planes
        </Link>
        
        {/* Imagen mobile */}
        <img
          src={IMAGE_MOBILE}
          alt="Peugeot 208 - Vista lateral para efecto parallax"
          className={`${styles.vehicleImage} ${styles.vehicleImageMobile}`}
          loading="lazy"
          decoding="async"
          width="600"
          height="400"
        />
        
        {/* Imagen desktop */}
        <img
          src={IMAGE_DESKTOP}
          alt="Peugeot 208 - Vista lateral para efecto parallax"
          className={`${styles.vehicleImage} ${styles.vehicleImageDesktop}`}
          loading="lazy"
          decoding="async"
          width="1200"
          height="800"
        />
      </div>

      {/* Contenedor de texto */}
      <div className={styles.textContainer}>
        {/* Versión Mobile */}
        <div className={styles.mobileText}>
          <h2 ref={hiddenTitleMobileRef} className={styles.hiddenTitle}>Planes de Financiación</h2>
          <p ref={textMobileRef} className={styles.text}>
            Consultá los planes disponibles y empezá hoy.
          </p>
          <Link to="/planes" className={styles.planesButton}>
            Ver Planes
          </Link>
        </div>
        
        {/* Versión Desktop */}
        <div className={styles.desktopText}>
          <div className={styles.desktopContent}>
            {/* Columna Izquierda: Título, Texto y Botones */}
            <div className={styles.leftColumn}>
              <h1 ref={mainTitleRef} className={styles.mainTitle}>
                PEUGEOT PLAN
              </h1>
              <p ref={textRef} className={styles.text}>
                Compra un PEUGEOT {modelo} en cuotas en pesos
              </p>
              
              {/* Botones de planes */}
              <div className={styles.planesButtons}>
                {planes.map((plan) => (
                  <button
                    key={plan.id}
                    className={`${styles.planButton} ${planSeleccionado?.id === plan.id ? styles.planButtonActive : ''}`}
                    onClick={() => setPlanSeleccionado(plan)}
                  >
                    {plan.plan}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Columna Derecha: Card del Plan Seleccionado (misma que página de planes) */}
            {planSeleccionado && (
              <div className={styles.rightColumn}>
                <PlanCardDesktop plan={planSeleccionado} modelo={modelo} obtenerVersionDelPlan={obtenerVersionDelPlan} />
              </div>
            )}
          </div>
        </div>
      </div>

    </section>
  )
}

// Memoizar componente para evitar re-renders innecesarios
export const ScrollParallaxTransition208 = memo(ScrollParallaxTransition208Component)

ScrollParallaxTransition208.displayName = 'ScrollParallaxTransition208'

export default ScrollParallaxTransition208

