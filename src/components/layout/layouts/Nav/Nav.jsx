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

import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { usePreloadRoute } from '@hooks/usePreloadRoute'
import styles from './Nav.module.css'
import logo from '@assets/indiana-nav-logo.png'

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

  // ✅ NUEVO: Funciones de preloading para rutas
  const handleVehiculosPreload = () => {
    preloadRoute('/vehiculos', () => import('../../../../pages/Vehiculos'))
  }

  const handleNosotrosPreload = () => {
    preloadRoute('/nosotros', () => import('../../../../pages/Nosotros'))
  }

  const handleHomePreload = () => {
    preloadRoute('/', () => import('../../../../pages/Home'))
  }

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
              onClick={closeMenu}
              onMouseEnter={handleHomePreload}
              onMouseLeave={() => cancelPreload('/')}
            >
              Inicio
            </Link>
            <Link 
              className={`${styles.navLink} ${isActive('/vehiculos') ? styles.active : ''}`} 
              to="/vehiculos"
              onClick={closeMenu}
              onMouseEnter={handleVehiculosPreload}
              onMouseLeave={() => cancelPreload('/vehiculos')}
            >
              Autos usados
            </Link>
            <Link 
              className={`${styles.navLink} ${isActive('/nosotros') ? styles.active : ''}`} 
              to="/nosotros"
              onClick={closeMenu}
              onMouseEnter={handleNosotrosPreload}
              onMouseLeave={() => cancelPreload('/nosotros')}
            >
              Contacto
            </Link>
            <div className={styles.divider}></div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Nav 