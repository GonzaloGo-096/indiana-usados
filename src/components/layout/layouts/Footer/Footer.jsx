/**
 * Footer - Componente de pie de página simplificado
 * 
 * Características:
 * - Tres módulos informativos data-driven
 * - Grid responsive 3→1
 * - Íconos SVG optimizados
 * - Accesibilidad completa
 * - Integrado con design tokens
 * 
 * @author Indiana Usados
 * @version 3.0.0 - Simplificado sin card elevada
 */

import FooterModules from './FooterModules'
import styles from './Footer.module.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer} id="contacto" tabIndex="-1">
      <div className={styles.container}>
        {/* ✅ MÓDULOS INFORMATIVOS */}
        <FooterModules />
        
        {/* ✅ LÍNEA DE COPYRIGHT */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {currentYear} Indiana Usados. Derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer