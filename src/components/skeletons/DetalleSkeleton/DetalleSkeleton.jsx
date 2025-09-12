/**
 * DetalleSkeleton - Skeleton simplificado para la página de detalle de vehículo
 * 
 * @author Indiana Usados
 * @version 2.1.0 - Performance optimizada
 */

import { Skeleton } from '@shared'
import styles from './DetalleSkeleton.module.css'

const DetalleSkeleton = () => (
    <div className={styles.container}>
        {/* Botón de volver */}
        <div className={styles.backButton}>
            <Skeleton type="button" width="15" />
        </div>
        
        {/* Card principal */}
        <div className={styles.card}>
            <div className={styles.cardContent}>
                {/* Sección de imagen */}
                <div className={styles.imageSection}>
                    <Skeleton type="image" />
                </div>
                
                {/* Sección de detalles */}
                <div className={styles.detailsSection}>
                    {/* Header */}
                    <div className={styles.header}>
                        <Skeleton type="title" width="60" />
                        <Skeleton type="title" width="40" />
                    </div>
                    
                    {/* Datos principales */}
                    <div className={styles.mainData}>
                        <Skeleton type="text" width="30" />
                        <Skeleton type="text" width="30" />
                        <Skeleton type="text" width="30" />
                    </div>
                    
                    {/* Información adicional */}
                    <div className={styles.additionalInfo}>
                        <Skeleton type="text" width="100" />
                        <Skeleton type="text" width="100" />
                        <Skeleton type="text" width="100" />
                    </div>
                    
                    {/* Sección de contacto */}
                    <div className={styles.contactSection}>
                        <Skeleton type="title" width="25" />
                        <div className={styles.contactButtons}>
                            <Skeleton type="button" width="40" />
                            <Skeleton type="button" width="40" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
)

export default DetalleSkeleton 