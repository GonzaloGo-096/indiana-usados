import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function AuthUnauthorizedListener() {
  const navigate = useNavigate()
  React.useEffect(() => {
    const handler = () => {
      try { navigate('/admin/login', { replace: true }) } catch (_) {}
    }
    window.addEventListener('auth:unauthorized', handler)
    return () => window.removeEventListener('auth:unauthorized', handler)
  }, [navigate])
  return null
}



