import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section style={{ padding: '40px 20px', textAlign: 'center' }}>
      <h1>404 - Página no encontrada</h1>
      <p>La ruta solicitada no existe.</p>
      <Link to="/">Ir al inicio</Link>
    </section>
  )
}



