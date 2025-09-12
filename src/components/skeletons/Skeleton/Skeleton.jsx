/**
 * Skeleton - Componente de carga con animación
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import styles from './Skeleton.module.css'

export const Skeleton = ({ 
    type = 'text', 
    width, 
    height, 
    className = '', 
    style = {} 
}) => {
    const typeClass = styles[type] || styles.text
    const widthClass = width ? styles[`w${width}`] : ''
    
    const classes = [
        styles.skeleton,
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
    <Skeleton type="image" className={className} style={style} />
)

export const SkeletonButton = ({ width = '100', className, style }) => (
    <Skeleton type="button" width={width} className={className} style={style} />
)

// Componente para grupos de skeletons
export const SkeletonGroup = ({ children, className = '', style = {} }) => (
    <div className={`${styles.container} ${className}`} style={style}>
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
    <div className={`${styles.grid} ${styles[`grid${columns}`]} ${className}`} style={style}>
        {children}
    </div>
) 