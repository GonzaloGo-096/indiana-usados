import { Link } from 'react-router-dom'
import { SEOHead } from '@components/SEO'

export default function NotFound() {
  return (
    <>
      <SEOHead
        title="404 - Página no encontrada"
        description="La página que buscas no existe o ha sido movida."
        noindex={true}
      />
      <section style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h1>404 - Página no encontrada</h1>
        <p>La ruta solicitada no existe.</p>
        <Link to="/">Ir al inicio</Link>
      </section>
    </>
  )
}



