/**
 * VersionCarousel - Componente de carrusel para navegación de versiones
 * 
 * Responsabilidades:
 * - Navegación por swipe (scroll)
 * - Navegación por teclado (accesibilidad)
 * - Sincronización de scroll programático
 * - Gestión de focus y ARIA
 * 
 * NO decide qué renderizar, solo controla la navegación.
 * El contenido se renderiza mediante render prop.
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React, { useRef, useEffect, useCallback } from 'react'
import styles from './VersionCarousel.module.css'
import CarouselDots from '@components/ui/CarouselDots/CarouselDots'

/**
 * @param {Object} props
 * @param {Array} props.versions - Array de versiones a mostrar
 * @param {number} props.activeIndex - Índice de la versión activa
 * @param {Function} props.onChangeIndex - Callback cuando cambia el índice (index) => void
 * @param {string} props.ariaLabel - Label descriptivo para screen readers
 * @param {Function} props.children - Render prop: (version, index, isActive) => ReactNode
 */
export const VersionCarousel = ({
  versions = [],
  activeIndex = 0,
  onChangeIndex,
  ariaLabel = 'Carrusel de versiones',
  children
}) => {
  const carouselRef = useRef(null)
  // Canal explícito de comunicación: marca cuando el scroll es iniciado por el sistema
  // (no por el usuario). Permite distinguir scroll programático de swipe del usuario.
  const isScrollingProgrammaticallyRef = useRef(false)

  // Scroll programático: sincroniza posición cuando cambia activeIndex
  // Marca explícitamente que el scroll es programático antes de ejecutarlo
  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return
    
    // Validar que activeIndex esté en rango válido
    if (activeIndex < 0 || activeIndex >= versions.length) {
      return
    }
    
    // Marcar que el scroll es iniciado por el sistema (no por el usuario)
    isScrollingProgrammaticallyRef.current = true
    
    const slideWidth = carousel.offsetWidth
    // Validar que slideWidth sea válido antes de usar
    if (slideWidth <= 0) {
      isScrollingProgrammaticallyRef.current = false
      return
    }
    
    carousel.scrollTo({
      left: activeIndex * slideWidth,
      behavior: 'smooth'
    })
    
    // Resetear el flag después de que el scroll termine
    // scrollTo con 'smooth' toma ~300-500ms, usar timeout seguro para resetear
    const resetTimeout = setTimeout(() => {
      isScrollingProgrammaticallyRef.current = false
    }, 600) // Tiempo suficiente para que termine cualquier scroll smooth
    
    return () => {
      clearTimeout(resetTimeout)
      // Asegurar reset en cleanup por si el componente se desmonta
      isScrollingProgrammaticallyRef.current = false
    }
  }, [activeIndex, versions.length])

  // Detectar swipe en mobile para cambiar versión
  // Solo procesa scrolls iniciados por el usuario, ignora scrolls programáticos
  const handleCarouselScroll = useCallback(() => {
    // Si el scroll fue iniciado por el sistema (scrollTo), ignorarlo
    // Esto previene loops y ambigüedad semántica
    if (isScrollingProgrammaticallyRef.current) {
      // Resetear el flag después de ignorar (el scroll programático ya terminó)
      // Esto permite que futuros scrolls del usuario sean procesados correctamente
      isScrollingProgrammaticallyRef.current = false
      return
    }
    
    // Scroll iniciado por el usuario (swipe) - procesar normalmente
    const carousel = carouselRef.current
    if (!carousel) return
    
    const slideWidth = carousel.offsetWidth
    // Validar que slideWidth sea válido antes de usar
    if (slideWidth <= 0) {
      return
    }
    
    const scrollPosition = carousel.scrollLeft
    const newIndex = Math.round(scrollPosition / slideWidth)
    
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < versions.length) {
      // Validar que onChangeIndex sea una función antes de invocarla
      if (typeof onChangeIndex !== 'function') {
        console.warn('VersionCarousel: onChangeIndex debe ser una función')
        return
      }
      onChangeIndex(newIndex)
    }
  }, [activeIndex, versions.length, onChangeIndex])

  // Navegación por teclado para accesibilidad
  // Permite navegar el carrusel usando teclado sin romper el scroll existente
  // Implementa patrón ARIA de carrusel: ArrowLeft/Right para navegar, Home/End para extremos
  const handleCarouselKeyDown = useCallback((e) => {
    // Verificar que el carrusel o uno de sus hijos tiene focus
    // Esto previene que teclas se procesen cuando el focus está en otro lugar
    // y mantiene el comportamiento de teclado predecible
    if (e.currentTarget !== document.activeElement && !e.currentTarget.contains(document.activeElement)) {
      return
    }

    let targetIndex = null

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        // Ir a versión anterior
        targetIndex = Math.max(0, activeIndex - 1)
        break
      case 'ArrowRight':
        e.preventDefault()
        // Ir a versión siguiente
        targetIndex = Math.min(versions.length - 1, activeIndex + 1)
        break
      case 'Home':
        e.preventDefault()
        // Ir a primera versión
        targetIndex = 0
        break
      case 'End':
        e.preventDefault()
        // Ir a última versión
        targetIndex = versions.length - 1
        break
      default:
        // No es una tecla de navegación, permitir comportamiento por defecto
        return
    }

    // Cambiar versión si el índice es válido y diferente al actual
    if (targetIndex !== null && targetIndex !== activeIndex) {
      // Validar que onChangeIndex sea una función antes de invocarla
      if (typeof onChangeIndex !== 'function') {
        console.warn('VersionCarousel: onChangeIndex debe ser una función')
        return
      }
      onChangeIndex(targetIndex)
    }
  }, [activeIndex, versions.length, onChangeIndex])

  // Debounce del scroll para evitar múltiples cambios
  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return
    
    let scrollTimeout
    const handleScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(handleCarouselScroll, 100)
    }
    
    carousel.addEventListener('scroll', handleScroll)
    return () => {
      carousel.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [handleCarouselScroll])

  return (
    <div className={styles.mobileContent}>
      {/* 
        Carrusel accesible: 
        - role="region" identifica el carrusel como una región navegable
        - aria-label describe el propósito del carrusel para screen readers
        - aria-live="polite" anuncia cambios de versión sin interrumpir
        - tabIndex={0} permite navegación por teclado
        - onKeyDown maneja navegación con teclado (ArrowLeft/Right, Home/End)
      */}
      <div 
        ref={carouselRef}
        className={styles.carousel}
        role="region"
        aria-label={ariaLabel}
        aria-live="polite"
        tabIndex={0}
        onKeyDown={handleCarouselKeyDown}
      >
        {versions.map((version, index) => {
          const isActive = index === activeIndex
          return (
            /* 
              Accesibilidad - Slide del carrusel:
              - role="group": identifica cada slide como un grupo de contenido
              - aria-label: nombre descriptivo para screen readers
              - aria-current: marca el slide activo para screen readers
              - aria-posinset/aria-setsize: indica posición (ej: "1 de 5")
              - tabIndex dinámico:
                * Slide activo (0): navegable con Tab, recibe focus
                * Slides inactivos (-1): excluidos del orden de Tab pero
                  navegables con flechas del carrusel
              Esto mantiene orden lógico: solo el slide visible es accesible con Tab
            */
            <div 
              key={version.id} 
              className={styles.carouselSlide}
              role="group"
              aria-label={`Versión ${version.nombreCorto || version.nombre || `#${index + 1}`}`}
              aria-current={isActive ? 'true' : undefined}
              aria-posinset={index + 1}
              aria-setsize={versions.length}
              tabIndex={isActive ? 0 : -1}
            >
              {children(version, index, isActive)}
            </div>
          )
        })}
      </div>
      {/* Indicador 'autocity' con navegación por dot */}
      <CarouselDots
        count={versions.length}
        activeIndex={activeIndex}
        variant="autocity"
        onDotClick={(i) => {
          if (typeof onChangeIndex === 'function') {
            onChangeIndex(i)
          }
        }}
      />
    </div>
  )
}

export default VersionCarousel

