/**
 * AdminActions.jsx - Componente de ejemplo para acciones administrativas
 * 
 * Muestra cómo usar las mutaciones para editar y eliminar fotos
 * 
 * @author Indiana Usados
 * @version 1.0.0 - Ejemplo de implementación
 */

import React, { useState } from 'react'
import { useAdminMutations } from '@hooks'
import { logger } from '@utils'

export const AdminActions = ({ vehicleId, vehicleData, onSuccess, onError }) => {
    const { updatePhoto, deletePhoto, isLoading, error, success } = useAdminMutations()
    const [showEditModal, setShowEditModal] = useState(false)
    const [editFormData, setEditFormData] = useState(new FormData())

    // ✅ MANEJAR EDICIÓN DE FOTO
    const handleEditSubmit = async (e) => {
        e.preventDefault()
        logger.info('Enviando formulario de edición...')

        try {
            const result = await updatePhoto(vehicleId, editFormData)
            
            if (result.success) {
                logger.success('Foto actualizada exitosamente')
                setShowEditModal(false)
                onSuccess?.('Foto actualizada exitosamente')
            } else {
                logger.error('Error al actualizar foto:', result.error)
                onError?.(result.error)
            }
        } catch (err) {
            logger.error('Error inesperado al actualizar foto:', err)
            onError?.('Error inesperado al actualizar la foto')
        }
    }

    // ✅ MANEJAR ELIMINACIÓN DE FOTO
    const handleDelete = async () => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar esta foto?')) {
            return
        }

        logger.info('Eliminando foto...')

        try {
            const result = await deletePhoto(vehicleId)
            
            if (result.success) {
                logger.success('Foto eliminada exitosamente')
                onSuccess?.('Foto eliminada exitosamente')
            } else {
                logger.error('Error al eliminar foto:', result.error)
                onError?.(result.error)
            }
        } catch (err) {
            logger.error('Error inesperado al eliminar foto:', err)
            onError?.('Error inesperado al eliminar la foto')
        }
    }

    // ✅ MANEJAR CAMBIOS EN EL FORMULARIO
    const handleFormChange = (e) => {
        const { name, value, files } = e.target
        
        if (files) {
            // Si es un archivo, agregarlo al FormData
            editFormData.set(name, files[0])
        } else {
            // Si es un campo de texto, agregarlo al FormData
            editFormData.set(name, value)
        }
        
        setEditFormData(new FormData(editFormData))
    }

    return (
        <div className="admin-actions">
            {/* ✅ BOTÓN EDITAR - ABRE MODAL */}
            <button
                onClick={() => setShowEditModal(true)}
                disabled={isLoading}
                className="btn-edit"
            >
                {isLoading ? 'Editando...' : 'Editar'}
            </button>

            {/* ✅ BOTÓN ELIMINAR - ACCIÓN DIRECTA */}
            <button
                onClick={handleDelete}
                disabled={isLoading}
                className="btn-delete"
            >
                {isLoading ? 'Eliminando...' : 'Eliminar'}
            </button>

            {/* ✅ MODAL DE EDICIÓN */}
            {showEditModal && (
                <div className="edit-modal">
                    <div className="modal-content">
                        <h3>Editar Vehículo</h3>
                        
                        <form onSubmit={handleEditSubmit}>
                            {/* ✅ CAMPOS DE TEXTO */}
                            <div className="form-group">
                                <label htmlFor="marca">Marca:</label>
                                <input
                                    type="text"
                                    id="marca"
                                    name="marca"
                                    defaultValue={vehicleData?.marca || ''}
                                    onChange={handleFormChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="modelo">Modelo:</label>
                                <input
                                    type="text"
                                    id="modelo"
                                    name="modelo"
                                    defaultValue={vehicleData?.modelo || ''}
                                    onChange={handleFormChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="precio">Precio:</label>
                                <input
                                    type="number"
                                    id="precio"
                                    name="precio"
                                    defaultValue={vehicleData?.precio || ''}
                                    onChange={handleFormChange}
                                />
                            </div>

                            {/* ✅ CAMPOS DE ARCHIVO - AJUSTADOS A TU ESTRUCTURA REAL */}
                            <div className="form-group">
                                <label htmlFor="fotoFrontal">Foto Frontal:</label>
                                
                                {/* ✅ MOSTRAR FOTO ACTUAL */}
                                {vehicleData?.fotoFrontal && (
                                    <div className="current-image">
                                        <img 
                                            src={vehicleData.fotoFrontal} 
                                            alt="Foto frontal actual"
                                            style={{ 
                                                width: '100px', 
                                                height: '60px', 
                                                objectFit: 'cover',
                                                borderRadius: '4px',
                                                marginBottom: '10px'
                                            }}
                                        />
                                        <p style={{ fontSize: '12px', color: '#666', margin: '0' }}>
                                            Foto frontal actual
                                        </p>
                                    </div>
                                )}
                                
                                <input
                                    type="file"
                                    id="fotoFrontal"
                                    name="fotoFrontal"
                                    accept="image/*"
                                    onChange={handleFormChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="fotoTrasera">Foto Trasera:</label>
                                
                                {/* ✅ MOSTRAR FOTO ACTUAL */}
                                {vehicleData?.fotoTrasera && (
                                    <div className="current-image">
                                        <img 
                                            src={vehicleData.fotoTrasera} 
                                            alt="Foto trasera actual"
                                            style={{ 
                                                width: '100px', 
                                                height: '60px', 
                                                objectFit: 'cover',
                                                borderRadius: '4px',
                                                marginBottom: '10px'
                                            }}
                                        />
                                        <p style={{ fontSize: '12px', color: '#666', margin: '0' }}>
                                            Foto trasera actual
                                        </p>
                                    </div>
                                )}
                                
                                <input
                                    type="file"
                                    id="fotoTrasera"
                                    name="fotoTrasera"
                                    accept="image/*"
                                    onChange={handleFormChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="fotoLateralIzquierda">Foto Lateral Izquierda:</label>
                                
                                {/* ✅ MOSTRAR FOTO ACTUAL */}
                                {vehicleData?.fotoLateralIzquierda && (
                                    <div className="current-image">
                                        <img 
                                            src={vehicleData.fotoLateralIzquierda} 
                                            alt="Foto lateral izquierda actual"
                                            style={{ 
                                                width: '100px', 
                                                height: '60px', 
                                                objectFit: 'cover',
                                                borderRadius: '4px',
                                                marginBottom: '10px'
                                            }}
                                        />
                                        <p style={{ fontSize: '12px', color: '#666', margin: '0' }}>
                                            Foto lateral izquierda actual
                                        </p>
                                    </div>
                                )}
                                
                                <input
                                    type="file"
                                    id="fotoLateralIzquierda"
                                    name="fotoLateralIzquierda"
                                    accept="image/*"
                                    onChange={handleFormChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="fotoLateralDerecha">Foto Lateral Derecha:</label>
                                
                                {/* ✅ MOSTRAR FOTO ACTUAL */}
                                {vehicleData?.fotoLateralDerecha && (
                                    <div className="current-image">
                                        <img 
                                            src={vehicleData.fotoLateralDerecha} 
                                            alt="Foto lateral derecha actual"
                                            style={{ 
                                                width: '100px', 
                                                height: '60px', 
                                                objectFit: 'cover',
                                                borderRadius: '4px',
                                                marginBottom: '10px'
                                            }}
                                        />
                                        <p style={{ fontSize: '12px', color: '#666', margin: '0' }}>
                                            Foto lateral derecha actual
                                        </p>
                                    </div>
                                )}
                                
                                <input
                                    type="file"
                                    id="fotoLateralDerecha"
                                    name="fotoLateralDerecha"
                                    accept="image/*"
                                    onChange={handleFormChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="fotoInterior">Foto Interior:</label>
                                
                                {/* ✅ MOSTRAR FOTO ACTUAL */}
                                {vehicleData?.fotoInterior && (
                                    <div className="current-image">
                                        <img 
                                            src={vehicleData.fotoInterior} 
                                            alt="Foto interior actual"
                                            style={{ 
                                                width: '100px', 
                                                height: '60px', 
                                                objectFit: 'cover',
                                                borderRadius: '4px',
                                                marginBottom: '10px'
                                            }}
                                        />
                                        <p style={{ fontSize: '12px', color: '#666', margin: '0' }}>
                                            Foto interior actual
                                        </p>
                                    </div>
                                )}
                                
                                <input
                                    type="file"
                                    id="fotoInterior"
                                    name="fotoInterior"
                                    accept="image/*"
                                    onChange={handleFormChange}
                                />
                            </div>

                            {/* ✅ BOTONES DEL FORMULARIO */}
                            <div className="form-actions">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="btn-save"
                                >
                                    {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                                
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="btn-cancel"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>

                        {/* ✅ MOSTRAR ERRORES */}
                        {error && (
                            <div className="error-message">
                                Error: {error}
                            </div>
                        )}

                        {/* ✅ MOSTRAR ÉXITO */}
                        {success && (
                            <div className="success-message">
                                ¡Operación exitosa!
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
