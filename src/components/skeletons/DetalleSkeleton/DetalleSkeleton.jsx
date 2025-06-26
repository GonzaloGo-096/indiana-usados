/**
 * DetalleSkeleton - Skeleton para la página de detalle de vehículo
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import { Skeleton, SkeletonGroup } from '../Skeleton'
import styles from './DetalleSkeleton.module.css'

const DetalleSkeleton = () => (
    <div className={styles.container}>
        <div className={styles.content}>
            <div className={styles.imageSection}>
                <div className={styles.imageCard}>
                    <Skeleton type="image" />
                </div>
            </div>
            <div className={styles.detailsSection}>
                <div className={styles.detailsCard}>
                    <SkeletonGroup>
                        <Skeleton type="title" width="75" />
                        <div className={styles.tablesContainer}>
                            <div className={styles.tableSection}>
                                <Skeleton type="text" width="40" />
                                <Skeleton type="text" width="40" />
                                <Skeleton type="text" width="40" />
                            </div>
                            <div className={styles.tableSection}>
                                <Skeleton type="text" width="40" />
                                <Skeleton type="text" width="40" />
                                <Skeleton type="text" width="40" />
                            </div>
                        </div>
                        <Skeleton type="text" width="100" style={{ height: '100px' }} />
                    </SkeletonGroup>
                </div>
            </div>
        </div>
    </div>
)

export default DetalleSkeleton 