/**
 * Nav - Componente de navegación principal
 * 
 * Características:
 * - Navegación responsive
 * - Logo y enlaces
 * - Menú hamburguesa para mobile
 * - Estados activos
 * - ✅ NUEVO: Preloading estratégico
 * 
 * @author Indiana Usados
 * @version 3.0.0 - Refactor: Usados y 0 KM como items principales (sin dropdown)
 */

import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { usePreloadRoute } from '@hooks'
import styles from './Nav.module.css'
import { shouldPreloadOnIdle, requestIdle } from '@utils'

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  // ✅ NUEVO: Hook de preloading estratégico
  const { preloadRoute, cancelPreload } = usePreloadRoute({
    delay: 150, // 150ms de delay para preload
    enabled: true
  })

  const isActive = (path) => location.pathname === path

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleScrollToFooter = (event) => {
    event.preventDefault()
    const footerEl = document.getElementById('contacto')
    if (footerEl) {
      footerEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    closeMenu()
  }

  // ✅ NUEVO: Funciones de preloading para rutas
  const handleUsadosPreload = () => {
    preloadRoute('/usados', () => import('@pages/Vehiculos'))
  }

  const handleNosotrosPreload = () => {
    preloadRoute('/nosotros', () => import('@pages/Nosotros'))
  }

  const handleHomePreload = () => {
    preloadRoute('/', () => import('@pages/Home'))
  }

  const handlePostventaPreload = () => {
    preloadRoute('/postventa', () => import('@pages/Postventa'))
  }

  // ✅ 0KM: Preload para la nueva sección
  const handle0kmPreload = () => {
    preloadRoute('/0km', () => import('@pages/CeroKilometros'))
  }

  // ✅ PLANES: Preload para la página de planes
  const handlePlanesPreload = () => {
    preloadRoute('/planes', () => import('@pages/Planes'))
  }

  // ✅ PRELOAD ON IDLE: Solo en buenas redes y en rutas ligeras
  useEffect(() => {
    if (!shouldPreloadOnIdle()) return
    // Evitar hacerlo en páginas pesadas; priorizamos home
    const isLightRoute = location.pathname === '/'
    if (!isLightRoute) return
    const cancel = requestIdle(() => {
      // Precargar módulos críticos probables
      import('@pages/Postventa')
      import('@pages/Vehiculos') // Mantener import para compatibilidad
    })
    return () => {
      if (typeof cancel === 'number') clearTimeout(cancel)
    }
  }, [location.pathname])


  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link 
          className={styles.brand} 
          to="/" 
          onClick={closeMenu}
          onMouseEnter={handleHomePreload}
          onMouseLeave={() => cancelPreload('/')}
        >
          <img 
            src="/assets/logos/brands/indiana-final.webp" 
            alt="Logo Indiana" 
            className={styles.logo}
            width="200"
            height="80"
          />
        </Link>
        
        <button 
          className={styles.mobileMenu}
          onClick={toggleMenu}
          aria-label="Toggle navigation"
          aria-expanded={isMenuOpen}
        >
          <span className={styles.hamburger}>
            <span className={styles.line}></span>
            <span className={styles.line}></span>
            <span className={styles.line}></span>
          </span>
        </button>
        
        <div className={`${styles.nav} ${isMenuOpen ? styles.open : ''}`}>
          <div className={styles.navList}>
            <Link 
              className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`} 
              to="/"
              aria-current={isActive('/') ? 'page' : undefined}
              onClick={closeMenu}
              onMouseEnter={handleHomePreload}
              onMouseLeave={() => cancelPreload('/')}
            >
              Inicio
            </Link>
            
            {/* ✅ Peugeot | 0 KM */}
            <Link 
              className={`${styles.navLink} ${isActive('/0km') ? styles.active : ''}`} 
              to="/0km"
              aria-current={isActive('/0km') ? 'page' : undefined}
              onClick={closeMenu}
              onMouseEnter={handle0kmPreload}
              onMouseLeave={() => cancelPreload('/0km')}
            >
              Peugeot <span className={styles.navDivider}>|</span> 0 KM
            </Link>
            
            {/* ✅ Planes */}
            <Link 
              className={`${styles.navLink} ${isActive('/planes') ? styles.active : ''}`} 
              to="/planes"
              aria-current={isActive('/planes') ? 'page' : undefined}
              onClick={closeMenu}
              onMouseEnter={handlePlanesPreload}
              onMouseLeave={() => cancelPreload('/planes')}
            >
              Planes
            </Link>
            
            {/* ✅ Usados | Multimarca */}
            <Link 
              className={`${styles.navLink} ${isActive('/usados') ? styles.active : ''}`} 
              to="/usados"
              aria-current={isActive('/usados') ? 'page' : undefined}
              onClick={closeMenu}
              onMouseEnter={handleUsadosPreload}
              onMouseLeave={() => cancelPreload('/usados')}
            >
              Usados <span className={styles.navDivider}>|</span> Multimarca
            </Link>
            <Link 
              className={`${styles.navLink} ${isActive('/postventa') ? styles.active : ''}`} 
              to="/postventa"
              aria-current={isActive('/postventa') ? 'page' : undefined}
              onClick={closeMenu}
              onMouseEnter={handlePostventaPreload}
              onMouseLeave={() => cancelPreload('/postventa')}
            >
              Postventa
            </Link>
            <a 
              className={styles.navLink}
              href="#contacto"
              onClick={handleScrollToFooter}
            >
              Contacto
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Nav 