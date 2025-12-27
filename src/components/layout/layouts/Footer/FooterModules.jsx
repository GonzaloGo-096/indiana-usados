/**
 * FooterModules - Módulos informativos del footer con accordion mobile
 * 
 * Características:
 * - Accordion slide-down/slide-up en mobile
 * - Grid 3 columnas en desktop
 * - Data-driven desde configuración
 * - Íconos SVG inline optimizados
 * - Accesibilidad completa
 * 
 * @author Indiana Usados
 * @version 2.0.0 - Accordion mobile-first
 */

import { useState } from 'react'
import { ChevronIcon } from '@components/ui/icons'
import { footerModules, footerIcons } from './footerConfig.jsx'
import styles from './FooterModules.module.css'

/**
 * Componente individual para cada ítem
 */
const FooterItem = ({ item }) => {
  const IconComponent = footerIcons[item.icon]
  
  const content = (
    <>
      <span className={styles.itemIcon}>
        {IconComponent}
      </span>
      <span className={styles.itemText}>{item.text}</span>
    </>
  )

  // Si es un enlace
  if (item.type === 'link') {
    return (
      <li className={styles.moduleItem}>
        <a
          href={item.href}
          className={styles.itemLink}
          {...(item.external && {
            target: '_blank',
            rel: 'noopener noreferrer'
          })}
          aria-label={item.external ? `${item.text} (se abre en nueva ventana)` : item.text}
        >
          {content}
        </a>
      </li>
    )
  }

  // Si es solo texto
  return (
    <li className={styles.moduleItem}>
      <span className={styles.itemContent}>
        {content}
      </span>
    </li>
  )
}

/**
 * Wrapper para ChevronIcon con estilos del accordion
 */
const AccordionChevron = () => (
  <ChevronIcon size={20} className={styles.chevron} />
)

/**
 * Componente principal de módulos con accordion
 */
const FooterModules = () => {
  // Estado para controlar qué módulos están abiertos (por ID)
  const [openModules, setOpenModules] = useState({})

  // Toggle para abrir/cerrar un módulo
  const toggleModule = (moduleId) => {
    setOpenModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }))
  }

  return (
    <div className={styles.modulesWrapper}>
      {/* Título principal */}
      <h2 className={styles.sectionTitle}>Contacto</h2>
      
      <div className={styles.modulesGrid}>
        {footerModules.map((module) => {
          const isOpen = openModules[module.id]
          
          return (
            <div 
              key={module.id} 
              className={`${styles.module} ${isOpen ? styles.moduleOpen : ''}`}
            >
              {/* Título clickable con chevron */}
              <button
                type="button"
                className={styles.moduleHeader}
                onClick={() => toggleModule(module.id)}
                aria-expanded={isOpen}
                aria-controls={`module-content-${module.id}`}
              >
                <h3 className={styles.moduleTitle}>{module.title}</h3>
                <AccordionChevron />
              </button>
              
              {/* Contenido colapsable */}
              <div 
                id={`module-content-${module.id}`}
                className={styles.moduleContent}
              >
                <ul className={styles.moduleList}>
                  {module.items.map((item, index) => (
                    <FooterItem key={`${module.id}-${index}`} item={item} />
                  ))}
                </ul>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FooterModules
