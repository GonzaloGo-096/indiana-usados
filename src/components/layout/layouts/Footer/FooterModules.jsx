/**
 * FooterModules - Módulos informativos del footer (Cards 2-4)
 * 
 * Características:
 * - Grid 3→1 columnas responsive
 * - Data-driven desde configuración
 * - Íconos SVG inline optimizados
 * - Accesibilidad completa
 * - Integrado con design tokens
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
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
 * Componente principal de módulos
 */
const FooterModules = () => {
  return (
    <div className={styles.modulesGrid}>
      {footerModules.map((module) => (
        <div key={module.id} className={styles.module}>
          <h3 className={styles.moduleTitle}>{module.title}</h3>
          <ul className={styles.moduleList}>
            {module.items.map((item, index) => (
              <FooterItem key={`${module.id}-${index}`} item={item} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default FooterModules
