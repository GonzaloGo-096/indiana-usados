/**
 * Planes - Página de planes de financiación
 * 
 * Muestra todos los planes de financiación disponibles
 * organizados por modelo.
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { SEOHead } from '@components/SEO'
import { PLANES } from '@data/planes'
import { formatPrice } from '@utils/formatters'
import { getModelo } from '@data/modelos'
import styles from './Planes.module.css'

/**
 * Extraer versión del plan basándose en el nombre del plan y los modelos
 * @param {Object} plan - Objeto del plan
 * @param {string} modeloSlug - Slug del modelo (2008, 208, expert, partner)
 * @returns {string} - Nombre de la versión
 */
const obtenerVersionDelPlan = (plan, modeloSlug) => {
  const modeloData = getModelo(modeloSlug)
  if (!modeloData || !modeloData.versiones) return ''
  
  const nombrePlan = plan.plan.toLowerCase()
  const modelosPlan = plan.modelos.map(m => m.toLowerCase())
  
  // Mapeo específico por plan
  const mapeoVersiones = {
    '2008-allure-t200': 'ALLURE',
    '2008-active-t200': 'ACTIVE',
    'easy': 'ALLURE',
    'plus-at': 'ALLURE AT',
    'plus-208': 'ALLURE',
    'expert-carga': 'L3 HDI 120 - Carga',
    'partner-hdi': 'CONFORT 1.6 HDI 92'
  }
  
  // Buscar por ID del plan
  if (mapeoVersiones[plan.id]) {
    return mapeoVersiones[plan.id]
  }
  
  // Buscar versión en los nombres de modelos del plan
  for (const nombreModelo of modelosPlan) {
    for (const version of modeloData.versiones) {
      const versionNombre = version.nombre.toLowerCase()
      const versionNombreCorto = version.nombreCorto.toLowerCase()
      
      if (nombreModelo.includes(versionNombre) || nombreModelo.includes(versionNombreCorto)) {
        return version.nombreCorto || version.nombre
      }
    }
  }
  
  return ''
}

const Planes = () => {
  // Agrupar planes por modelo
  const planesPorModelo = React.useMemo(() => {
    const grupos = {}
    
    PLANES.forEach(plan => {
      plan.modelos.forEach(nombreModelo => {
        // Extraer el modelo base (2008, 208, Expert, Partner)
        const modeloBase = extraerModeloBase(nombreModelo)
        
        if (!grupos[modeloBase]) {
          grupos[modeloBase] = []
        }
        
        // Evitar duplicados
        if (!grupos[modeloBase].find(p => p.id === plan.id)) {
          grupos[modeloBase].push(plan)
        }
      })
    })
    
    return grupos
  }, [])

  return (
    <>
      <SEOHead
        title="Planes de Financiación | Indiana Usados"
        description="Conocé todos nuestros planes de financiación disponibles para modelos Peugeot 0km. Cuotas desde $236.591. Planes flexibles y adaptados a tus necesidades."
        keywords="planes de financiación, Peugeot, 0km, cuotas, financiación automotriz"
      />
      
      <div className={styles.planesPage}>
        <div className={styles.header}>
          <h1 className={styles.title}>Planes de Financiación</h1>
          <p className={styles.subtitle}>
            Encontrá el plan perfecto para tu próximo Peugeot 0km
          </p>
        </div>

        <div className={styles.content}>
          {Object.entries(planesPorModelo).map(([modelo, planes]) => (
            <ModeloSection key={modelo} modelo={modelo} planes={planes} />
          ))}
        </div>
      </div>
    </>
  )
}

/**
 * Componente para mostrar planes de un modelo específico
 */
const ModeloSection = ({ modelo, planes }) => {
  const modeloDisplay = modelo.charAt(0).toUpperCase() + modelo.slice(1)
  const is208 = modelo === '208'
  
  return (
    <section className={styles.modeloSection}>
      <h2 className={styles.modeloTitle}>Peugeot {modeloDisplay}</h2>
      <div className={styles.planesGrid}>
        {planes.map(plan => (
          <PlanCard key={plan.id} plan={plan} modelo={modelo} />
        ))}
      </div>
    </section>
  )
}

/**
 * Componente PlanCard - Card individual para cada plan
 */
const PlanCard = ({ plan, modelo }) => {
  const {
    plan: nombrePlan,
    cuotas_desde,
    valor_movil_con_imp,
    valor_movil_sin_imp,
    caracteristicas
  } = plan
  
  const modeloDisplay = modelo.charAt(0).toUpperCase() + modelo.slice(1)
  const version = obtenerVersionDelPlan(plan, modelo)

  return (
    <div className={styles.planCard}>
      {/* Header del plan - Alineado a la izquierda */}
      <div className={styles.planHeader}>
        <h3 className={styles.planTitle}>Plan {nombrePlan}</h3>
      </div>

      {/* Información principal */}
      <div className={styles.planContent}>
        {/* Título del modelo y versión */}
        <div className={styles.modeloVersionContainer}>
          <h4 className={styles.modeloVersionTitle}>
            {modeloDisplay}
            {version && (
              <span className={styles.versionSeparator}> {version}</span>
            )}
          </h4>
        </div>
        
        {/* Cuota desde - Grande, azul, cursiva, en su propia fila */}
        <div className={styles.cuotaDesdeContainer}>
          <span className={styles.cuotaDesdeLabel}>Valor cuota</span>
          <span className={styles.cuotaDesdeValue}>{formatPrice(cuotas_desde)}</span>
        </div>

        {/* Valor móvil y otro dato - Contenedor de 2 columnas */}
        <div className={styles.infoBottomRow}>
          {/* Valor móvil */}
          <div className={styles.infoBottomItem}>
            <span className={styles.infoBottomLabel}>Valor móvil</span>
            <div className={styles.infoBottomValueGroup}>
              <span className={styles.infoBottomValue}>
                Con imp: {formatPrice(valor_movil_con_imp)}
              </span>
              <span className={styles.infoBottomValue}>
                Sin imp: {formatPrice(valor_movil_sin_imp)}
              </span>
            </div>
          </div>

          {/* Otro dato relevante - Tipo de plan */}
          {caracteristicas?.tipo_plan && (
            <div className={styles.infoBottomItem}>
              <span className={styles.infoBottomLabel}>Tipo de plan</span>
              <span className={styles.infoBottomValue}>{caracteristicas.tipo_plan}</span>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className={styles.planActions}>
          <Link 
            to={`/0km/${modelo}`} 
            className={`${styles.actionButton} ${styles.actionButtonOutline}`}
          >
            Ver modelo
          </Link>
          <Link 
            to={`/planes/${plan.id}`} 
            className={styles.actionButton}
          >
            Ver plan
          </Link>
        </div>
      </div>
    </div>
  )
}

/**
 * Extraer modelo base del nombre del modelo
 * @param {string} nombreModelo - Nombre completo del modelo
 * @returns {string} - Modelo base (2008, 208, expert, partner)
 */
const extraerModeloBase = (nombreModelo) => {
  const nombre = nombreModelo.toLowerCase()
  
  if (nombre.includes('2008')) return '2008'
  if (nombre.includes('208')) return '208'
  if (nombre.includes('expert')) return 'expert'
  if (nombre.includes('partner')) return 'partner'
  
  return 'otros'
}

export default Planes

