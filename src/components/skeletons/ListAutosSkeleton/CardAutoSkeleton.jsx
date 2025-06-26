/**
 * CardAutoSkeleton - Skeleton para tarjeta de auto
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import { 
    SkeletonImage, 
    SkeletonTitle, 
    SkeletonText, 
    SkeletonButton,
    SkeletonGroup 
} from '../Skeleton'
import styles from './CardAutoSkeleton.module.css'

export const CardAutoSkeleton = () => {
    return (
        <div className={styles.card} aria-hidden="true">
            <SkeletonImage />
            
            <div className={styles.body}>
                <SkeletonGroup>
                    <SkeletonTitle width="80" />
                    <SkeletonText width="50" />
                    <SkeletonText width="30" />
                    <SkeletonText width="60" />
                </SkeletonGroup>
            </div>

            <div className={styles.footer}>
                <SkeletonButton />
            </div>
        </div>
    )
} 