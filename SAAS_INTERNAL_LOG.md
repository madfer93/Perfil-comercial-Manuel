# Base de Conocimiento Interna: CHANTILLY GOURMET (SaaS)

> [!WARNING]
> **ESTE ARCHIVO ES CONFIDENCIAL Y LOCAL**. 
> NO DEBE SUBIRSE A GITHUB NI A VERCEL. Ya estÃ¡ excluido en el `.gitignore` bajo las reglas de `SAAS_INTERNAL*.md`.

Este documento sirve como bitÃ¡cora y base de verdad para los despliegues de **Chantilly Gourmet**, el primer cliente de la plataforma SaaS de Variedades JyM. AquÃ­ debes documentar todas las sentencias SQL que corras en su Supabase, contraseÃ±as temporales y estructura del flujo.

---

## 1. Credenciales de Franquicia (Ambiente Local)

- **Vercel URL**: `[Pendiente de AsignaciÃ³n por Despliegue]`
- **Supabase URL**: `[Ingresar Supabase URL Privado del Cliente]`
- **Supabase Key (Anon)**: `[Ingresar Supabase KEY Privada del Cliente]`
- **WhatsApp Oficial**: `573232317736`
- **UbicaciÃ³n Base**: `Calle 4ta # 17-92 Barrio Vizcaya Villavicencio, Meta`

---

## 1.1 Credenciales FacturaciÃ³n ElectrÃ³nica DIAN (Factus API Sandbox)

- **Entorno**: Pruebas (Sandbox)
- **URL Base**: `https://api-sandbox.factus.com.co`
- **Correo/Usuario**: `sandbox@factus.com.co`
- **ContraseÃ±a**: `sandbox2024%`
- **Client ID**: `a13e51f6-35f3-4c28-a0b9-9754c56e4adb`
- **Client Secret**: `kNRcQEoatyFYEh8EJI7Man3B3mLTj1kzxMKIawlJ`
- *Nota*: Rango de numeraciÃ³n ilimitado para pruebas.

---

## 2. Modificaciones al CÃ³digo Base (Changelog de IndependizaciÃ³n)

Detalle de lo que se ha modificado respecto a la plantilla original "Sipote Malteada" para crear este cliente:

1. **Variables DinÃ¡micas del Tenant** (`js/tenant-config.js`):
   - Se inyectÃ³ un sistema de configuraciÃ³n global que sobreescribe Nombre, Logo local (`img/logo-chantilly.jpg`), horarios, whatsapp y colores de marca (`--primary-color`, degradados).
   
2. **RefactorizaciÃ³n Visual y de Textos**:
   - `index.html`: Eliminadas imÃ¡genes y gradientes quemados. Las ofertas e imÃ¡genes fallback usan el logo de Chantilly.
   - `menu.html` y `menu.js`: CategorÃ­as inyectadas dinÃ¡micamente (`PanaderÃ­a`, `Desayunos`, `Postres`, etc.) y placeholder cambiado.
   - `pos.html` y `pos-digital.html`: Colores adaptables al tenant, tÃ­tulos corregidos y categorÃ­as conectadas a la variable global.

3. **Correcciones Fixes LÃ³gicos (Cart.js)**:
   - Se independizÃ³ el almacenamiento del localStorage usando la Key `tenantCart`.
   - SoluciÃ³n a errores de validaciÃ³n de BBDD (`customer_phone not null`) para pedidos de mesa y llevar.
   - Fallback de modal en el Index que saltaba error "null properties" resuelto.
   - Enlace GPS integrado al tocar la tarjeta de UbicaciÃ³n.

---

## 3. Scripts SQL Requeridos en su Instancia Supabase

Dado que es un nuevo cliente, **debes crear un proyecto de Supabase en blanco** para Chantilly Gourmet y correr los siguientes scripts para que la aplicaciÃ³n local comience a funcionar con esta franquicia.

### 3.1. Tablas Base
```sql
-- Productos
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(50),
    image_url TEXT,
    available BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Pedidos
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    items JSONB,
    total DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'pendiente',
    table_number INTEGER,
    customer_phone VARCHAR(20),
    customer_name VARCHAR(100), -- Agregado para compatibilidad
    order_type VARCHAR(20),     -- Mesa, Llevar o Domicilio
    delivery_address TEXT,
    notes TEXT,
    domiciliario_id INTEGER,
    domiciliario_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);

-- Ofertas
CREATE TABLE offers (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100),
    description TEXT,
    product_id INTEGER, -- Relacionar oferta a un Id producto
    image_url TEXT,
    discount_percentage INTEGER,
    active BOOLEAN DEFAULT TRUE,
    show_in_slider BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Vendedores (POS)
CREATE TABLE sellers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(100),
    role VARCHAR(20) DEFAULT 'vendedor',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

> [!NOTE]
> Puedes ir aÃ±adiendo debajo de este archivo cualquier nueva polÃ­tica RLS o alteraciÃ³n a las tablas que requieras durante la fase de puesta en marcha.

---

## 4. [2026-03-14] - ImplementaciÃ³n de Servicios Premium y SEO (Portafolio Manuel)
- **Mejoras SEO**:
  - ActualizaciÃ³n de metadatos en `index.html`: `FacturaciÃ³n electrÃ³nica Colombia`, `API Factus`, `Addi`, `Sistecredito`, `Agentes de IA WhatsApp`.
  - ActualizaciÃ³n de `sitemap.xml` (lastmod: 2026-03-14).
- **SecciÃ³n de Integraciones**:
  - AÃ±adida secciÃ³n "Integraciones de Alto Impacto" con tarjetas para FacturaciÃ³n ElectrÃ³nica (Factus), Pagos (Addi/Sistecredito) e IA Propietaria.
  - El enfoque es puramente visual para retenciÃ³n de usuarios, con CTA directo a WhatsApp.
- **Estilos**: ImplementaciÃ³n de clases `.service__card--premium` y `.premium-badge` en `style.css` para diferenciaciÃ³n visual.
- **Marketing Digital**: Se integrÃ³ la secciÃ³n "Potencia tu Marca" en `index.html` usando activos de `assets/marketing/` para demostrar la capacidad de generaciÃ³n de contenido visual.
- **Git Commit**: Realizado commit seguro incluyendo solo `index.html`, `style.css` y `sitemap.xml`. Archivos sensibles excluidos.

- **Marketing Digital**: Se ha migrado la sección de marketing a una página independiente marketing.html para una presentación más profesional y expansiva de los activos de IA.
- **Navegación**: Actualizados los menús de index.html y marketing.html para una navegación fluida entre secciones y páginas.


## [2026-03-14] - Mejoras Avanzadas: Marketing Dinámico y Gestión Admin
- **Infraestructura de Datos**: Creada tabla marketing_assets en Supabase para gestión dinámica de contenido visual.
- **Página de Marketing**:
  - Implementado efecto Lightbox (agrandar imagen) para una mejor experiencia de usuario.
  - Footer sincronizado con el estilo global del sitio.
  - Carga dinámica de activos desde la base de datos.
- **SuperAdmin**: 
  - Nueva sección para agregar, editar y eliminar activos de marketing (Imagen, Título, Descripción).
  - Interfaz de previsualización de imágenes integrada.
- **Seguridad Git**: Commit realizado excluyendo archivos sensibles y variables de entorno.

## Actualización v4 (14 de Marzo 2026) - Hub Maestro & Automatización Visual
- **Hub Maestro Unificado**: Implementación de `superadmin.html` con pestañas para separar marketing y gestión de IA.
- **Autenticación en Backend**: Eliminación de contraseñas harcodeadas; ahora el login valida contra el backend de Node.js mediante el endpoint `/api/admin/verify`.
- **Integración ImgBB**: Sistema de "Arrastrar y Soltar" para subir imágenes directamente desde el PC, automatizando la obtención de URLs para el catálogo.
- **Botones de Acción (CTA)**: Nueva funcionalidad para añadir enlaces de WhatsApp o webs externas a cada activo de marketing, mejorando la conversión y el SEO.
- **Robustez en Producción**: Ajustes de CSP y rutas estáticas en `server.js` para garantizar el diseño correcto en despliegues sobre Vercel.
- **Migración Database**: Esquema de Supabase actualizado con `business_unit` y `redirect_url` para soportar múltiples unidades de negocio.

## [2026-03-23] - Rebranding B2B "JyM Tech Solutions" y Arquitectura de Confianza
- **Identidad corporativa**: Transición completa de la UI hacia "JyM Tech Solutions" con enfoque B2B.
- **Arquitectura de Confianza**: Integración del Framework Estratégico OBS (IA Explicable y Ley 1581) y badges de AWS/Britcham Academy.
- **Flujo de Captación B2B**: Nueva ruta `contacto.html` con un formulario estructurado para cualificación de leads de empresas, sincronizado en tiempo real con Supabase (`leads`).
- **Arquitectura Dual de Precios**: Modelado de Pricing en `proyectos.html` separando "Plan PyME" (One-Shot) de "Enterprise B2B" (Retainer mensual).
- **SuperAdmin V2.1**: Pestaña dedicada para visualizar los Leads B2B y un Asistente IA Integrado (Groq API) para gestionar respuestas.
- **Estabilidad de Red**: Parche al Core del Service Worker (`sw.js`) para evitar que el interceptor de caché bloquee y rompa las promesas hacia dominios API Cross-Origin (Supabase, ImgBB).
