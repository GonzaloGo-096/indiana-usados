/**
 * Footer - Componente de pie de página
 * 
 * Características:
 * - Información de contacto
 * - Enlaces importantes
 * - Diseño responsive
 * - Secciones organizadas
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.section}>
            <p className={styles.description}>
              Indiana Usados es una empresa dedicada a la venta de vehículos usados de alta calidad.
              Ofrecemos garantía y financiamiento para que encuentres el auto de tus sueños.
            </p>
          </div>
          
          <div className={styles.section}>
            <div className={styles.contactInfo}>
              <p className={styles.contactItem}>
                <span className={styles.icon}>📞</span>
                <span>123-456-7890</span>
              </p>
              <p className={styles.contactItem}>
                <span className={styles.icon}>📧</span>
                <span>info@indianausados.com</span>
              </p>
              <p className={styles.contactItem}>
                <span className={styles.icon}>📍</span>
                <span>Av. Principal 123, Ciudad</span>
              </p>
            </div>
          </div>
          
          <div className={styles.section}>
            <ul className={styles.linkList}>
              <li className={styles.linkItem}>
                <Link to="/" className={styles.link}>Home</Link>
              </li>
              <li className={styles.linkItem}>
                <Link to="/vehiculos" className={styles.link}>Vehículos</Link>
              </li>
              <li className={styles.linkItem}>
                <Link to="/nosotros" className={styles.link}>Nosotros</Link>
              </li>
              <li className={styles.linkItem}>
                <a 
                  href="https://peugeotindiana.com.ar/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.link}
                >
                  0 km ↗
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {currentYear} Indiana Usados. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 