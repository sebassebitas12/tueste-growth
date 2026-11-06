# Tueste — instrucciones de implementación

## Autorización y prioridad

Sebastián aprobó la dirección visual de los PNG y pidió continuar en Codex de Visual Studio Code. Implementar el prototipo; no volver a pedir autorización para comenzar. Sebastián retiró expresamente el límite de las 12:00: todavía no está habilitado el espacio de entrega. Trabajar hasta completar y verificar el alcance acordado, sin recortar diseño, funcionalidad o comprobaciones para ajustarse a esa hora. No generar nuevas imágenes ni variantes con IA salvo petición explícita. Las iteraciones anteriores consumieron uso innecesariamente.

Leer primero `docs/CONTEXTO_TUESTE.md`, las imágenes de `docs/diseno/` y los PDFs de Tueste de `docs/fuentes/`. Las imágenes son la dirección visual aprobada, no una web terminada. El chat previo no se hereda: los hechos útiles están documentados aquí.

## Diseño

- Prioridad: instrucciones actuales del usuario, requisitos del caso y este AGENTS, imágenes aprobadas y ficha visual; después guías de referencia.
- La skill universal original se conserva en `docs/referencias/` como referencia consultable. No trasladar el negocio, marca, fuentes industriales, WebGL, CAD, Supabase ni ejemplos de Vértice a Tueste.
- Mantener el logo, composición editorial, fotografía conceptual, tipografía, paleta cálida oscura, curvas y superficies mates de los PNG. Fondo `#1A1917`, superficie `#25231F`, texto `#F5F0E7`, secundario `#C0B7A9`, acento `#D6B67B`.
- Portada independiente y curada. Catálogo, detalle, carrito, checkout y programa en rutas propias; no una página larga con anclas.
- Evitar cajas dentro de cajas, tarjetas para todo, bordes claros de contorno, sombras duras, indicadores falsos de conexión y emojis. Iconos Lucide o SVG.
- Utilizar las imágenes existentes; se permiten encuadres con CSS para aprovechar sus fotografías conceptuales sin hacer más generaciones. No usar la captura completa como sustituto de una interfaz funcional.
- En móvil, controles de al menos 44 px, texto legible, sin desbordamiento horizontal. Foco visible y movimiento reducido.

## Implementación y verificación

### Estructura exigida por Sebastián

Separar explícitamente `frontend/` y `backend/` en la raíz. El frontend debe contener su `package.json`, `index.html`, configuración Vite, `public/` y `src/` organizado en `app/`, `pages/`, `components/`, `context/`, `hooks/`, `services/` y `utils/`, creando cada módulo según su responsabilidad real. `src/main.jsx` solo inicia React; las pantallas y lógica no se concentran allí.

El backend debe contener su `package.json` y `src/` con entrada/arranque, rutas, controladores, servicios de negocio y acceso a SQLite separados de forma proporcional al proyecto; esquema y seed deben tener ubicación clara, y las pruebas de integración su carpeta propia. La base de ejecución pertenece a `backend/data/` y se ignora en Git. Conservar los datos existentes durante cualquier reorganización; las pruebas deben usar una base aislada.

La raíz conserva `docs/`, instrucciones, README y un `package.json` de coordinación para instalar y arrancar ambos proyectos. Un solo lockfile raíz si se usan npm workspaces. Actualizar scripts, imports, rutas a recursos, variables, SQLite, pruebas, configuración lint y documentación después de mover archivos. No borrar trabajo funcional ni reescribir funcionalidades para cambiar carpetas.

Mantener JSX, JavaScript y CSS legibles, con indentación y bloques claros; no comprimir componentes completos o todas las pantallas en líneas gigantes. El objetivo es una estructura mantenible y comprensible, no solo renombrar `server` y `src`.

Decisión vigente de Sebastián: proyecto FULL STACK entregado como repositorio normal de GitHub y ejecutado localmente por quien lo revise. No publicar en Vercel, Sites ni otros servicios, y no crear recursos en Supabase. El repositorio debe incluir frontend, backend real, base de datos persistente reproducible, datos demo y guía de ejecución. La entrega por GitHub no implica que el sitio esté alojado en línea.

Inspeccionar la carpeta antes de editar. Si no existe código, usar React + Vite y rutas independientes para frontend; Node.js + Express para API; SQLite para persistencia local, con un controlador compatible con la versión de Node documentada. Permitir instalación y arranque desde scripts en la raíz. No exigir al profesor instalar un servidor de base de datos ni crear cuentas en servicios externos.

Priorizar el ciclo: cliente comparte enlace → amistad ve regalo aplicado → producto/carrito → compra simulada → cuenta de quien invitó actualizada → progreso y premio → panel de Diego. Acompañarlo con portada, catálogo y condiciones. La API y la base de datos son la fuente de verdad para pedidos, referidos, créditos, recompensas y métricas; no sustituirlos por localStorage. LocalStorage puede conservar preferencias o selección demo, nunca ser el único registro de negocio. Validar precios y beneficios en el servidor, usar transacciones y evitar duplicación de recompensas al repetir una solicitud. No realizar cobros, enviar mensajes reales ni crear servicios externos. No recoger datos bancarios.

Conservar acceso directo a vistas de demostración para permitir mostrar todo en tres minutos, identificado fuera de la experiencia normal del cliente. WhatsApp puede mostrar una vista previa local del mensaje, sin enviarlo automáticamente.

Ejecutar las comprobaciones disponibles de sintaxis, lint y compilación. Verificar integración real de frontend, API y base de datos, persistencia después de reiniciar, consistencia de importes y prevención de premios duplicados. Probar el recorrido y revisar capturas en móvil y escritorio si las herramientas lo permiten. Compilar no equivale a validación visual. Informar claramente lo pendiente.

Preparar la entrega en GitHub: README para el profesor, versión de Node, lockfile, .env.example si corresponde, migración/esquema y seed demo reproducible. Ignorar node_modules, secretos, logs y bases locales de ejecución. No subir archivos privados ajenos al caso. Verificar el remoto antes de hacer push; si todavía no hay destino, terminar y validar el trabajo local antes de pedir la URL. La autorización de entrega por GitHub no autoriza desplegar el sitio en hosting.

El alcance académico incluye además una ficha de Growth de una página y una demo de tres minutos. Primero lograr que el prototipo funcione; después completar esos apoyos con los datos del contexto. No inventar tasas observadas ni presentar hipótesis como resultados.
