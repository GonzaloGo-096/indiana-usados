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
 * @version 1.1.0 - Preloading estratégico
 */

import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { usePreloadRoute } from '@hooks'
import styles from './Nav.module.css'
import { shouldPreloadOnIdle, requestIdle } from '@utils'
import logo from '@assets/indiana-nav-logo.png'

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
          <img src={logo} alt="Indiana Usados" className={styles.logo} />
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
                <a 
                  className={styles.dropdownItem}
                  href="https://peugeotindiana.com.ar/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    closeMenu()
                    setIsAutosDropdownOpen(false)
                  }}
                >
                  Peugeot / 0 KM
                </a>
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