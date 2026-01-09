/**
 * WhatsAppContact - Botón pill verde reutilizable para WhatsApp
 * 
 * Diseño: Botón pill verde con icono WhatsApp + texto personalizable
 * Reutilizable en cualquier parte con diferentes textos
 * 
 * @author Indiana Usados
 * @version 2.0.0 - Nuevo diseño pill
 */

import React from 'react'
import { WhatsAppIcon } from '@components/ui/icons'
import { config } from '@config'
import styles from './WhatsAppContact.module.css'

/**
 * Componente WhatsAppContact
 * @param {Object} props - Propiedades del componente
 * @param {string} props.text - Texto del botón (default: "Reservá tu turno")
 * @param {string} props.phone - Número de WhatsApp formato internacional (default: config.contact.whatsapp)
 * @param {string} props.message - Mensaje predefinido para WhatsApp (opcional)
 * @param {string} props.className - Clases CSS adicionales para extender estilos
 */
const WhatsAppContact = ({
  text = "Reservá tu turno",
  phone = config.contact.whatsapp,
  message = "",
  className = ""
}) => {
  // Construir URL de WhatsApp
  const whatsappUrl = `https://wa.me/${phone}${message ? `?text=${encodeURIComponent(message)}` : ''}`

  const handleWhatsAppClick = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <button 
      className={`${styles.whatsappButton} ${className}`}
      onClick={handleWhatsAppClick}
      aria-label={`${text} por WhatsApp`}
    >
      <WhatsAppIcon 
        size={20} 
        color="#000000"
        className={styles.whatsappIcon}
      />
      <span className={styles.buttonText}>{text}</span>
    </button>
  )
}

export default WhatsAppContact
