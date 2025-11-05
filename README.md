# Sistema de Ayuda (Plantilla docente)

Este proyecto es un ejemplo de “Manual de Usuario” para acompañar un sistema. Está pensado para clases: los estudiantes pueden cambiar textos, colores e imágenes sin tocar la estructura técnica.

## ¿Cómo funciona el flujo?

1) index.html (entrada principal)
- Estructura la página en dos zonas: menú lateral (izquierda) y contenido (derecha).
- El menú tiene botones por categoría (Factura, Producto, Usuario, etc.).
- Al hacer clic, se llama a `updateTitle('Categoría')` que actualiza el título y carga las acciones.

Diagrama del flujo principal (clic → acciones → carga en iframe):

```mermaid
flowchart LR
  A[Click en botón del menú] --> B[updateTitle]
  B --> C[cargarAcciones]
  C --> D{Botón de acción}
  D -->|clic| E[cargarContenidoIframe]
  E --> F[iframe.src = contenido/categoria/accion.html]
  F --> G{onload}
  G --> H[Inyectar estilos e iconos]
  H --> I[Envolver en help-content]
  I --> J[Mostrar página de ayuda]
  B -.-> K[Actualizar hash categoria]
  D -.-> L[Actualizar hash accion]
```

2) js/scripts.js (lógica sencilla)
- Define qué acciones tiene cada categoría (por ejemplo, Factura → Agregar, Actualizar, Buscar, Eliminar).
- Dibuja los botones de acciones y, cuando se hace clic, carga un archivo HTML dentro del iframe.
- Convierte el nombre de la categoría a una carpeta para encontrar el contenido (por ejemplo, "Categoría" → `contenido/categoria/`).
- Inserta dentro del iframe los estilos de ayuda y los iconos para que todo se vea igual.
- Guarda en la URL el estado seleccionado (`#categoria=...&accion=...`) para compartir enlaces.

3) contenido/*/*.html (las páginas del manual)
- Cada archivo es una página de ayuda independiente (por ejemplo, `contenido/factura/buscar.html`).
- Deben tener un bloque `<div class="help-content">...</div>` que es donde se muestra el texto, imágenes y ejemplos.
- Puedes escribir pasos, listas, callouts (avisos) y figuras con pie de imagen.

4) estilos/styles.css (estilo general del sitio)
- Colores y layout del marco principal (menú, encabezados, botones).
- Variables en `:root` para personalizar la paleta con rapidez.

5) estilos/help-styles.css (estilo del contenido del manual)
- Se aplica dentro del iframe a cada página de `contenido/`.
- Incluye tipografía, callouts, y tamaños de imágenes pensados para lectura.

## ¿Qué páginas se conectan entre sí?

- El menú de `index.html` → llama a `updateTitle('Categoría')` → `js/scripts.js` dibuja acciones.
- Botón de acción → carga `contenido/<categoria>/<accion>.html` dentro del iframe.
- Los estilos que afectan al contenido del manual vienen de `estilos/help-styles.css` (se inyecta automáticamente en el iframe).

Relaciones principales (ejemplos):
- Factura → Buscar → `contenido/factura/buscar.html`
- Producto → Actualizar → `contenido/producto/actualizar.html`
- Usuario → Registrar → `contenido/usuario/registrar.html`
- Compra → Realizar → `contenido/compra/realizar.html`
- Inventario → Revisar → `contenido/inventario/revisar.html`
- Categoría → Crear → `contenido/categoria/crear.html`
- Reportes → Generar → `contenido/reportes/generar.html`
- Detalle → Agregar → `contenido/detalle/agregar.html`

Mapa del sitio por categoría (diagramas separados para mejor legibilidad):

Factura
```mermaid
flowchart TB
  F[Factura] --> FB[Buscar]
  F --> FA[Agregar]
  F --> FU[Actualizar]
  F --> FE[Eliminar]
  FB --> FBf[contenido/factura/buscar.html]
  FA --> FAf[contenido/factura/agregar.html]
  FU --> FUf[contenido/factura/actualizar.html]
  FE --> FEf[contenido/factura/eliminar.html]
```

Producto
```mermaid
flowchart TB
  P[Producto] --> PA[Agregar]
  P --> PU[Actualizar]
  P --> PE[Eliminar]
  PA --> PAf[contenido/producto/agregar.html]
  PU --> PUf[contenido/producto/actualizar.html]
  PE --> PEf[contenido/producto/eliminar.html]
```

Usuario
```mermaid
flowchart TB
  U[Usuario] --> UR[Registrar]
  U --> UU[Actualizar]
  U --> UD[Desactivar]
  UR --> URf[contenido/usuario/registrar.html]
  UU --> UUf[contenido/usuario/actualizar.html]
  UD --> UDf[contenido/usuario/desactivar.html]
```

Compra
```mermaid
flowchart TB
  C[Compra] --> CR[Realizar]
  C --> CH[Historial]
  CR --> CRf[contenido/compra/realizar.html]
  CH --> CHf[contenido/compra/historial.html]
```

Inventario
```mermaid
flowchart TB
  I[Inventario] --> IR[Revisar]
  I --> IU[Actualizar]
  IR --> IRf[contenido/inventario/revisar.html]
  IU --> IUf[contenido/inventario/actualizar.html]
```

Categoría
```mermaid
flowchart TB
  Cat[Categoría] --> CC[Crear]
  Cat --> CE[Eliminar]
  CC --> CCf[contenido/categoria/crear.html]
  CE --> CEf[contenido/categoria/eliminar.html]
```

Reportes
```mermaid
flowchart TB
  R[Reportes] --> RG[Generar]
  R --> RD[Descargar]
  RG --> RGf[contenido/reportes/generar.html]
  RD --> RDf[contenido/reportes/descargar.html]
```

Detalle
```mermaid
flowchart TB
  D[Detalle] --> DA[Agregar]
  D --> DQ[Quitar]
  DA --> DAf[contenido/detalle/agregar.html]
  DQ --> DQf[contenido/detalle/quitar.html]
```

## ¿Para qué sirve este proyecto?

- Servir como guía de ayuda navegable para usuarios.
- Ejercicio docente: que los estudiantes editen textos, agreguen figuras y entiendan la relación entre páginas.

## Generalidades del código (qué cambiar y qué conservar)

- index.html
  - Puedes cambiar textos visibles (títulos, nombres de botones) y el logo.
  - Conserva la estructura del menú: lista `<ul class="nav">` con elementos `<li><button ...>...</button></li>`.

- js/scripts.js
  - Cambia los nombres en `accionesPorCategoria` para añadir o quitar acciones.
  - Conserva las funciones y sus nombres; así la navegación y el iframe siguen funcionando.

- estilos/styles.css
  - Cambia colores desde las variables en `:root`.
  - No cambies `display`, `flex-direction` y alturas del layout a menos que sepas el impacto.

- estilos/help-styles.css
  - Es el lugar para mejorar la lectura del manual: tamaños de texto, callouts, figuras.
  - Aquí también controlas el tamaño de las imágenes del manual (ver sección siguiente).

- contenido/*/*.html
  - Edita los títulos, párrafos y listas.
  - Usa callouts y figuras para hacer más clara la explicación.
  - Mantén el contenedor `.help-content`.

## Imágenes en el manual (tres tamaños recomendados)

Para insertar imágenes con tamaño consistente, usa figuras con clases:

- Pequeño (entre texto):
```html
<figure class="help-figure is-small">
  <img src="../../assets/ilustraciones/mi-imagen.svg" alt="Descripción breve" />
  <figcaption>Figura. Texto explicativo corto.</figcaption>
</figure>
```
- Mediano (entre párrafos, tamaño por defecto):
```html
<figure class="help-figure">
  <img src="../../assets/ilustraciones/mi-imagen.svg" alt="Descripción breve" />
  <figcaption>Figura. Texto explicativo.</figcaption>
</figure>
```
- Grande (para detalles, ocupa gran parte de la página):
```html
<figure class="help-figure is-xl">
  <img src="../../assets/ilustraciones/mi-imagen.svg" alt="Descripción breve" />
  <figcaption>Figura. Texto explicativo con más detalle.</figcaption>
</figure>
```

Equivalencias de ancho (configurable en `estilos/help-styles.css`):
- `is-small` ≈ 280 px
- por defecto ≈ 360 px
- `is-large` ≈ 480 px
- `is-xl` ≈ 720 px

## Callouts (avisos y tips)

Puedes resaltar notas importantes:
```html
<div class="callout callout-info"><i class="bi bi-info-circle"></i> Consejo: usa filtros para acotar la búsqueda.</div>
```
Variantes disponibles: `callout-info`, `callout-success`, `callout-warning`, `callout-danger`.

## Agregar una nueva categoría o acción

1) Agrega el botón en `index.html` (en la lista del menú) llamando a `updateTitle('Nombre')`.
2) En `js/scripts.js`, agrega el nombre en el objeto `accionesPorCategoria`.
3) Crea la carpeta `contenido/<nombre-sin-acentos>/` si no existe.
4) Crea los archivos `contenido/<nombre>/<accion>.html` (uno por acción) con esta estructura mínima:
```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Mi Categoría - Mi Acción</title>
  <link rel="stylesheet" href="../../estilos/help-styles.css" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body>
  <div class="help-content">
    <h2>Mi Categoría - Mi Acción</h2>
    <p>Explicación breve...</p>
  </div>
</body>
</html>
```

## Recomendaciones de imágenes

- Usa ilustraciones libres (unDraw, Storyset) o capturas reales del sistema.
- Formato: preferible SVG (ilustraciones) o WebP (capturas) y nombra así: `assets/ilustraciones/tema.svg` o `assets/capturas/categoria-accion-1.webp`.
- Mantén un ancho razonable según el tamaño elegido (small/medium/large/xl) para que el manual sea legible.

## Objetivo docente

- Practicar estructura HTML básica, lectura de CSS y entender una mínima lógica JS.
- Enfocado en personalización segura: cambiar textos, colores e imágenes sin romper la navegación.

¡Éxitos en la práctica! Si algo deja de funcionar, revisa que los nombres de archivos y carpetas coincidan con la categoría y acción que definiste.


