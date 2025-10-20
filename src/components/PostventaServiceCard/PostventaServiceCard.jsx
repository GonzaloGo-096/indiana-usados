/**
 * PostventaServiceCard - Componente específico para servicios de postventa
 * 
 * Diseño: Card horizontal con imagen arriba, título, descripción y botón específico
 * Layout: 3 cards en fila horizontal (desktop), stack vertical (móvil)
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import { WhatsAppContact } from '@ui'
import styles from './PostventaServiceCard.module.css'

// Importar imágenes locales
import taller2Image from '@assets/taller-2.jpeg'
import taller3Image from '@assets/taller-3-jpeg.jpeg'
import tallerMotorImage from '@assets/taller-motor.jpg'

// Mapeo de imágenes locales
const imageMap = {
  'taller-2': taller2Image,
  'taller-3-jpeg': taller3Image,
  'taller-motor': tallerMotorImage
}

/**
 * Componente PostventaServiceCard
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título del servicio
 * @param {string} props.description - Descripción del servicio
 * @param {string} props.image - Clave de la imagen (taller-2, taller-3-jpeg, taller-motor)
 * @param {string} props.alt - Texto alternativo para la imagen
 * @param {string} props.buttonText - Texto del botón específico
 * @param {string} props.whatsappMessage - Mensaje personalizado para WhatsApp
 */
export const PostventaServiceCard = ({
  title,
  description,
  image,
  alt,
  buttonText,
  whatsappMessage = ""
}) => {
  const imageSrc = imageMap[image] || taller2Image // Fallback a taller-2

  // Generar mensaje de WhatsApp personalizado
  const defaultMessage = `¡Hola! Me interesa el servicio de ${title.toLowerCase()}. ${whatsappMessage || '¿Podrían darme más información?'}`
  const finalMessage = whatsappMessage || defaultMessage

  return (
    <article className={styles.card}>
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
        <p className={styles.description}>{description}</p>
        
        <div className={styles.buttonContainer}>
          <WhatsAppContact
            text={buttonText}
            message={finalMessage}
          />
        </div>
      </div>
    </article>
  )
}

export default PostventaServiceCard
