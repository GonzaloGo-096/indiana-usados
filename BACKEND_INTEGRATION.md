# Sistema de Autenticación Frontend - Indiana Usados

## Índice
1. Arquitectura y Responsabilidades
2. Flujo de Autenticación
3. Uso Diario y Ejemplos
4. Testing y Debugging
5. Notas sobre React Query

---

## 1. Arquitectura y Responsabilidades

- **Hook principal:** `src/hooks/useAuth.js` (gestión de estado, login/logout, persistencia)
- **Servicio:** `src/services/authService.js` (comunicación API, mock en desarrollo)
- **Configuración:** `src/config/auth.js` (endpoints, storage, entorno)
- **Componentes:**
  - `LoginForm.jsx` (formulario de login, validación)
  - `RequireAuth.jsx` (protección de rutas)
  - `AuthProvider.jsx` (contexto global)

**Separación clara:**
- Hooks: lógica y estado
- Services: requests y transformación de datos
- Config: variables y endpoints
- Components: UI y validación

---

## 2. Flujo de Autenticación

### Inicio de App
1. App monta y ejecuta `useAuth()`
2. Se verifica token en localStorage
3. Si hay token, se valida con backend
4. Estado se actualiza según respuesta

### Login
1. Usuario envía formulario
2. `useAuth.login()` llama a `authService.login()`
3. Se detecta entorno (mock o backend real)
4. Si login exitoso, se guarda token y usuario
5. Usuario es redirigido

### Logout
1. Usuario hace logout
2. `useAuth.logout()` llama a `authService.logout()`
3. Se limpia localStorage y estado
4. Usuario es redirigido a login

---

## 3. Uso Diario y Ejemplos

### Login en página
```js
import { useAuth } from '../hooks/useAuth'

const Login = () => {
  const { login, isAuthenticated, isLoading } = useAuth()
  const handleSubmit = async (values) => {
    const result = await login(values)
    if (result.success) {
      // Redirigir
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

### Variables de entorno
```
VITE_ENABLE_MOCK=true
VITE_API_URL=http://localhost:3001/api
```

---

## 4. Testing y Debugging

### Test básico de login/logout
```js
import { renderHook, act } from '@testing-library/react'
import { useAuth } from './useAuth'

test('login/logout', async () => {
  const { result } = renderHook(() => useAuth())
  await act(async () => {
    await result.current.login({ usuario: 'admin', contraseña: 'admin123' })
    expect(result.current.isAuthenticated).toBe(true)
    await result.current.logout()
    expect(result.current.isAuthenticated).toBe(false)
  })
})
```

### Debugging rápido
- Ver estado: `console.log(useAuth())`
- Ver localStorage: `console.log(localStorage.getItem('auth_token'))`
- Revisar requests en Network tab (DevTools)

---

## 5. Notas sobre React Query y useAuthMutation

- El sistema soporta migración a React Query con el hook `useAuthMutation.js`.
- Puedes usar ambos hooks (`useAuth` y `useAuthMutation`) según necesidad.
- Para nuevos desarrollos, se recomienda usar `useAuthMutation` para login/logout asíncronos y manejo de cache automático.

**Ejemplo:**
```js
import { useAuthMutation } from '../hooks/useAuthMutation'
const { loginAsync, isLoginLoading, loginError } = useAuthMutation()
```

---

**Ventajas de la arquitectura:**
- Separación clara de responsabilidades
- Fácil testing y debugging
- Flexible para desarrollo y producción
- Escalable y mantenible 