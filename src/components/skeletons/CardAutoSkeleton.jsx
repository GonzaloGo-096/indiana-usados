import React from 'react'
import { 
    SkeletonImage, 
    SkeletonTitle, 
    SkeletonText, 
    SkeletonButton,
    SkeletonGroup 
} from './Skeleton'

export const CardAutoSkeleton = () => {
    return (
        <div className="card shadow-sm" aria-hidden="true">
            <SkeletonImage />
            
            <div className="card-body">
                <SkeletonGroup>
                    <SkeletonTitle width="80" />
                    <SkeletonText width="50" />
                    <SkeletonText width="30" />
                    <SkeletonText width="60" />
                </SkeletonGroup>
            </div>

            <div className="card-footer bg-transparent border-0">
                <SkeletonButton />
            </div>
        </div>
    )
} 