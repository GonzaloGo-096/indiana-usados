/**
 * PlanDetalle - Página de detalle de plan de financiación
 * 
 * Muestra toda la información detallada de un plan específico.
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPlanPorId } from '@data/planes'
import { formatPrice } from '@utils/formatters'
import { SEOHead } from '@components/SEO'
import styles from './PlanDetalle.module.css'

const PlanDetalle = () => {
  const { planId } = useParams()
  
  const plan = getPlanPorId(planId)
  
  if (!plan) {
    return (
      <>
        <SEOHead
          title="Plan no encontrado"
          description="El plan de financiación solicitado no existe."
          noindex={true}
        />
        <div className={styles.container}>
          <h1 className={styles.errorTitle}>Plan no encontrado</h1>
          <p className={styles.errorText}>El plan solicitado no está disponible.</p>
          <Link to="/planes" className={styles.backLink}>
            Volver a planes
          </Link>
        </div>
      </>
    )
  }

  const { caracteristicas } = plan

  return (
    <>
      <SEOHead
        title={`Plan ${plan.plan} - Peugeot 0km`}
        description={`Detalles del plan de financiación ${plan.plan} para Peugeot 0km.`}
      />
      <div className={styles.container}>
        <div className={styles.header}>
          <Link to="/planes" className={styles.backLink}>
            ← Volver a planes
          </Link>
          <h1 className={styles.title}>Plan {plan.plan}</h1>
        </div>

        <div className={styles.content}>
          {/* Información principal */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Información Principal</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Cuota desde</span>
                <span className={styles.infoValue}>{formatPrice(plan.cuotas_desde)}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Valor móvil con impuestos</span>
                <span className={styles.infoValue}>{formatPrice(plan.valor_movil_con_imp)}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Valor móvil sin impuestos</span>
                <span className={styles.infoValue}>{formatPrice(plan.valor_movil_sin_imp)}</span>
              </div>
              {caracteristicas?.tipo_plan && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Tipo de plan</span>
                  <span className={styles.infoValue}>{caracteristicas.tipo_plan}</span>
                </div>
              )}
              {caracteristicas?.cuotas_totales && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Cuotas totales</span>
                  <span className={styles.infoValue}>{caracteristicas.cuotas_totales}</span>
                </div>
              )}
            </div>
          </section>

          {/* Características del plan */}
          {caracteristicas && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Características del Plan</h2>
              <div className={styles.characteristicsGrid}>
                {caracteristicas.adjudicacion_pactada && (
                  <div className={styles.characteristicItem}>
                    <span className={styles.characteristicLabel}>Adjudicación pactada</span>
                    <span className={styles.characteristicValue}>
                      {caracteristicas.adjudicacion_pactada.join(', ')} cuotas
                    </span>
                  </div>
                )}
                {caracteristicas.licitacion_minima && (
                  <div className={styles.characteristicItem}>
                    <span className={styles.characteristicLabel}>Licitación mínima</span>
                    <div className={styles.characteristicValueGroup}>
                      {Object.entries(caracteristicas.licitacion_minima).map(([cuota, porcentaje]) => (
                        <span key={cuota} className={styles.characteristicValue}>
                          Cuota {cuota}: {porcentaje}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {caracteristicas.derecho_inscripcion_prorrateado && (
                  <div className={styles.characteristicItem}>
                    <span className={styles.characteristicLabel}>Derecho inscripción prorrateado</span>
                    <span className={styles.characteristicValue}>
                      {caracteristicas.derecho_inscripcion_prorrateado} cuotas
                    </span>
                  </div>
                )}
                {caracteristicas.sellado_prorrateado && (
                  <div className={styles.characteristicItem}>
                    <span className={styles.characteristicLabel}>Sellado prorrateado</span>
                    <span className={styles.characteristicValue}>
                      {caracteristicas.sellado_prorrateado} cuotas
                    </span>
                  </div>
                )}
                {caracteristicas.diferimiento_comercial && (
                  <div className={styles.characteristicItem}>
                    <span className={styles.characteristicLabel}>Diferimiento comercial</span>
                    <div className={styles.characteristicValueGroup}>
                      {Object.entries(caracteristicas.diferimiento_comercial).map(([rango, porcentaje]) => (
                        <span key={rango} className={styles.characteristicValue}>
                          {rango}: {porcentaje}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {caracteristicas.recupero_diferimiento && (
                  <div className={styles.characteristicItem}>
                    <span className={styles.characteristicLabel}>Recupero diferimiento</span>
                    <div className={styles.characteristicValueGroup}>
                      {Object.entries(caracteristicas.recupero_diferimiento).map(([rango, porcentaje]) => (
                        <span key={rango} className={styles.characteristicValue}>
                          {rango}: {porcentaje}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Modelos aplicables */}
          {plan.modelos && plan.modelos.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Modelos Aplicables</h2>
              <ul className={styles.modelosList}>
                {plan.modelos.map((modelo, index) => (
                  <li key={index} className={styles.modeloItem}>
                    {modelo}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </>
  )
}

export default PlanDetalle

