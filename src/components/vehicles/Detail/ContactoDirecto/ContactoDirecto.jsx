/**
 * ContactoDirecto - Componente de contacto directo refactorizado
 * 
 * Layout 70/30: izquierda (título, subtítulo, botón) / derecha (icono WhatsApp)
 * Solo WhatsApp, sin Gmail
 * 
 * @author Indiana Usados
 * @version 2.0.0 - Refactorización completa
 */

import { WhatsAppIconOptimized } from '@ui/icons'
import styles from './ContactoDirecto.module.css'

/**
 * Componente ContactoDirecto
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título principal (default: "Contacto Directo")
 * @param {string} props.subtitle - Subtítulo descriptivo (default: "¿Consultas sobre este vehículo?")
 * @param {string} props.whatsNumber - Número de WhatsApp formato internacional (ej: 549XXXXXXXXXX)
 * @param {string} props.className - Clases CSS adicionales para extender estilos
 * @param {string} props.message - Mensaje predefinido para WhatsApp (opcional)
 */
const ContactoDirecto = ({
  title = "Contacto Directo",
  subtitle = "¿Consultas sobre este vehículo?",
  whatsNumber = "5491123456789", // TODO: Reemplazar con número real
  className = "",
  message = ""
}) => {
  // Construir URL de WhatsApp
  // Formato esperado del número: 549XXXXXXXXXX (código país + área + número)
  const whatsappUrl = `https://wa.me/${whatsNumber}${message ? `?text=${encodeURIComponent(message)}` : ''}`

  const handleWhatsAppClick = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className={`${styles.container} ${className}`}>
      {/* 70% - Contenido izquierdo */}
      <div className={styles.content}>
        <h4 className={styles.title}>{title}</h4>
        <p className={styles.subtitle}>{subtitle}</p>
        <button 
          className={styles.whatsappButton}
          onClick={handleWhatsAppClick}
          aria-label={`Abrir WhatsApp para contactar sobre este vehículo`}
        >
          Ir a WhatsApp
        </button>
      </div>

      {/* 30% - Icono derecho */}
      <div className={styles.iconContainer}>
        <button
          className={styles.iconButton}
          onClick={handleWhatsAppClick}
          aria-label="Contactar por WhatsApp"
        >
          <WhatsAppIconOptimized 
            size={40} 
            className={styles.whatsappIcon}
          />
        </button>
      </div>
    </div>
  )
}

export default ContactoDirecto
