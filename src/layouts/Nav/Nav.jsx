/**
 * Nav - Componente de navegación principal
 * 
 * Características:
 * - Navegación responsive
 * - Logo y enlaces
 * - Menú hamburguesa para mobile
 * - Estados activos
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from './Nav.module.css'
import logo from '../../assets/indiana-nav-logo.png'

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link className={styles.brand} to="/" onClick={closeMenu}>
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
            >
              Home
            </Link>
            <div className={styles.divider}></div>
            <Link 
              className={`${styles.navLink} ${isActive('/vehiculos') ? styles.active : ''}`} 
              to="/vehiculos"
              onClick={closeMenu}
            >
              Vehículos
            </Link>
            <div className={styles.divider}></div>
            <Link 
              className={`${styles.navLink} ${isActive('/nosotros') ? styles.active : ''}`} 
              to="/nosotros"
              onClick={closeMenu}
            >
              Nosotros
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Nav 