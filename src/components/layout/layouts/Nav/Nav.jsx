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
 * @version 2.0.0 - Migración a Cloudinary
 */

import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { usePreloadRoute } from '@hooks'
import styles from './Nav.module.css'
import { shouldPreloadOnIdle, requestIdle } from '@utils'

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAutosDropdownOpen, setIsAutosDropdownOpen] = useState(false)
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
  const handleVehiculosPreload = () => {
    preloadRoute('/vehiculos', () => import('@pages/Vehiculos'))
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

  // ✅ PRELOAD ON IDLE: Solo en buenas redes y en rutas ligeras
  useEffect(() => {
    if (!shouldPreloadOnIdle()) return
    // Evitar hacerlo en páginas pesadas; priorizamos home
    const isLightRoute = location.pathname === '/'
    if (!isLightRoute) return
    const cancel = requestIdle(() => {
      // Precargar módulos críticos probables
      import('@pages/Postventa')
      import('@pages/Vehiculos')
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
            
            {/* ✅ NUEVO: Dropdown de Autos */}
            <div 
              className={styles.dropdown}
              onMouseEnter={() => setIsAutosDropdownOpen(true)}
              onMouseLeave={() => setIsAutosDropdownOpen(false)}
            >
              <button 
                className={`${styles.dropdownToggle} ${isActive('/vehiculos') ? styles.active : ''}`}
                onClick={() => setIsAutosDropdownOpen(!isAutosDropdownOpen)}
              >
                Autos
                <span className={`${styles.dropdownArrow} ${isAutosDropdownOpen ? styles.dropdownArrowOpen : ''}`}>▼</span>
              </button>
              
              <div className={`${styles.dropdownMenu} ${isAutosDropdownOpen ? styles.dropdownMenuOpen : ''}`}>
                <Link 
                  className={styles.dropdownItem}
                  to="/vehiculos"
                  aria-current={isActive('/vehiculos') ? 'page' : undefined}
                  onClick={() => {
                    closeMenu()
                    setIsAutosDropdownOpen(false)
                  }}
                  onMouseEnter={handleVehiculosPreload}
                  onMouseLeave={() => cancelPreload('/vehiculos')}
                >
                  Usados
                </Link>
                <Link 
                  className={styles.dropdownItem}
                  to="/0km"
                  onClick={() => {
                    closeMenu()
                    setIsAutosDropdownOpen(false)
                  }}
                  onMouseEnter={handle0kmPreload}
                  onMouseLeave={() => cancelPreload('/0km')}
                >
                  0 KM
                </Link>
              </div>
            </div>
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