import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginForm from '../../components/forms/LoginForm'

const Login = () => {
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState({})

    const handleSubmit = async (formValues) => {
        try {
            setIsSubmitting(true)
            setErrors({}) // Limpiar errores previos
            
            // TODO: Implementar lógica de login
            console.log('Login attempt:', formValues)
            
            // Simular login exitoso
            // await loginService.login(formValues)
            navigate('/admin', { replace: true })
        } catch (error) {
            // Manejar errores específicos de la API
            if (error.response?.status === 401) {
                setErrors({
                    usuario: 'Credenciales inválidas',
                    contraseña: 'Credenciales inválidas'
                })
            } else {
                setErrors({
                    general: 'Error al iniciar sesión. Por favor, intente nuevamente.'
                })
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container">
            <div className="row justify-content-center align-items-center min-vh-100">
                <div className="col-md-6 col-lg-4">
                    <div className="card shadow">
                        <div className="card-body p-4">
                            <h2 className="text-center mb-4">Admin Login</h2>
                            
                            {errors.general && (
                                <div className="alert alert-danger" role="alert">
                                    {errors.general}
                                </div>
                            )}

                            <LoginForm 
                                onSubmit={handleSubmit}
                                isSubmitting={isSubmitting}
                                errors={errors}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login 