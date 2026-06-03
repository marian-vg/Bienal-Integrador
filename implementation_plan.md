# Plan de Implementación: Landing Page Bienal

Este plan detalla el desarrollo de la página de presentación (landing page) para la bienal del proyecto integrador de la Lic. en Comunicación Visual (FADU-UTN).

## 1. Stack Tecnológico Elegido
*   **Core**: React + Vite (para una estructura modular, moderna y carga ultra rápida).
*   **Estilos**: Tailwind CSS (versión a confirmar por el usuario, sugerido v4 o v3.4) + CSS personalizado para los shaders.
*   **Efectos Visuales**: WebGL / Shaders con Three.js para la deformación líquida e interactiva de la imagen de portada al pasar el cursor.
*   **Fuentes**: Google Fonts (ej. Inter / Outfit / Playfair Display) para lograr una tipografía premium.

## 2. Paleta de Colores y Estética
*   **Colores de destaque**: Rojo, Azul y Blanco.
*   **Estilo**: Premium y dinámico, con fondos oscuros/claros limpios, gradientes sutiles y micro-interacciones.

## 3. Estructura de la Landing Page
La página será de una única interfaz (single-page landing) enfocada en la presentación visual, omitiendo secciones de contacto y mapa físico:
1.  **Navbar**:
    *   Logo de la bienal (`documentacion/logo-bienal.png`).
    *   Enlaces de navegación con scroll suave.
    *   Menú mobile interactivo (hamburguesa).
2.  **Hero Section (Inicio)**:
    *   Contenedor con la imagen de presentación (`documentacion/presentacion-bienal.png`) procesada con WebGL.
    *   Efecto de deformación líquida / distorsión interactiva al pasar el mouse.
    *   Título principal de bienvenida y bajada inspirada en la Bienal del Chaco.
3.  **Sección de Conceptos**:
    *   Presentación de los conceptos artísticos utilizando `documentacion/conceptos-bienal.png` o tarjetas interactivas adaptadas al diseño.
4.  **Galería de Exposición**:
    *   Sección inspirada en el flujo de esculturas de la Bienal del Chaco, mostrando un grid premium de obras y artistas con efectos hover limpios.
5.  **Footer**:
    *   Cierre de la página con redes sociales, créditos y estética unificada.

## 4. Plan de Tareas

### Fase 1: Inicialización del Proyecto
- [x] Inicializar la aplicación React + Vite en el directorio raíz usando `npm create vite`.
- [x] Instalar e inicializar Tailwind CSS v4.0.
- [x] Configurar las fuentes de Google Fonts y los colores base (Rojo, Azul, Blanco) en la configuración de Tailwind.

### Fase 2: Configuración de Efectos WebGL
- [x] Instalar dependencias para el efecto visual (`three` o librerías específicas) de forma segura con pnpm.
- [x] Crear un componente reutilizable de React para la distorsión de imágenes por WebGL (Shader de desplazamiento interactivo controlado por coordenadas del mouse).
- [x] Realizar pruebas preliminares del efecto con la imagen `presentacion-bienal.png`.

### Fase 3: Construcción de la Interfaz (UI)
- [x] Implementar el Navbar (responsivo, con el logo en metadata y cabecera).
- [x] Implementar la Hero Section integrando el efecto WebGL y textos principales.
- [x] Crear la Sección de Conceptos integrando `conceptos-bienal.png`.
- [x] Diseñar la Sección de Galería con micro-animaciones premium y modal lightbox.
- [x] Añadir el Footer con iconos de redes sociales y enlaces estáticos.

### Fase 4: Pulido y Optimización (Aesthetics)
- [ ] Aplicar animaciones de entrada suaves (ej. transiciones CSS puras o micro-interacciones).
- [x] Asegurar total adaptabilidad mobile (responsive design).
- [x] Verificar rendimiento de renderizado del Canvas de Three.js para evitar lag en dispositivos móviles (mediante limitación de FPS/pixel ratio).

