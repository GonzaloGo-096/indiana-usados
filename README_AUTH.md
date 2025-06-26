# Sistema de Autenticación Simplificado - Indiana Usados

## Descripción

Sistema de autenticación simple y profesional para uso interno con pocas personas. Mantiene la estructura modular pero elimina la complejidad innecesaria.

## Estructura del Sistema

### 1. Configuración (`src/config/auth.js`)
```javascript
export const AUTH_CONFIG = {
  api: {
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
    endpoints: {
      login: '/auth/login',
      logout: '/auth/logout'
    }
  },
  storage: {
    tokenKey: 'auth_token',
    userKey: 'auth_user'
  },
  routes: {
    login: '/admin/login',
    dashboard: '/admin',
    home: '/'
  }
}
```

### 2. Servicio de Autenticación (`src/service/authService.js`)
Funciones simples para comunicarse con el backend:
- `login(credentials)`
- `logout()`

### 3. Hook de Autenticación (`src/hooks/useAuth.js`)
Hook principal simplificado:
```javascript
const { 
  user, 
  isAuthenticated, 
  isLoading, 
  login, 
  logout 
} = useAuth()
```

### 4. Hook para React Query (`src/hooks/useAuthMutation.js`)
Hook preparado para usar con `useMutation` (opcional):
```javascript
const { 
  login, 
  logout, 
  isLoading, 
  error 
} = useAuthMutation()
```

### 5. Componentes de Autenticación
- `RequireAuth.jsx` - Protección de rutas
- `AuthProvider.jsx` - Contexto global de autenticación

## Uso Actual

### En páginas de login:
```javascript
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

### En componentes protegidos:
```javascript
import { RequireAuth } from '../components/auth'

const Dashboard = () => {
  return (
    <RequireAuth>
      <div>Contenido protegido</div>
    </RequireAuth>
  )
}
```

## Migración a React Query (Opcional)

### 1. Instalar React Query:
```bash
npm install @tanstack/react-query
```

### 2. Configurar QueryClient en App.jsx:
```javascript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Tu app */}
    </QueryClientProvider>
  )
}
```

### 3. Usar useAuthMutation:
```javascript
import { useAuthMutation } from '../hooks/useAuthMutation'

const Login = () => {
  const { loginAsync, isLoginLoading, loginError } = useAuthMutation()
  
  const handleSubmit = async (values) => {
    try {
      const result = await loginAsync(values)
      // Redirigir al dashboard
    } catch (error) {
      // Manejar error
    }
  }
}
```

## Endpoints del Backend Esperados

### POST /auth/login
```javascript
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
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@indiana.com",
      "role": "admin"
    }
  }
}
```

### POST /auth/logout
```javascript
// Headers
Authorization: Bearer <token>

// Response
{
  "success": true,
  "message": "Logout successful"
}
```

## Variables de Entorno

Crear archivo `.env`:
```env
REACT_APP_API_URL=http://localhost:3001/api
```

## Características del Sistema Simplificado

- ✅ Autenticación con JWT simple
- ✅ Protección de rutas
- ✅ Manejo de errores
- ✅ Loading states
- ✅ Preparado para React Query (opcional)
- ✅ Contexto global de autenticación
- ✅ Servicios modulares
- ✅ Código limpio y profesional
- ✅ Fácil de mantener y extender

## Ventajas de la Simplificación

1. **Menos complejidad**: Sin refresh tokens ni interceptors complejos
2. **Más fácil de debuggear**: Flujo de autenticación directo
3. **Menos código**: Mantiene solo lo esencial
4. **Más rápido**: Sin validaciones innecesarias
5. **Perfecto para uso interno**: Ideal para pocos usuarios

## Próximos Pasos

1. Implementar el backend con los endpoints especificados
2. Configurar variables de entorno
3. Probar el sistema
4. Migrar a React Query si es necesario (opcional) 