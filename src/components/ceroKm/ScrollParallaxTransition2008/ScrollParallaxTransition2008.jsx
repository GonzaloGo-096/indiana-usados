/**
 * ScrollParallaxTransition2008 - Sección premium de transición visual con scroll parallax
 * 
 * Componente específico para el modelo Peugeot 2008.
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
 * @version 1.0.0 - Versión inicial para 2008
 */

import React, { useEffect, useRef, useState, useCallback, memo } from 'react'
import styles from './ScrollParallaxTransition2008.module.css'

// URLs de imágenes reales para 2008
const IMAGE_MOBILE = 'https://res.cloudinary.com/drbeomhcu/image/upload/v1767753919/sm_258118112_peugeot-2008-2019-side-view_4x_qnav8w.webp'
const IMAGE_DESKTOP = 'https://res.cloudinary.com/drbeomhcu/image/upload/v1767753896/sm_258118112_peugeot-2008-2019-side-view_4x_vuh4rj.webp'

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
    endProgress: 0.95,    // El movimiento termina cuando está al 95% del scroll - Arranca más arriba
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
 * Componente ScrollParallaxTransition2008
 * Memoizado para evitar re-renders innecesarios
 */
const ScrollParallaxTransition2008Component = () => {
  // Refs
  const containerRef = useRef(null)
  const vehicleWrapperRef = useRef(null)
  const mainTitleRef = useRef(null)
  const titleRef = useRef(null)
  const textRef = useRef(null)
  
  // Estado
  const [isActive, setIsActive] = useState(false)
  
  // RAF ID para cleanup
  const rafIdRef = useRef(null)

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
      rootMargin: '50% 0px', // Activar cuando el top está al 50% del viewport
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
      // Resetear texto
      if (mainTitleRef.current) {
        mainTitleRef.current.style.opacity = '0'
        mainTitleRef.current.style.transform = 'translateY(20px)'
      }
      if (titleRef.current) {
        titleRef.current.style.opacity = '0'
        titleRef.current.style.transform = 'translateY(20px)'
      }
      if (textRef.current) {
        textRef.current.style.opacity = '0'
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
      
      // Aplicar animación al título principal, título y texto
      if (mainTitleRef.current) {
        mainTitleRef.current.style.opacity = textAnimation.opacity
        mainTitleRef.current.style.transform = `translateY(${textAnimation.translateY}px)`
        mainTitleRef.current.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out'
      }
      if (titleRef.current) {
        // El subtítulo aparece un poco después del título principal
        const subtitleDelay = 0.05 // 5% de delay
        const subtitleProgress = Math.max(0, textAnimation.opacity - subtitleDelay)
        const subtitleTranslateY = textAnimation.translateY + (subtitleDelay * 10)
        titleRef.current.style.opacity = subtitleProgress
        titleRef.current.style.transform = `translateY(${subtitleTranslateY}px)`
        titleRef.current.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out'
      }
      if (textRef.current) {
        // El texto aparece después del subtítulo
        const textDelay = 0.1 // 10% de delay
        const textProgress = Math.max(0, textAnimation.opacity - textDelay)
        const textTranslateY = textAnimation.translateY + (textDelay * 10)
        textRef.current.style.opacity = textProgress
        textRef.current.style.transform = `translateY(${textTranslateY}px)`
        textRef.current.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out'
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
      aria-label="Transición visual premium del Peugeot 2008"
    >
      {/* Fondo oscuro que transiciona a blanco */}
      <div className={styles.darkBackground} />
      <div className={styles.lightBackground} />

      {/* Contenedor del vehículo */}
      <div 
        ref={vehicleWrapperRef}
        className={styles.vehicleWrapper}
      >
        {/* Imagen mobile */}
        <img
          src={IMAGE_MOBILE}
          alt="Peugeot 2008 - Vista lateral para efecto parallax"
          className={`${styles.vehicleImage} ${styles.vehicleImageMobile}`}
          loading="lazy"
          decoding="async"
          width="600"
          height="400"
        />
        
        {/* Imagen desktop */}
        <img
          src={IMAGE_DESKTOP}
          alt="Peugeot 2008 - Vista lateral para efecto parallax"
          className={`${styles.vehicleImage} ${styles.vehicleImageDesktop}`}
          loading="lazy"
          decoding="async"
          width="1200"
          height="800"
        />
      </div>

      {/* Contenedor de texto */}
      <div className={styles.textContainer}>
        <h1 ref={mainTitleRef} className={styles.mainTitle} style={{ opacity: 0, transform: 'translateY(20px)' }}>
          Peugeot 2008
        </h1>
        <h2 ref={titleRef} className={styles.title} style={{ opacity: 0, transform: 'translateY(20px)' }}>
          Título del Contenido
        </h2>
        <p ref={textRef} className={styles.text} style={{ opacity: 0, transform: 'translateY(20px)' }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </div>

    </section>
  )
}

// Memoizar componente para evitar re-renders innecesarios
export const ScrollParallaxTransition2008 = memo(ScrollParallaxTransition2008Component)

ScrollParallaxTransition2008.displayName = 'ScrollParallaxTransition2008'

export default ScrollParallaxTransition2008

