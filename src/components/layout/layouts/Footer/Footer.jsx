/**
 * Footer - Componente de pie de página MODERNIZADO
 * 
 * Características:
 * - Card elevada con texto
 * - Tres módulos informativos data-driven
 * - Grid responsive 3→1
 * - Íconos SVG optimizados
 * - Accesibilidad completa
 * - Integrado con design tokens
 * 
 * @author Indiana Usados
 * @version 2.1.0 - Optimizado sin imágenes
 */

import ElevatedCard from './ElevatedCard'
import FooterModules from './FooterModules'
import styles from './Footer.module.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      {/* ✅ CARD 1 - Texto 50/50 (primer hijo del footer) */}
      <ElevatedCard />
      
      <div className={styles.container}>
        {/* ✅ CARDS 2-4 - Módulos informativos */}
        <FooterModules />
        
        {/* ✅ LÍNEA DE COPYRIGHT */}
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