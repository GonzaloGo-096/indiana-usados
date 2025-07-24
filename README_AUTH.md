# Autenticación de Administradores - Indiana Usados

## Descripción
Sistema de autenticación simple y profesional para el panel administrativo interno. Pensado para pocos usuarios, con estructura modular y mínima complejidad.

## Estructura del Sistema
- **Configuración:** `src/config/auth.js` (endpoints, storage, rutas)
- **Servicio:** `src/services/authService.js` (login/logout, comunicación API, mock en desarrollo)
- **Hook principal:** `src/hooks/useAuth.js` (estado, login/logout, persistencia)
- **Hook React Query:** `src/hooks/useAuthMutation.js` (login/logout asíncrono, cache, opcional)
- **Componentes:**
  - `RequireAuth.jsx` (protección de rutas)
  - `AuthProvider.jsx` (contexto global)
  - `LoginForm.jsx` (formulario de login)

---

## Uso Básico

### Login en página
```js
import { useAuth } from '../hooks/useAuth'
const Login = () => {
  const { login, isAuthenticated, isLoading } = useAuth()
  const handleSubmit = async (values) => {
    const result = await login(values)
    if (result.success) {
      // Redirigir al dashboard
    }
  }
}
```

### Protección de rutas
```js
import { RequireAuth } from '../components/auth'
<Route path="/admin" element={
  <RequireAuth>
    <Dashboard />
  </RequireAuth>
} />
```

---

## Migración y Uso con React Query (Opcional)

- Puedes usar ambos hooks (`useAuth` y `useAuthMutation`) según necesidad.
- Para nuevos desarrollos, se recomienda `useAuthMutation` para login/logout asíncronos y manejo de cache automático.

### Ejemplo con React Query
```js
import { useAuthMutation } from '../hooks/useAuthMutation'
const { loginAsync, isLoginLoading, loginError } = useAuthMutation()
```

---

## Endpoints del Backend Esperados

### POST /auth/login
```js
// Request
{
  "usuario": "admin",
  "contraseña": "admin123"
}
// Response
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": { "id": 1, "username": "admin", ... }
  }
}
```

### POST /auth/logout
```js
// Headers: Authorization: Bearer <token>
// Response
{
  "success": true,
  "message": "Logout successful"
}
```

---

## Variables de Entorno

Crear archivo `.env`:
```
VITE_API_URL=http://localhost:3001/api
```
*Las variables deben comenzar con `VITE_` para ser accesibles en el frontend.*

---

## Características y Ventajas
- Autenticación JWT simple
- Protección de rutas
- Manejo de errores y loading
- Preparado para React Query
- Contexto global y servicios modulares
- Código limpio y fácil de mantener

---

## Próximos Pasos
1. Implementar backend con los endpoints especificados
2. Configurar variables de entorno
3. Probar el sistema
4. Migrar a React Query si es necesario 