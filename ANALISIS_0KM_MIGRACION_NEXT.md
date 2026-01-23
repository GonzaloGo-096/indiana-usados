    # Análisis Sección 0km - Migración a Next.js SSG

    **Fecha:** 2025  
    **Objetivo:** Análisis completo de la sección 0km para migración a Next.js Static Site Generation (SSG)

    ---

    ## 1. FUENTE DE DATOS DE AUTOS 0KM

    ### 1.1 Ubicación y Archivos

    **Archivo principal de índice:**
    - `src/data/modelos/index.js`
    - Centraliza todos los modelos disponibles
    - Exporta funciones: `getModelo()`, `existeModelo()`, `getAllModelos()`, `getModelosSlugs()`

    **Archivos de modelos individuales:**
    - `src/data/modelos/peugeot208.js` → PEUGEOT_208
    - `src/data/modelos/peugeot2008.js` → PEUGEOT_2008
    - `src/data/modelos/peugeot3008.js` → PEUGEOT_3008
    - `src/data/modelos/peugeot408.js` → PEUGEOT_408
    - `src/data/modelos/peugeot5008.js` → PEUGEOT_5008
    - `src/data/modelos/peugeotPartner.js` → PEUGEOT_PARTNER
    - `src/data/modelos/peugeotExpert.js` → PEUGEOT_EXPERT
    - `src/data/modelos/peugeotBoxer.js` → PEUGEOT_BOXER

    **Archivo de colores:**
    - `src/data/modelos/colores.js` → COLORES (catálogo centralizado de colores con imágenes)

    **Registro de modelos:**
    ```javascript
    const MODELOS = {
    '208': PEUGEOT_208,
    '2008': PEUGEOT_2008,
    '3008': PEUGEOT_3008,
    '408': PEUGEOT_408,
    '5008': PEUGEOT_5008,
    'partner': PEUGEOT_PARTNER,
    'expert': PEUGEOT_EXPERT,
    'boxer': PEUGEOT_BOXER,
    }
    ```

    ### 1.2 Estructura del Objeto Modelo

    Cada modelo tiene la siguiente estructura (ejemplo: `peugeot2008.js`):

    ```javascript
    {
    id: '2008',                    // ID único del modelo
    marca: 'Peugeot',              // Marca del vehículo
    nombre: '2008',                // Nombre del modelo
    slug: '2008',                  // Slug para URLs (coincide con id)
    año: 2024,                     // Año del modelo
    
    // Hero image (solo desktop)
    heroImage: {
        url: 'https://res.cloudinary.com/...',
        alt: 'Peugeot 2008'
    },
    
    // Galería de imágenes (fija por modelo, no por versión)
    galeria: {
        mobile: [
        { url: '...', alt: '...' },
        // ...
        ],
        desktop: [
        { url: '...', alt: '...' },
        // ...
        ]
    },
    
    // Versiones disponibles
    versiones: [
        {
        id: 'active',              // ID único de versión
        nombre: 'ACTIVE',           // Nombre completo
        nombreCorto: 'ACTIVE',      // Nombre corto para UI
        descripcion: '...',         // Descripción de la versión
        coloresPermitidos: [        // Array de keys de COLORES
            'blanco-nacre',
            'gris-artense',
            'negro',
            'gris-selenium'
        ],
        colorDefault: 'blanco-nacre', // Color por defecto
        equipamiento: {
            titulo: 'Con equipamiento:',
            items: ['...', '...']
        },
        specs: null,                // Specs técnicas (opcional)
        pdf: {
            href: '/pdf/pdf-2008.pdf',
            label: 'Ficha Técnica',
            // ...
        }
        },
        // ... más versiones
    ],
    
    // Secciones de características destacadas (opcional)
    features: [
        {
        id: 'conectividad-avanzada',
        title: 'CONECTIVIDAD AVANZADA',
        description: '...',
        images: {
            mobile: '...',
            desktop: '...'
        }
        },
        // ... más features
    ],
    
    // Configuración SEO
    seo: {
        title: 'Peugeot 2008 0KM | Versiones, Colores y Especificaciones',
        description: 'Descubrí el nuevo Peugeot 2008...',
        keywords: 'Peugeot 2008, SUV, 0km, PureTech, i-Cockpit'
    }
    }
    ```

    ### 1.3 Construcción del Slug (autoSlug)

    **Origen del slug:**
    - El slug se obtiene directamente del parámetro de ruta `:autoSlug` en React Router
    - Se valida con `existeModelo(autoSlug)` antes de renderizar
    - El slug coincide con la key en el objeto `MODELOS` (ej: `'2008'`, `'partner'`)

    **Mapeo slug → modelo:**
    ```javascript
    // En PublicRoutes.jsx
    <Route path="/0km/:autoSlug" element={<CeroKilometroDetalle />} />

    // En CeroKilometroDetalle.jsx
    const { autoSlug } = useParams()
    const modelo = getModelo(autoSlug) // Busca en MODELOS[autoSlug]
    ```

    **Slugs disponibles:**
    - `'208'`, `'2008'`, `'3008'`, `'408'`, `'5008'` (numéricos)
    - `'partner'`, `'expert'`, `'boxer'` (texto en minúsculas)

    ---

    ## 2. RUTAS Y COMPONENTES

    ### 2.1 Rutas Definidas

    **Archivo:** `src/routes/PublicRoutes.jsx`

    ```javascript
    // Ruta principal de listado
    <Route path="/0km" element={<CeroKilometros />} />

    // Ruta de detalle de modelo
    <Route path="/0km/:autoSlug" element={<CeroKilometroDetalle />} />
    ```

    ### 2.2 Redirects Relacionados

    **Redirects de compatibilidad (mantienen URLs antiguas):**
    ```javascript
    // Redirect de ruta antigua
    <Route path="/autos/0km" element={<Navigate to="/0km" replace />} />
    ```

    **Nota:** No hay redirects específicos para `/0km/:autoSlug`, solo para el listado.

    ### 2.3 Componentes

    **Listado (`/0km`):**
    - **Componente:** `src/pages/CeroKilometros/CeroKilometros.jsx`
    - **Lazy loading:** Sí (importado con `lazy()`)
    - **Funcionalidad:**
    - Carrusel horizontal de modelos (2 carruseles: vehículos y utilitarios)
    - Separación: vehículos vs utilitarios (Partner, Expert, Boxer)
    - Usa `ModelCard` para cada modelo
    - SEO: `SEOHead` + `StructuredData` (ItemList schema)

    **Detalle (`/0km/:autoSlug`):**
    - **Componente:** `src/pages/CeroKilometros/CeroKilometroDetalle.jsx`
    - **Lazy loading:** Sí (importado con `lazy()`)
    - **Funcionalidad:**
    - Validación de existencia del modelo (`existeModelo()`)
    - Hook `useModeloSelector` para manejo de estado (versión/color)
    - Layout responsive: carrusel mobile, tabs desktop
    - SEO: `SEOHead` + `StructuredData` (Product schema)
    - Secciones especiales: features, parallax (208/2008), dimensiones (utilitarios)

    **Componentes auxiliares:**
    - `src/components/ModelCard/ModelCard.jsx` - Card de modelo en listado
    - `src/components/ceroKm/` - Componentes específicos de 0km (VersionTabs, VersionContent, VersionCarousel, etc.)

    **Hooks:**
    - `src/hooks/ceroKm/useModeloSelector.js` - Manejo de estado de versión/color

    ---

    ## 3. IMÁGENES USADAS EN 0KM

    ### 3.1 Origen de Imágenes

    **Cloudinary Static Config:**
    - **Archivo:** `src/config/cloudinaryStaticImages.js`
    - **Sección:** `staticImages.ceroKm.modelos`
    - **Uso:** Imágenes del carrusel de listado (`/0km`)

    **Estructura:**
    ```javascript
    ceroKm: {
    modelos: {
        "208": {
        src: "https://res.cloudinary.com/drbeomhcu/image/upload/v1766786931/208-blanco_au72bz.webp",
        alt: "Peugeot 208 0km",
        titulo: "208",
        },
        "2008": { /* ... */ },
        // ... resto de modelos
    }
    }
    ```

    **Imágenes en archivos de modelo:**
    - **Hero images:** Definidas en cada archivo de modelo (`heroImage.url`)
    - **Galería:** Definida en cada archivo de modelo (`galeria.mobile` / `galeria.desktop`)
    - **Features:** Definidas en `modelo.features[].images.mobile/desktop`
    - **Colores:** Definidos en `src/data/modelos/colores.js` (cada color tiene `url`)

    ### 3.2 Lista de Imágenes por Modelo

    **Listado (`/0km`):**
    - 1 imagen por modelo desde `cloudinaryStaticImages.ceroKm.modelos`
    - Modelos: 208, 2008, 3008, 408, 5008, partner, expert, boxer

    **Detalle (`/0km/:autoSlug`):**
    - **Hero image:** 1 imagen (solo desktop) desde `modelo.heroImage.url`
    - **Galería:** Variable según modelo (4-6 imágenes mobile, 4-6 desktop)
    - **Colores:** Variable según versión (cada color tiene su imagen en `COLORES[colorKey].url`)
    - **Features:** 2 imágenes por feature (mobile/desktop)

    ### 3.3 Formato de Imágenes

    **Formatos encontrados:**
    - **WebP:** Mayoría de imágenes (`.webp`)
    - **AVIF:** Hero images de algunos modelos (`.avif`)
    - **PNG:** Algunas imágenes (ej: 5008 en listado)

    **Ejemplos:**
    - Listado: `208-blanco_au72bz.webp`
    - Hero: `kv-2008-dk-13102025_loyq4t.avif`
    - Galería: `2008-galeria-1-mobile_xf79qs.webp`
    - Colores: `gris-selenium-frontal_bbgybh.webp`

    ### 3.4 Tamaño/Estrategia Actual

    **No hay optimización automática:**
    - URLs directas de Cloudinary sin transformaciones
    - No se usa `next/image` ni `gatsby-image`
    - No hay lazy loading configurado (excepto `loading="lazy"` en algunos `<img>`)
    - No hay responsive images (srcset)

    **Estrategia actual:**
    - Imágenes servidas directamente desde Cloudinary
    - Algunas imágenes tienen `loading="lazy"` y `decoding="async"`
    - Hero images usan `loading="eager"` (prioridad)

    **Cloudinary URLs:**
    - Formato: `https://res.cloudinary.com/drbeomhcu/image/upload/v{version}/{publicId}.{ext}`
    - Sin transformaciones de tamaño/calidad en la URL

    ---

    ## 4. SEO ACTUAL EN 0KM

    ### 4.1 Componente/Hook de SEO

    **Componente usado:**
    - `src/components/SEO/SEOHead.jsx`
    - Wrapper alrededor del hook `useSEO`

    **Hook subyacente:**
    - `src/hooks/seo/useSEO.js` → `useSEO()`
    - Actualiza `document.title` y meta tags dinámicamente

    ### 4.2 SEO en Listado (`/0km`)

    **Componente:** `CeroKilometros.jsx`

    **SEOHead:**
    ```javascript
    <SEOHead
    title="Peugeot 0km en Tucumán | Concesionaria Oficial | Indiana Peugeot"
    description="Concesionaria oficial Peugeot en Tucumán. Descubrí la gama completa de Peugeot 0km: 208, 2008, 3008, 5008, Partner, Expert y Boxer. Financiación disponible."
    keywords="Peugeot 0km Tucumán, concesionaria Peugeot Tucumán, autos Peugeot nuevos, Peugeot 208, Peugeot 2008, Peugeot 3008, Peugeot 5008, Peugeot Partner, Peugeot Expert, Peugeot Boxer"
    url="/0km"
    type="website"
    />
    ```

    **Structured Data:**
    - Tipo: `ItemList` (Schema.org)
    - Contiene todos los modelos con `itemListElement`
    - Cada item es un `Product` con name, brand, url, image

    ### 4.3 SEO en Detalle (`/0km/:autoSlug`)

    **Componente:** `CeroKilometroDetalle.jsx`

    **SEOHead:**
    ```javascript
    <SEOHead
    title={`${modelo.marca} ${modelo.nombre} 0km en Tucumán | Concesionaria Oficial | Indiana Peugeot`}
    description={modelo.seo.description || `Peugeot ${modelo.nombre} 0km disponible en Indiana Peugeot, concesionaria oficial en Tucumán. Financiación disponible.`}
    keywords={`${modelo.marca} ${modelo.nombre} 0km Tucumán, Peugeot ${modelo.nombre} precio, concesionaria Peugeot ${modelo.nombre}`}
    url={`/0km/${autoSlug}`}
    type="product"
    />
    ```

    **Structured Data:**
    - Tipo: `Product` (Schema.org)
    - Incluye: name, brand, description, image, url, category, offers
    - Offers incluye: availability, priceCurrency, seller (AutomotiveBusiness)

    **Fuente de datos SEO:**
    - `modelo.seo.title` (opcional, no se usa en el componente actual)
    - `modelo.seo.description` (usado como fallback)
    - `modelo.seo.keywords` (definido pero no usado en SEOHead)

    ---

    ## 5. ARCHIVOS INVOLUCRADOS

    ### 5.1 Archivos Principales

    **Rutas:**
    - `src/routes/PublicRoutes.jsx` - Definición de rutas y redirects

    **Páginas:**
    - `src/pages/CeroKilometros/CeroKilometros.jsx` - Listado
    - `src/pages/CeroKilometros/CeroKilometroDetalle.jsx` - Detalle

    **Datos:**
    - `src/data/modelos/index.js` - Índice centralizado
    - `src/data/modelos/peugeot*.js` - 8 archivos de modelos individuales
    - `src/data/modelos/colores.js` - Catálogo de colores

    **Configuración:**
    - `src/config/cloudinaryStaticImages.js` - Imágenes estáticas del listado
    - `src/config/seo.js` - Configuración SEO global

    **Componentes:**
    - `src/components/SEO/SEOHead.jsx` - Componente SEO
    - `src/components/SEO/StructuredData.jsx` - Structured Data
    - `src/components/ModelCard/ModelCard.jsx` - Card de modelo
    - `src/components/ceroKm/*` - Componentes específicos de 0km

    **Hooks:**
    - `src/hooks/ceroKm/useModeloSelector.js` - Hook de selección
    - `src/hooks/seo/useSEO.js` - Hook SEO

    **Assets:**
    - `src/assets/ceroKm/index.js` - Wrapper de imágenes del listado

    ### 5.2 Archivos Relacionados

    **Navegación:**
    - `src/components/layout/layouts/Nav/Nav.jsx` - Links a /0km con preload

    **Estilos:**
    - `src/pages/CeroKilometros/CeroKilometros.module.css`
    - `src/pages/CeroKilometros/CeroKilometroDetalle.module.css`
    - `src/components/ModelCard/ModelCard.module.css`

    ---

    ## 6. RIESGOS PARA MIGRAR A NEXT SSG

    ### 6.1 Riesgos Críticos

    **1. Client-Side Routing vs Static Generation**
    - **Riesgo:** React Router usa client-side routing, Next.js necesita `getStaticPaths` + `getStaticProps`
    - **Impacto:** Alto - Requiere refactor completo de rutas
    - **Solución:** Generar paths estáticos para `/0km` y `/0km/[autoSlug]`

    **2. Hooks de Estado (useModeloSelector)**
    - **Riesgo:** Hook usa `useState` para versión/color activos
    - **Impacto:** Medio - Funciona en SSG pero estado se pierde en navegación
    - **Solución:** Mantener estado en URL params o localStorage

    **3. Lazy Loading de Componentes**
    - **Riesgo:** Componentes usan `lazy()` de React
    - **Impacto:** Bajo - Next.js tiene su propio code splitting
    - **Solución:** Reemplazar con `next/dynamic`

    **4. SEO Dinámico (useSEO hook)**
    - **Riesgo:** Hook actualiza `document.title` en runtime
    - **Impacto:** Alto - Next.js necesita `<Head>` o `next/head` en build time
    - **Solución:** Usar `next/head` o `Metadata` API (App Router)

    **5. Structured Data en Runtime**
    - **Riesgo:** `StructuredData` componente inyecta JSON-LD en runtime
    - **Impacto:** Medio - Funciona pero no es óptimo para SSG
    - **Solución:** Inyectar JSON-LD en `getStaticProps` o usar `<script>` en JSX

    ### 6.2 Riesgos Moderados

    **6. Imágenes sin Optimización**
    - **Riesgo:** URLs directas de Cloudinary sin transformaciones
    - **Impacto:** Medio - Pérdida de optimización automática
    - **Solución:** Usar `next/image` con Cloudinary loader

    **7. Validación de Modelo en Runtime**
    - **Riesgo:** `existeModelo()` se ejecuta en cliente
    - **Impacto:** Bajo - En SSG, 404 se maneja en build time
    - **Solución:** Usar `getStaticPaths` con `fallback: false` o `'blocking'`

    **8. Separación Vehículos/Utilitarios**
    - **Riesgo:** Lógica de filtrado en componente
    - **Impacto:** Bajo - Funciona igual en SSG
    - **Solución:** Mantener lógica o mover a `getStaticProps`

    **9. Carruseles con Scroll**
    - **Riesgo:** Refs y event listeners en cliente
    - **Impacto:** Bajo - Funciona igual en SSG
    - **Solución:** Sin cambios necesarios

    ### 6.3 Riesgos Menores

    **10. Redirects de Compatibilidad**
    - **Riesgo:** Redirects con `<Navigate>` de React Router
    - **Impacto:** Bajo - Next.js tiene `redirects` en `next.config.js`
    - **Solución:** Mover a configuración de Next.js

    **11. Preload en Nav**
    - **Riesgo:** Preload manual en componente Nav
    - **Impacto:** Bajo - Next.js tiene prefetch automático
    - **Solución:** Eliminar preload manual

    **12. Configuración SEO Dinámica**
    - **Riesgo:** `getSiteUrl()` resuelve en runtime
    - **Impacto:** Bajo - Next.js puede usar `process.env` en build
    - **Solución:** Usar variables de entorno en build time

    ---

    ## 7. RECOMENDACIONES PUNTUALES

    ### 7.1 Estructura de Archivos Next.js

    **Recomendación:**
    ```
    pages/
    ├── 0km/
    │   ├── index.js          → Listado (/0km)
    │   └── [autoSlug].js     → Detalle (/0km/:autoSlug)
    ```

    **O con App Router:**
    ```
    app/
    ├── 0km/
    │   ├── page.js           → Listado
    │   └── [autoSlug]/
    │       └── page.js       → Detalle
    ```

    ### 7.2 Generación de Paths Estáticos

    **Recomendación para `[autoSlug].js`:**
    ```javascript
    export async function getStaticPaths() {
    const slugs = getModelosSlugs() // ['208', '2008', ...]
    
    return {
        paths: slugs.map(slug => ({
        params: { autoSlug: slug }
        })),
        fallback: false // o 'blocking' si se agregan modelos dinámicamente
    }
    }

    export async function getStaticProps({ params }) {
    const modelo = getModelo(params.autoSlug)
    
    if (!modelo) {
        return { notFound: true }
    }
    
    return {
        props: {
        modelo,
        // Serializar datos necesarios
        }
    }
    }
    ```

    ### 7.3 Optimización de Imágenes

    **Recomendación:**
    - Usar `next/image` con Cloudinary loader
    - Configurar transformaciones en `next.config.js`:
    ```javascript
    images: {
    loader: 'cloudinary',
    domains: ['res.cloudinary.com'],
    // O usar custom loader para transformaciones
    }
    ```

    ### 7.4 SEO en Next.js

    **Recomendación (Pages Router):**
    ```javascript
    import Head from 'next/head'

    export default function CeroKilometroDetalle({ modelo }) {
    return (
        <>
        <Head>
            <title>{`${modelo.marca} ${modelo.nombre} 0km...`}</title>
            <meta name="description" content={modelo.seo.description} />
            {/* ... más meta tags */}
        </Head>
        {/* ... contenido */}
        </>
    )
    }
    ```

    **Recomendación (App Router):**
    ```javascript
    export async function generateMetadata({ params }) {
    const modelo = getModelo(params.autoSlug)
    
    return {
        title: `${modelo.marca} ${modelo.nombre} 0km...`,
        description: modelo.seo.description,
        // ...
    }
    }
    ```

    ### 7.5 Structured Data

    **Recomendación:**
    - Inyectar JSON-LD en `getStaticProps` o directamente en JSX:
    ```javascript
    <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
        __html: JSON.stringify(productSchema)
    }}
    />
    ```

    ### 7.6 Estado de Versión/Color

    **Recomendación:**
    - Mantener estado en URL query params: `/0km/2008?version=allure&color=negro`
    - O usar `useSearchParams` (App Router) o `router.query` (Pages Router)
    - Alternativa: localStorage para persistencia entre navegaciones

    ### 7.7 Migración Gradual

    **Recomendación:**
    1. Migrar primero el listado (`/0km`) - más simple
    2. Luego migrar detalle (`/0km/:autoSlug`) - más complejo
    3. Mantener estructura de datos igual (archivos en `src/data/modelos/`)
    4. Adaptar componentes gradualmente
    5. Testear cada paso antes de continuar

    ### 7.8 Testing

    **Recomendación:**
    - Verificar que todos los slugs generan páginas válidas
    - Verificar que slugs inválidos retornan 404
    - Verificar SEO en cada página (title, description, structured data)
    - Verificar que imágenes se cargan correctamente
    - Verificar que estado de versión/color funciona

    ---

    ## 8. RESUMEN EJECUTIVO

    ### Archivos Involucrados: ~25 archivos
    - 2 páginas principales
    - 8 archivos de datos de modelos
    - 1 archivo de colores
    - 1 archivo de configuración de imágenes
    - Múltiples componentes y hooks

    ### Riesgos Principales:
    1. **Alto:** Migración de routing (React Router → Next.js)
    2. **Alto:** SEO dinámico → estático
    3. **Medio:** Estado de versión/color
    4. **Medio:** Structured data en runtime

    ### Complejidad de Migración: **Media-Alta**
    - Estructura de datos bien organizada ✅
    - Componentes modulares ✅
    - Requiere refactor de routing y SEO ⚠️
    - Estado cliente-side necesita ajustes ⚠️

    ### Tiempo Estimado: **3-5 días**
    - Día 1: Setup Next.js + migrar listado
    - Día 2: Migrar detalle + paths estáticos
    - Día 3: SEO + structured data
    - Día 4: Optimización imágenes + testing
    - Día 5: Ajustes finales + documentación


