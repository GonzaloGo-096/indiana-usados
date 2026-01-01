/**
 * VersionContent - Contenido de una versión (imagen, color, specs)
 * 
 * Componente reutilizable para mostrar el contenido de una versión.
 * Se usa tanto en mobile (carrusel) como en desktop (layout columnas).
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React, { memo } from 'react'
import { getBrandIcon, WhatsAppIcon } from '@components/ui/icons'
import { ColorSelector } from '../ColorSelector'
import { ModeloSpecs } from '../ModeloSpecs'
import { PdfDownloadButton } from '../PdfDownloadButton'
import styles from './VersionContent.module.css'


/**
 * @param {Object} props
 * @param {Object} props.version - Objeto versión activa
 * @param {string} props.modeloMarca - Marca del modelo (ej: 'Peugeot')
 * @param {string} props.modeloNombre - Nombre del modelo (ej: '2008')
 * @param {Object} props.colorActivo - Objeto color activo
 * @param {Array} props.coloresDisponibles - Array de colores disponibles
 * @param {Object} props.imagenActual - { url, alt, hasImage }
 * @param {Function} props.onColorChange - Callback al cambiar color
 * @param {string} props.layout - 'mobile' | 'desktop'
 */
export const VersionContent = memo(({
  version,
  modeloMarca = '',
  modeloNombre = '',
  colorActivo,
  coloresDisponibles,
  imagenActual,
  onColorChange,
  layout = 'mobile'
}) => {
  if (!version) return null

  const imageUrl = imagenActual?.url || null
  const imageAlt = imagenActual?.alt || `${modeloNombre} ${version.nombre}`

  // Formatear nombre de versión: GT en rojo, siglas en mayúsculas, resto capitalizado
  const formatVersionName = (nombre) => {
    // Formatear una palabra: siglas/códigos en mayúscula, resto capitalizado
    const formatWord = (word) => {
      const upper = word.toUpperCase()
      // Códigos alfanuméricos (T200, AM24, GT) o siglas cortas
      if (word.length <= 2 || /^[A-Z]+\d+$/i.test(word)) {
        return upper
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    }
    
    // Dividir por espacios, formatear cada palabra
    const palabras = nombre.split(' ')
    
    return palabras.map((palabra, i) => {
      const formatted = formatWord(palabra)
      const upperWord = palabra.toUpperCase()
      
      // Si es GT, ponerlo en rojo
      if (upperWord === 'GT') {
        return (
          <span key={i}>
            {i > 0 && ' '}
            <span className={styles.gtText}>{formatted}</span>
          </span>
        )
      }
      
      return (i > 0 ? ' ' : '') + formatted
    })
  }

  // Obtener icono de marca
  const BrandIcon = getBrandIcon(modeloMarca)

  // Renderizar título según el formato del modelo
  const renderTitulo = () => {
    // Si el modelo es 2008, 3008 o 5008, formato especial sin formateo de versión
    if (modeloNombre === '2008' || modeloNombre === '3008' || modeloNombre === '5008') {
      return (
        <>
          {BrandIcon && <BrandIcon className={styles.brandIcon} />}
          {modeloNombre} {version.nombre}
        </>
      )
    }
    
    // Formato estándar para otros modelos
    return (
      <>
        {BrandIcon && <BrandIcon className={styles.brandIcon} />}
        {modeloNombre && `${modeloNombre} `}
        {formatVersionName(version.nombre)}
      </>
    )
  }

  // Layout mobile: todo en columna
  if (layout === 'mobile') {
    return (
      <article className={styles.mobileContainer}>
        {/* Imagen */}
        <div className={styles.imageContainer}>
          {imageUrl && (
            <img
              src={imageUrl}
              alt={imageAlt}
              className={styles.image}
              loading="lazy"
              decoding="async"
            />
          )}
        </div>

        {/* Selector de colores - Solo mostrar si hay colores disponibles */}
        {coloresDisponibles && coloresDisponibles.length > 0 && (
          <div className={styles.colorSection}>
            <h3 className={styles.colorTitle}>Colores</h3>
            <ColorSelector
              colores={coloresDisponibles}
              colorActivo={colorActivo?.key}
              onColorChange={onColorChange}
              size="md"
            />
            {colorActivo && (
              <span className={styles.colorLabel}>{colorActivo.label}</span>
            )}
          </div>
        )}

        {/* Info */}
        <div className={styles.infoSection}>
          <h2 className={styles.versionTitle}>{renderTitulo()}</h2>
          <p className={styles.versionDescription}>{version.descripcion}</p>
        </div>

        {/* Equipamiento o Specs */}
        {version.equipamiento ? (
          <div className={styles.equipamientoSection}>
            {version.equipamiento.titulo && (
              <h3 className={styles.equipamientoTitle}>{version.equipamiento.titulo}</h3>
            )}
            <ul className={styles.equipamientoList}>
              {version.equipamiento.items.map((item, index) => (
                <li key={index} className={styles.equipamientoItem}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : version.specs ? (
          <div className={styles.specsSection}>
            <ModeloSpecs specs={version.specs} variant="compact" />
          </div>
        ) : null}

        {/* Botones de acción: PDF y WhatsApp */}
        <div className={`${styles.actionsContainer} ${
          !version.pdf ? styles.singleButton : ''
        }`}>
          {version.pdf && (
            <PdfDownloadButton
              href={version.pdf.href}
              label={version.pdf.label || 'Ficha Técnica'}
              fileSize={version.pdf.fileSize}
              variant={version.pdf.variant || 'primary'}
              size={version.pdf.size || 'medium'}
              className={styles.actionButton}
            />
          )}
          <a
            href={`https://wa.me/543816295959?text=${encodeURIComponent(`Hola! Me interesa el ${modeloMarca} ${modeloNombre} ${version.nombreCorto}${colorActivo ? ` en color ${colorActivo.label}` : ''}`)}`}
            className={styles.whatsappButton}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Solicitar más información por WhatsApp"
          >
            <WhatsAppIcon size={18} className={styles.actionIcon} />
            <span>Solicitar más información</span>
          </a>
        </div>
      </article>
    )
  }

  // Layout desktop: 2 columnas (imagen izq, info der)
  return (
    <article className={styles.desktopWrapper}>
      <div className={styles.desktopContainer}>
        {/* Columna izquierda: Imagen + Color */}
        <div className={styles.leftColumn}>
          <div className={styles.imageContainer}>
            {imageUrl && (
              <img
                src={imageUrl}
                alt={imageAlt}
                className={styles.image}
                loading="lazy"
                decoding="async"
              />
            )}
          </div>

          {/* Selector de colores - Solo mostrar si hay colores disponibles */}
          {coloresDisponibles && coloresDisponibles.length > 0 && (
            <div className={styles.colorSection}>
              <h3 className={styles.colorTitle}>Colores</h3>
              <ColorSelector
                colores={coloresDisponibles}
                colorActivo={colorActivo?.key}
                onColorChange={onColorChange}
                size="lg"
              />
              {colorActivo && (
                <span className={styles.colorLabel}>{colorActivo.label}</span>
              )}
            </div>
          )}
        </div>

        {/* Columna derecha: Info + Equipamiento/Specs */}
        <div className={styles.rightColumn}>
          <h2 className={styles.versionTitle}>{renderTitulo()}</h2>
          <p className={styles.versionDescription}>{version.descripcion}</p>
          
          {version.equipamiento ? (
            <div className={styles.equipamientoSection}>
              {version.equipamiento.titulo && (
                <h3 className={styles.equipamientoTitle}>{version.equipamiento.titulo}</h3>
              )}
              <ul className={styles.equipamientoList}>
                {version.equipamiento.items.map((item, index) => (
                  <li key={index} className={styles.equipamientoItem}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : version.specs ? (
            <div className={styles.specsSection}>
              <h3 className={styles.specsTitle}>Especificaciones</h3>
              <ModeloSpecs specs={version.specs} variant="compact" />
            </div>
          ) : null}

          {/* Botones de acción: PDF y WhatsApp */}
          <div className={`${styles.actionsContainer} ${
            !version.pdf ? styles.singleButton : ''
          }`}>
            {version.pdf && (
              <PdfDownloadButton
                href={version.pdf.href}
                label={version.pdf.label || 'Ficha Técnica'}
                fileSize={version.pdf.fileSize}
                variant={version.pdf.variant || 'primary'}
                size={version.pdf.size || 'medium'}
                className={styles.actionButton}
              />
            )}
            <a
              href={`https://wa.me/543816295959?text=${encodeURIComponent(`Hola! Me interesa el ${modeloMarca} ${modeloNombre} ${version.nombreCorto}${colorActivo ? ` en color ${colorActivo.label}` : ''}`)}`}
              className={styles.whatsappButton}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Solicitar más información por WhatsApp"
            >
              <WhatsAppIcon size={18} className={styles.actionIcon} />
              <span>Solicitar más información</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  )
})

VersionContent.displayName = 'VersionContent'

export default VersionContent
