import React from 'react'
import './Skeleton.css'

export const Skeleton = ({ 
    type = 'text', 
    width, 
    height, 
    className = '', 
    style = {} 
}) => {
    const baseClass = 'skeleton'
    const typeClass = `skeleton-${type}`
    const widthClass = width ? `skeleton-w-${width}` : ''
    
    const classes = [
        baseClass,
        typeClass,
        widthClass,
        className
    ].filter(Boolean).join(' ')

    const customStyle = {
        ...style,
        ...(height && { height }),
        ...(width && !widthClass && { width })
    }

    return <div className={classes} style={customStyle} aria-hidden="true" />
}

// Componentes predefinidos para uso común
export const SkeletonText = ({ width = '100', className, style }) => (
    <Skeleton type="text" width={width} className={className} style={style} />
)

export const SkeletonTitle = ({ width = '75', className, style }) => (
    <Skeleton type="title" width={width} className={className} style={style} />
)

export const SkeletonImage = ({ className, style }) => (
    <Skeleton type="img" className={className} style={style} />
)

export const SkeletonButton = ({ width = '100', className, style }) => (
    <Skeleton type="button" width={width} className={className} style={style} />
)

// Componente para grupos de skeletons
export const SkeletonGroup = ({ children, className = '', style = {} }) => (
    <div className={`skeleton-container ${className}`} style={style}>
        {children}
    </div>
)

// Componente para grids de skeletons
export const SkeletonGrid = ({ 
    children, 
    columns = 3, 
    className = '', 
    style = {} 
}) => (
    <div className={`skeleton-grid skeleton-grid-${columns} ${className}`} style={style}>
        {children}
    </div>
) 