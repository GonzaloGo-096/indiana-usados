/**
 * ModalContent - Contenido del modal con lazy loading
 * 
 * Responsabilidades:
 * - Renderizar contenido del modal
 * - Optimización de performance
 * - Manejo de contenido dinámico
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */


const ModalContent = ({ children }) => {
    return (
        <div className="modal-content-wrapper">
            {children}
        </div>
    )
}

export default ModalContent 