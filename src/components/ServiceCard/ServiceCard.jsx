/**
 * ServiceCard - Componente reutilizable para tarjetas de servicios
 * 
 * Layout: 30% imagen / 70% contenido
 * Responsive: Stack vertical en móviles
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import { WhatsAppContact } from '@ui'
import styles from './ServiceCard.module.css'

// Importar imágenes locales
import taller2Image from '@assets/taller-2.webp'
import taller3Image from '@assets/taller-3-jpeg.webp'
import tallerMotorImage from '@assets/taller-motor.webp'

// Mapeo de imágenes locales
const imageMap = {
  'taller-2': taller2Image,
  'taller-3-jpeg': taller3Image,
  'taller-motor': tallerMotorImage
}

/**
 * Componente ServiceCard
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título principal del servicio
 * @param {string} props.subtitle - Subtítulo del servicio
 * @param {string} props.description - Descripción del servicio
 * @param {string} props.image - Clave de la imagen (taller-2, taller-3-jpeg, taller-motor)
 * @param {string} props.alt - Texto alternativo para la imagen
 * @param {boolean} props.reverse - Si true, invierte el orden (imagen a la derecha)
 * @param {string} props.whatsappMessage - Mensaje personalizado para WhatsApp
 */
export const ServiceCard = ({
  title,
  subtitle,
  description,
  image,
  alt,
  reverse = false,
  whatsappMessage = ""
}) => {
  const imageSrc = imageMap[image] || taller2Image // Fallback a taller-2

  // Generar mensaje de WhatsApp personalizado
  const defaultMessage = `¡Hola! Quiero reservar un turno para el servicio de ${title.toLowerCase()}. ¿Cuál es la disponibilidad más cercana?`
  const finalMessage = whatsappMessage || defaultMessage

  return (
    <article className={`${styles.card} ${reverse ? styles.reverse : ''}`}>
      <div className={styles.imageContainer}>
        <img
          src={imageSrc}
          alt={alt}
          className={styles.image}
          loading="lazy"
          decoding="async"
        />
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <h4 className={styles.subtitle}>{subtitle}</h4>
        <p className={styles.description}>{description}</p>
        
        {/* Componente de contacto WhatsApp simplificado */}
        <div className={styles.contactSection}>
          <WhatsAppContact
            text="Solicitar Turno"
            message={finalMessage}
          />
        </div>
      </div>
    </article>
  )
}

export default ServiceCard
