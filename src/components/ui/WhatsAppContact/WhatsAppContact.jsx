/**
 * WhatsAppContact - Componente reutilizable para contacto por WhatsApp
 * 
 * Basado en ContactoDirecto pero más flexible y reutilizable
 * Layout 70/30: izquierda (título, subtítulo, botón) / derecha (icono WhatsApp)
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import { WhatsAppIconOptimized } from '@ui/icons'
import styles from './WhatsAppContact.module.css'

/**
 * Componente WhatsAppContact
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título principal (default: "Contacto Directo")
 * @param {string} props.subtitle - Subtítulo descriptivo (default: "¿Consultas?")
 * @param {string} props.whatsNumber - Número de WhatsApp formato internacional (ej: 549XXXXXXXXXX)
 * @param {string} props.className - Clases CSS adicionales para extender estilos
 * @param {string} props.message - Mensaje predefinido para WhatsApp (opcional)
 * @param {string} props.buttonText - Texto del botón (default: "Ir a WhatsApp")
 * @param {boolean} props.compact - Modo compacto (default: false)
 * @param {boolean} props.hideTitle - Ocultar título y subtítulo (default: false)
 */
const WhatsAppContact = ({
  title = "Contacto Directo",
  subtitle = "¿Consultas?",
  whatsNumber = "5491123456789", // TODO: Reemplazar con número real
  className = "",
  message = "",
  buttonText = "Ir a WhatsApp",
  compact = false,
  hideTitle = false
}) => {
  // Construir URL de WhatsApp
  // Formato esperado del número: 549XXXXXXXXXX (código país + área + número)
  const whatsappUrl = `https://wa.me/${whatsNumber}${message ? `?text=${encodeURIComponent(message)}` : ''}`

  const handleWhatsAppClick = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className={`${styles.container} ${compact ? styles.compact : ''} ${className}`}>
      {/* Icono izquierdo */}
      <div className={styles.iconContainer}>
        <button
          className={styles.iconButton}
          onClick={handleWhatsAppClick}
          aria-label="Contactar por WhatsApp"
        >
          <WhatsAppIconOptimized 
            size={compact ? 32 : 40} 
            className={styles.whatsappIcon}
          />
        </button>
      </div>

      {/* Contenido derecho */}
      <div className={`${styles.content} ${hideTitle ? styles.noTitle : ''}`}>
        {!hideTitle && <h4 className={styles.title}>{title}</h4>}
        <button 
          className={styles.whatsappButton}
          onClick={handleWhatsAppClick}
          aria-label={`Abrir WhatsApp para contactar`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  )
}

export default WhatsAppContact
