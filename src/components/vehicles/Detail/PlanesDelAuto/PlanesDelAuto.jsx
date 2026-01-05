/**
 * PlanesDelAuto - Componente para mostrar planes de financiación de un vehículo
 * 
 * Características:
 * - Filtra planes según el modelo del auto
 * - Muestra cada plan en una card con toda la información relevante
 * - Diseño responsive y consistente con el proyecto
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getPlanesPorModelo } from '@data/planes'
import { formatPrice } from '@utils/formatters'
import { getModelo } from '@data/modelos'
import styles from './PlanesDelAuto.module.css'

/**
 * Extraer versión del plan basándose en el nombre del plan y los modelos
 * @param {Object} plan - Objeto del plan
 * @param {string} modeloSlug - Slug del modelo (2008, 208, expert, partner)
 * @returns {string} - Nombre de la versión
 */
const obtenerVersionDelPlan = (plan, modeloSlug) => {
  const modeloData = getModelo(modeloSlug)
  if (!modeloData || !modeloData.versiones) return ''
  
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

/**
 * Componente PlanesDelAuto
 * @param {Object} props
 * @param {Object} props.auto - Objeto del vehículo con propiedad 'modelo'
 * @returns {JSX.Element|null}
 */
export const PlanesDelAuto = ({ auto }) => {
  // Obtener planes aplicables al modelo del auto
  const planesAplicables = useMemo(() => {
    if (!auto || !auto.modelo) return []
    return getPlanesPorModelo(auto.modelo)
  }, [auto])

  // Si no hay planes, no renderizar nada
  if (!planesAplicables || planesAplicables.length === 0) {
    return null
  }

  return (
    <div className={styles.planesContainer}>
      <h2 className={styles.title}>Planes de Financiación Disponibles</h2>
      <div className={styles.planesGrid}>
        {planesAplicables.map((plan) => (
          <PlanCard key={plan.id} plan={plan} auto={auto} />
        ))}
      </div>
    </div>
  )
}

/**
 * Componente PlanCard - Card individual para cada plan
 * @param {Object} props
 * @param {Object} props.plan - Objeto del plan
 * @param {Object} props.auto - Objeto del vehículo
 * @returns {JSX.Element}
 */
const PlanCard = ({ plan, auto }) => {
  const {
    plan: nombrePlan,
    cuotas_desde,
    valor_movil_con_imp,
    valor_movil_sin_imp,
    caracteristicas
  } = plan
  
  // Obtener modelo y versión del auto o del plan
  const modelo = auto?.modelo || ''
  const modeloDisplay = modelo.charAt(0).toUpperCase() + modelo.slice(1)
  
  // Intentar obtener versión del auto primero, si no del plan
  let version = auto?.version || ''
  if (!version && modelo) {
    // Normalizar modelo para obtener slug
    const modeloSlug = modelo.toLowerCase()
    version = obtenerVersionDelPlan(plan, modeloSlug)
  }

  return (
    <div className={styles.planCard}>
      {/* Header del plan - Alineado a la izquierda */}
      <div className={styles.planHeader}>
        <h3 className={styles.planTitle}>Plan {nombrePlan}</h3>
      </div>

      {/* Información principal */}
      <div className={styles.planContent}>
        {/* Título del modelo y versión */}
        {modelo && (
          <div className={styles.modeloVersionContainer}>
            <h4 className={styles.modeloVersionTitle}>
              {modeloDisplay}
              {version && (
                <span className={styles.versionSeparator}> {version}</span>
              )}
            </h4>
          </div>
        )}
        
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
          {modelo && (
            <Link 
              to={`/0km/${modelo.toLowerCase()}`} 
              className={`${styles.actionButton} ${styles.actionButtonOutline}`}
            >
              Ver modelo
            </Link>
          )}
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

export default PlanesDelAuto

