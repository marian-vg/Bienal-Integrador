# Bitácora de Trabajo (Walkthrough)

Este archivo registra las tareas realizadas, decisiones de diseño, resultados obtenidos y resúmenes de cada etapa del proyecto.

## 03 de Junio, 2026 - Planificación e Investigación del Stack

### Tareas Realizadas
*   Análisis de los sitios de referencia de la Bienal del Chaco (2022 y 2024) para comprender su diseño visual y secciones de presentación.
*   Discusión del stack tecnológico con el usuario (decisión: **React con Vite** para modularidad y rendimiento, **Tailwind CSS** para los estilos rápidos, y **WebGL/Shaders con Three.js** para el efecto de deformación líquida e interactiva de la imagen principal al pasar el cursor).
*   Creación del plan de implementación inicial: [implementation_plan.md](file:///C:/Users/Administrador/herd/Bienal-Integrador/implementation_plan.md).
*   Identificación de los assets disponibles en la carpeta `/documentacion` (`logo-bienal.png`, `presentacion-bienal.png` y `conceptos-bienal.png`).

## 03 de Junio, 2026 - Desarrollo de la Landing Page e Integración de Efectos (V4.0)

### Tareas Realizadas
*   **Boilerplate & Configuración**: Inicializado el proyecto con React + Vite. Se configuró e integró **Tailwind CSS v4.0** a través de `@tailwindcss/vite` y se definieron los colores de la marca en `src/index.css`.
*   **Seguridad del Entorno**: Se limpió `node_modules` y se configuró un archivo `.npmrc` con `ignore-scripts=true`. Las dependencias fueron instaladas de forma segura utilizando `pnpm install`.
*   **Assets Estáticos**: Movida la carpeta de recursos de `/documentacion` al directorio `/public/documentacion` para poder consumirlos de manera estática y correcta a través de URLs relativas.
*   **Generación de Obras de Arte**: Generados tres recursos visuales ultra premium con inteligencia artificial para la galería, usando colores rojo, azul y blanco:
    1.  [gallery-poster.png](file:///C:/Users/Administrador/herd/Bienal-Integrador/public/documentacion/gallery-poster.png) (Afiche abstracto de estilo suizo).
    2.  [gallery-sculpture.png](file:///C:/Users/Administrador/herd/Bienal-Integrador/public/documentacion/gallery-sculpture.png) (Escultura metálica de vanguardia).
    3.  [gallery-digital.png](file:///C:/Users/Administrador/herd/Bienal-Integrador/public/documentacion/gallery-digital.png) (Arte generativo interactivo digital).
*   **Componente WebGL**: Creado el componente [ImageDistortion.jsx](file:///C:/Users/Administrador/herd/Bienal-Integrador/src/components/ImageDistortion.jsx) que implementa un lienzo WebGL interactivo en Three.js con un shader personalizado de distorsión líquida (lerping en coordenadas y animación por ondas).
*   **UI Components**:
    *   [Navbar.jsx](file:///C:/Users/Administrador/herd/Bienal-Integrador/src/components/Navbar.jsx) (Cabecera flotante con glassmorphism y menú mobile responsivo).
    *   [Hero.jsx](file:///C:/Users/Administrador/herd/Bienal-Integrador/src/components/Hero.jsx) (Integración del texto de bienvenida y el contenedor interactivo WebGL).
    *   [Concepts.jsx](file:///C:/Users/Administrador/herd/Bienal-Integrador/src/components/Concepts.jsx) (Presentación del manifiesto y los pilares creativos de diseño al lado de la imagen conceptual).
    *   [Gallery.jsx](file:///C:/Users/Administrador/herd/Bienal-Integrador/src/components/Gallery.jsx) (Filtro dinámico de categorías y lightbox modal responsivo para previsualización).
    *   [Footer.jsx](file:///C:/Users/Administrador/herd/Bienal-Integrador/src/components/Footer.jsx) (Cierre corporativo y créditos académicos).
*   **Verificación**: Se corrió el compilado de producción mediante `pnpm run build` obteniendo cero errores de transpilación.
*   **Corrección de Bug en Caliente (WebGL Crash)**:
    *   *Problema*: Al ejecutar `pnpm dev`, React StrictMode montaba y desmontaba inmediatamente el componente, revelando una pantalla azul/en blanco permanente.
    *   *Causa*: Un error de referencia (`ReferenceError`) en la función de limpieza de `useEffect` en `ImageDistortion.jsx` al intentar desechar la geometría (`geometry.dispose()`) que había sido declarada localmente dentro del callback asíncrono de carga de texturas (`textureLoader.load`). Además, los tamaños iniciales en 0px causaban relaciones de aspecto `NaN` y el shader carecía de protección contra la división por cero (`dist = 0.0`).
    *   *Solución*: Se elevaron las declaraciones de `geometry` y `mesh` al ámbito del efecto principal, se añadieron valores de respaldo para evitar dimensiones de `0`, y se implementó un valor de precisión `0.00001` (épsilon) en la normalización del shader del fragmento para evitar salidas de píxel `NaN` en la GPU.
    *   *Resultado*: React renderiza perfectamente de forma fluida y sin crasheos en modo desarrollo y producción.

## 03 de Junio, 2026 - Ajustes de Diseño (Viewport Completo, Tema Rojo Oscuro y Optimización)

### Tareas Realizadas
*   **Rediseño de Layout**:
    *   Se simplificó la estructura a solo 2 secciones principales: **Inicio** y **Conceptos**.
    *   Se eliminó por completo la tercera sección (**Galería**) y sus archivos asociados ([Gallery.jsx](file:///C:/Users/Administrador/herd/Bienal-Integrador/src/components/Gallery.jsx)).
    *   Se removieron los enlaces de "Galería" y botones "Explorar" del componente [Navbar.jsx](file:///C:/Users/Administrador/herd/Bienal-Integrador/src/components/Navbar.jsx).
*   **Imágenes Full Viewport (100vh)**:
    *   Se ajustó [Hero.jsx](file:///C:/Users/Administrador/herd/Bienal-Integrador/src/components/Hero.jsx) para que el lienzo de deformación WebGL cubra todo el viewport (`100vh`/`w-full`), eliminando textos colaterales e instructivos a pedido del usuario.
    *   Se ajustó [Concepts.jsx](file:///C:/Users/Administrador/herd/Bienal-Integrador/src/components/Concepts.jsx) para que la imagen conceptual cubra el viewport completo con deformación WebGL, manteniendo únicamente el título "Conceptos" flotando en una tarjeta de vidrio.
*   **Optimización de Frecuencia del Mouse**:
    *   Se modificó el factor de interpolación lineal (`lerp`) de la posición del ratón en [ImageDistortion.jsx](file:///C:/Users/Administrador/herd/Bienal-Integrador/src/components/ImageDistortion.jsx) de `0.08` a `0.25` para lograr que el efecto visual reaccione mucho más rápido y siga la velocidad física del cursor.
*   **Rediseño de Color (Rojo Oscuro)**:
    *   Se redefinió el tema en [index.css](file:///C:/Users/Administrador/herd/Bienal-Integrador/src/index.css) cambiando la base azul marino por un tono **rojo vino oscuro premium** (`#160204`), adaptando los fondos, bordes de cristal y barras de desplazamiento.
*   **Verificación**: Compilado final de producción aprobado exitosamente mediante `pnpm run build`.

## 03 de Junio, 2026 - Ajustes de Diseño Iterativos (División 70/30, Tarjetas Spotlight y Transparencia)

### Tareas Realizadas
*   **División 70/30 en Sección de Conceptos**:
    *   Se reestructuró [Concepts.jsx](file:///C:/Users/Administrador/herd/Bienal-Integrador/src/components/Concepts.jsx) para utilizar una cuadrícula de 10 columnas en pantallas grandes (`lg:grid-cols-10`).
    *   La imagen con deformación interactiva WebGL ocupa el **70% de la pantalla** (`lg:col-span-7`), previniendo la pérdida de nitidez por el escalado masivo de baja resolución.
    *   El **30% restante** (`lg:col-span-3`) aloja las tarjetas de presentación de los conceptos básicos.
*   **Tarjetas con Efecto de Luz (Spotlight)**:
    *   Creadas tarjetas minimalistas que muestran únicamente el número y nombre del concepto.
    *   Implementado un **efecto Spotlight interactivo** (`SpotlightCard`): rastrea las coordenadas del puntero sobre cada tarjeta individual para renderizar un gradiente radial dinámico (`radial-gradient`), simulando un haz de luz linterna en la oscuridad, junto con un escalado ligero (`scale-105`) y resplandor en los bordes.
*   **Transparencia de Vidrio en Navbar y Fondo de Footer**:
    *   Modificado [Navbar.jsx](file:///C:/Users/Administrador/herd/Bienal-Integrador/src/components/Navbar.jsx) para atenuar la opacidad del fondo a `30%` (`bg-[#160204]/30`) e incrementar la dispersión del desenfoque (`backdrop-blur-xl`), perfeccionando el efecto de cristal.
    *   Actualizado [Footer.jsx](file:///C:/Users/Administrador/herd/Bienal-Integrador/src/components/Footer.jsx) para adaptarlo a un fondo rojo oscuro mate sólido (`bg-[#0d0102]`).
*   **Verificación**: Construcción de compilado con `pnpm run build` ejecutada con éxito (transformados 23 módulos, 0 errores).

## 03 de Junio, 2026 - Perfeccionamiento de Conceptos (Título a la Derecha, 4 Tarjetas Específicas y Aumento de Escala)

### Tareas Realizadas
*   **Reubicación del Título**:
    *   Se trasladó el bloque de cabecera de la sección (`Manifiesto Visual / Conceptos`) al costado derecho en [Concepts.jsx](file:///C:/Users/Administrador/herd/Bienal-Integrador/src/components/Concepts.jsx), posicionándose exactamente arriba del listado de tarjetas para una lectura unificada.
*   **Ampliación de Escala (+10%)**:
    *   Se expandió el ancho del contenedor del layout del 90vw al **92vw (y 88vw en pantallas XL)**, aumentando proporcionalmente la presencia visual de las secciones.
    *   Se cambió la relación de aspecto del lienzo WebGL de `16:10` a **`4:3`** en [Concepts.jsx](file:///C:/Users/Administrador/herd/Bienal-Integrador/src/components/Concepts.jsx), logrando que la imagen interactiva tenga un desarrollo vertical más alto y calce perfectamente a la par de la altura acumulada por las tarjetas de la derecha.
*   **Optimización de Tarjetas (4 Conceptos & Separación)**:
    *   Se ampliaron las tarjetas a exactamente **4 conceptos** y se reescribieron con el manifiesto literal solicitado:
        1. `01 - Transformación`
        2. `02 - Disruptivo`
        3. `03 - Contrastante`
        4. `04 - Explosivo`
    *   Se incrementó la separación vertical entre tarjetas en Tailwind de `gap-4` a **`gap-5`** para desahogar el espacio visual y aumentar la comodidad de interacción con el ratón.
*   **Verificación**: Construcción del compilado de producción con `pnpm run build` ejecutada con éxito (23 módulos, 0 errores).

## 03 de Junio, 2026 - Ajustes de Contraste y Posición (Título arriba a la derecha, Vino tinto ultra oscuro)

### Tareas Realizadas
*   **Posicionamiento del Título en Esquina Superior Derecha**:
    *   Se reubicó el bloque de título (`Manifiesto Visual / Conceptos`) en [Concepts.jsx](file:///C:/Users/Administrador/herd/Bienal-Integrador/src/components/Concepts.jsx) para ser un **overlay absoluto flotante en la esquina superior derecha** del contenedor de la imagen interactiva (`absolute top-6 right-6`), con textos alineados a la derecha y el indicador de línea en el mismo sentido, emulando la jerarquía visual inicial.
*   **Fondo Vino Tinto Ultra Oscuro**:
    *   Se bajó el tono del fondo principal en [index.css](file:///C:/Users/Administrador/herd/Bienal-Integrador/src/index.css) de `#160204` a **`#0c0102`** (un tono de rojo vino tinto extremadamente oscuro, casi negro, ideal para resaltar contrastes cromáticos rojos de forma premium).
    *   Se reajustó proporcionalmente el fondo de cristal de las tarjetas en `.glass-card` a `rgba(26, 2, 4, 0.5)`.
*   **Alineamiento del Color del Footer**:
    *   Se redujo correspondientemente el fondo de [Footer.jsx](file:///C:/Users/Administrador/herd/Bienal-Integrador/src/components/Footer.jsx) a **`#050000`** para mantener la jerarquía de tonos más oscuros en el pie de página.
*   **Verificación**: Construcción con `pnpm run build` ejecutada exitosamente (transformados 23 módulos, 0 errores).

## 03 de Junio, 2026 - Ajuste de Título de Conceptos (Esquina superior derecha de la sección)

### Tareas Realizadas
*   **Posicionamiento del Título Fuera de la Imagen**:
    *   Se extrajo el bloque flotante de título (`Manifiesto Visual / Conceptos`) del contenedor de la imagen en [Concepts.jsx](file:///C:/Users/Administrador/herd/Bienal-Integrador/src/components/Concepts.jsx).
    *   Se posicionó de forma absoluta en la **esquina superior derecha de la sección completa** (`absolute top-24 right-6 md:right-12`), flotando libremente de manera independiente del contenedor de la cuadrícula.
    *   Se agregó un espaciado de cabecera responsivo (`pt-20 lg:pt-0`) al contenedor de la cuadrícula principal para evitar cualquier tipo de solapamiento del título con los elementos de la cuadrícula al colapsar en pantallas móviles.
*   **Verificación**: Construcción final con `pnpm run build` exitosa (23 módulos, 0 errores).

## 03 de Junio, 2026 - Diseño Puramente Tipográfico del Título (Sin contenedor y al tope de sección)

### Tareas Realizadas
*   **Conversión a Texto Puro**:
    *   Se eliminó el contenedor de cristal (`glass-panel`), los bordes y las líneas decorativas en [Concepts.jsx](file:///C:/Users/Administrador/herd/Bienal-Integrador/src/components/Concepts.jsx), dejando el bloque de título como un elemento puramente tipográfico minimalista.
*   **Posicionamiento al Tope de la Sección**:
    *   Se reubicó el título textual de forma absoluta al extremo superior derecho de la sección completa (`absolute top-16 right-6 md:right-12`), dejando una distancia/margen superior limpia de 64px, lo que otorga una gran sensación de amplitud espacial.
    *   Se mantuvo el ajuste responsivo de padding (`pt-20`) en dispositivos móviles para separar el texto de los elementos apilados del grid.
*   **Verificación**: Construcción final con `pnpm run build` exitosa (23 módulos, 0 errores).

## 03 de Junio, 2026 - Análisis y Corrección de Visualización Borrosa del SVG

### Tareas Realizadas
*   **Investigación del Comportamiento**:
    *   Se analizó la causa de la visualización borrosa: en WebGL (Three.js), las imágenes cargadas a través de `TextureLoader` se renderizan primero en un lienzo/bitmap utilizando los atributos `width` y `height` declarados en el propio archivo SVG.
    *   Se identificó que el archivo `public/documentacion/presentacion-bienal.svg` que el navegador consumía aún tenía las dimensiones nativas de `width="420" height="297"`, haciendo que se rasterice en muy baja resolución antes de ser escalado por Three.js al tamaño completo del viewport (100vh).
    *   Se identificó que el SVG contiene una imagen PNG incrustada en Base64 con un ancho nativo de `768px`. Por lo tanto, aunque se aumente la resolución de rasterización a 2048px, la imagen tendrá cierto límite físico de definición a pantalla completa, pero se verá drásticamente mejor y más nítida que antes.
*   **Corrección de Assets**:
    *   Se copió el archivo SVG corregido (con `width="2048" height="1448"`) desde la carpeta original `documentacion/` hacia `public/documentacion/` para reemplazar la versión de baja resolución.
*   **Verificación**:
    *   Se confirmó que `public/documentacion/presentacion-bienal.svg` ahora cuenta con los atributos actualizados de alta resolución (`width="2048"` y `height="1448"`).

## 03 de Junio, 2026 - Migración a SVG de Logo y Conceptos, y Rediseño de Layout de Conceptos

### Tareas Realizadas
*   **Actualización de Formatos de Asset**:
    *   Se copiaron los archivos `logo-bienal.svg` y `conceptos-bienal.svg` del directorio `documentacion/` al directorio `public/documentacion/`.
    *   Se reemplazaron las referencias a `logo-bienal.png` en [Navbar.jsx](file:///C:/Users/Administrador/herd/Bienal-Integrador/src/components/Navbar.jsx) y [Footer.jsx](file:///C:/Users/Administrador/herd/Bienal-Integrador/src/components/Footer.jsx) con `logo-bienal.svg`.
    *   Se reemplazó la referencia a `conceptos-bienal.png` en [Concepts.jsx](file:///C:/Users/Administrador/herd/Bienal-Integrador/src/components/Concepts.jsx) con `conceptos-bienal.svg`.
*   **Rediseño y Ampliación de Layout de Conceptos**:
    *   Se amplió el ancho relativo del contenedor de imagen interactiva WebGL en [Concepts.jsx](file:///C:/Users/Administrador/herd/Bienal-Integrador/src/components/Concepts.jsx) cambiando la cuadrícula a 12 columnas (`lg:grid-cols-12`) con la imagen ocupando 9 columnas (`lg:col-span-9`, que representa el 75% del ancho, logrando un aumento del 10% relativo en el tamaño de la imagen respecto al diseño previo de 7/10).
    *   Se alineó el contenedor del grid hacia el borde izquierdo de la pantalla en dispositivos de escritorio (`lg:max-w-none lg:mx-0 lg:pl-[10px] lg:px-0`), dejando exactamente un margen izquierdo de 10px entre la imagen conceptual y el borde de la pantalla.
    *   Se mantuvo la alineación de margen derecho de 48px (`lg:pr-12`) para coordinar simétricamente con el título absoluto del manifiesto.
*   **Verificación**: Construcción de producción con `pnpm run build` ejecutada exitosamente sin errores (23 módulos transformados, 0 errores).

## 03 de Junio, 2026 - Ajuste de Altura en Sección de Presentación (Hero)

### Tareas Realizadas
*   **Ajuste de Dimensiones**:
    *   Se modificó la altura del elemento `<section id="inicio">` en [Hero.jsx](file:///C:/Users/Administrador/herd/Bienal-Integrador/src/components/Hero.jsx) de `h-screen` (100vh) a `h-[calc(100vh+10px)]` (100vh + 10px).
    *   Esto permite compensar la relación de aspecto de la imagen vectorial e incrementar el espacio de renderizado vertical, asegurando que todos los detalles y el texto de la imagen de presentación sean visibles sin recortes por el efecto aspect-ratio de WebGL.
*   **Verificación**: Construcción de producción con `pnpm run build` ejecutada exitosamente sin errores (23 módulos, 0 errores).

## 03 de Junio, 2026 - Planificación de Refactorización y Animaciones de Interfaz Móvil Desacoplada

### Tareas Realizadas
*   **Planificación de la Arquitectura Móvil Desacoplada**:
    *   Definición del plan de desarrollo para separar los componentes de Hero e Inicio en versiones exclusivas para móvil y escritorio (`HeroDesktop`/`HeroMobile`, `ConceptsDesktop`/`ConceptsMobile`) a fin de desacoplar lógicas de diseño responsivo complejas y evitar conflictos de rendimiento en dispositivos táctiles.
    *   Planificación del hook de detección dinámica de tamaño de pantalla `useMediaQuery.js`.
    *   Planificación del hook animador de scroll reutilizable `useScrollReveal.js` que utiliza Intersection Observer nativo del navegador.
    *   Documentación de este plan técnico en [implementation_plan.md](file:///C:/Users/Administrador/herd/Bienal-Integrador/implementation_plan.md).

## 03 de Junio, 2026 - Desarrollo de la Interfaz Móvil Desacoplada y Animaciones de Scroll

### Tareas Realizadas
*   **Creación de Hooks React**:
    *   Creado `src/hooks/useMediaQuery.js` para detectar dinámicamente si el viewport es móvil/táctil (`max-width: 1023px`).
    *   Creado `src/hooks/useScrollReveal.js` que implementa un `IntersectionObserver` reutilizable con configuraciones personalizables (revelado único, retardos, márgenes de activación).
*   **Integración de Soporte Táctil en WebGL**:
    *   Actualizado `src/components/ImageDistortion.jsx` para registrar escuchadores de eventos táctiles (`touchstart`, `touchmove`, `touchend`) con políticas pasivas de desplazamiento, lo que habilita la distorsión líquida interactiva en pantallas móviles al arrastrar el dedo.
*   **Configuración de Animaciones CSS**:
    *   Se agregaron las clases `.reveal-hidden` (estado base con opacidad, desplazamiento y desenfoque) y `.reveal-visible` (estado final con aceleración de GPU) en [index.css](file:///C:/Users/Administrador/herd/Bienal-Integrador/src/index.css).
    *   Se agregaron clases utilitarias de retardo progresivo (`reveal-delay-100` a `reveal-delay-400`) para simular efectos de cascada en listados.
*   **Desacoplamiento e Implementación**:
    *   **Inicio (Hero)**:
      *   Creado `HeroDesktop.jsx` (100vh + 10px, distorsión por cursor).
      *   Creado `HeroMobile.jsx` (100dvh para adaptarse a barras de navegación de teléfonos móviles).
      *   Reescrito [Hero.jsx](file:///C:/Users/Administrador/herd/Bienal-Integrador/src/components/Hero.jsx) para conmutar dinámicamente usando el hook `useMediaQuery`.
    *   **Conceptos (Concepts)**:
      *   Creado `ConceptsDesktop.jsx` (layout de 12 columnas con margen de 10px a la izquierda y spotlight cards).
      *   Creado `ConceptsMobile.jsx` (layout apilado verticalmente, con efectos de scroll reveal en el título, la imagen y cascada progresiva de tarjetas, además de respuesta táctil `active:scale-95`).
      *   Reescrito [Concepts.jsx](file:///C:/Users/Administrador/herd/Bienal-Integrador/src/components/Concepts.jsx) para conmutar dinámicamente usando el hook `useMediaQuery`.
*   **Verificación**: Construcción de producción con `pnpm run build` ejecutada exitosamente sin errores (29 módulos transformados, 0 errores).

## 03 de Junio, 2026 - Integración de GSAP + ScrollTrigger para Narrativa Táctil Móvil

### Tareas Realizadas
*   **Instalación de Dependencias**:
    *   Se instaló `gsap` (versión 3.15.0) en el entorno local a través de `pnpm`.
*   **Creación de Layout Unificado de Historia Móvil**:
    *   Creado [MobileLayout.jsx](file:///C:/Users/Administrador/herd/Bienal-Integrador/src/components/MobileLayout.jsx) que centraliza la experiencia móvil en una sola sección con comportamiento de anclaje de pantalla (`pin: true`) y control de reproducción reversible sincronizado al tacto y scroll (`scrub: 1`).
    *   **Línea de tiempo de GSAP (Paso a Paso)**:
      1. El logotipo e isotipo de la bienal comienzan grandes en el centro del viewport con fondo negro. Al avanzar el scroll, el logo se reduce a la mitad y se desplaza suavemente a la esquina superior izquierda (`top: 16px`, `left: 24px`, `scale: 0.5`) para integrarse con la cabecera, mientras la imagen del Hero se revela.
      2. La imagen de presentación (Hero) se mantiene completamente visible y luego se desvanece de `opacity: 1` a `0`.
      3. La imagen conceptual de Conceptos se revela de `opacity: 0` a `1`.
      4. Las tarjetas de Conceptos (con fondo de panel de cristal) emergen desde el fondo en cascada progresiva individual, mientras que el canvas de fondo de Conceptos se atenúa de `opacity: 1` a `0.4` para garantizar máxima legibilidad.
      5. Al finalizar las animaciones, la pantalla se desancla y se puede scrollar libremente hacia el Footer académico.
    *   **Navbar flotante móvil**: Se integró un menú hamburguesa de interacción rápida en el encabezado flotante que permite navegar mediante scroll fluido a las posiciones clave del timeline de scroll (`Inicio` a scroll 0, `Conceptos` a 2.5x la altura de la pantalla).
*   **Rutado Condicional**:
    *   Actualizado [App.jsx](file:///C:/Users/Administrador/herd/Bienal-Integrador/src/App.jsx) para rutear todo el flujo de forma exclusiva hacia `<MobileLayout />` en dispositivos móviles, desacoplando por completo el árbol de componentes móvil del de escritorio.
*   **Verificación**: Construcción de producción con `pnpm run build` ejecutada exitosamente sin errores (35 módulos transformados, 0 errores).

## 03 de Junio, 2026 - Refinamiento Secuencial de Timeline GSAP y Contraste de Tarjetas Móviles (V5.0)

### Tareas Realizadas
*   **Separación Secuencial del Logo y Hero**:
    *   Se modificó el timeline de GSAP en [MobileLayout.jsx](file:///C:/Users/Administrador/herd/Bienal-Integrador/src/components/MobileLayout.jsx) para desfasar la animación del logo y de la imagen Hero. Al hacer scroll hacia abajo, primero se traslada el logo hacia el navbar manteniendo el fondo en negro absoluto. Luego, al seguir scrolleando, comienza la transición de acercamiento y opacidad de la imagen de presentación (Hero).
*   **Repetición de Efecto Zoom en Conceptos**:
    *   Se refinó la transición de la imagen de Conceptos para que siga exactamente el mismo ciclo inmersivo que la de presentación: aparece y se acerca (escala de `0.8` a `1.0`), se detiene brevemente en pantalla completa, y al seguir desplazándose se aleja de nuevo (escala de `1.0` a `0.8`).
*   **Capa de Fondo Oscura Integrada (Backdrop Overlay)**:
    *   Se insertó un elemento div absolute (`conceptsOverlayRef`) con fondo negro profundo (`#0c0102`) y z-index 25, situado justo por encima de la imagen de conceptos (`z-20`) pero por debajo de las tarjetas conceptuales (`z-30`).
    *   En la línea de tiempo de GSAP, al llegar al despliegue de las tarjetas, esta capa aumenta su opacidad suavemente de `0` a `0.85`, atenuando progresivamente el fondo de los conceptos para brindar un contraste perfecto y legibilidad excepcional a las tarjetas.
*   **Optimización de Estilos de Tarjetas en Azul Oscuro**:
    *   Siguiendo el feedback del usuario, se ajustó el color de fondo de las tarjetas en [MobileLayout.jsx](file:///C:/Users/Administrador/herd/Bienal-Integrador/src/components/MobileLayout.jsx) y [ConceptsMobile.jsx](file:///C:/Users/Administrador/herd/Bienal-Integrador/src/components/ConceptsMobile.jsx) hacia un azul oscuro premium (`#112240`/`bg-[#112240]/95`) con un borde azul sutilmente iluminado (`#3b82f6/25`). Este tono es claramente azul y contrasta maravillosamente con el fondo vino tinto ultra oscuro del sitio sin resultar apagado.
    *   Se mejoraron los efectos táctiles móviles (`active:scale-97`, `active:bg-[#2563eb]/30`, y `active:border-[#2563eb]/60`) para una respuesta táctil instantánea y satisfactoria.
*   **Ajuste de Navegación del Menú Móvil**:
    *   Se actualizó el cálculo de scroll en la navegación interna: la sección de "Conceptos" desplaza el scroll a `3.0x` la altura de la pantalla, alineándose de forma exacta con la nueva escala de tiempo (`end: "+=550%"`) en la que los conceptos están completamente legibles en pantalla.
*   **Verificación**:
    *   Compilación de producción exitosa a través de `pnpm run build` sin advertencias ni errores (dist/assets transformados y empaquetados).

### Próximos Pasos
1. Realizar una validación visual interactiva en múltiples viewports móviles emulados para corroborar la fluidez del timeline y las transiciones de zoom consecutivas.
