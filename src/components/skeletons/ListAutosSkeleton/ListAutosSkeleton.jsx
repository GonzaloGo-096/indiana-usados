/**
 * ListAutosSkeleton - Skeleton para la lista de autos
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { CardAutoSkeleton } from './CardAutoSkeleton'
import { SkeletonGrid } from '@shared'

export const ListAutosSkeleton = ({ cantidad = 6 }) => {
    return (
        <SkeletonGrid columns={3}>
            {[...Array(cantidad)].map((_, index) => (
                <CardAutoSkeleton key={index} />
            ))}
        </SkeletonGrid>
    )
} 