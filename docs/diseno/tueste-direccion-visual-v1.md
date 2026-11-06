# Tueste — dirección visual propuesta

Estado: Sebastián aprobó esta dirección visual y pidió comenzar la implementación. Retiró el límite anterior de las 12:00; completar el alcance y las comprobaciones sin recortes por esa hora. Los PNG son referencias aprobadas; el prototipo todavía debe construirse. Completar las vistas faltantes siguiendo este sistema, sin otra ronda de generación de imágenes.

## Qué se entrega

- `tueste-logo-propuesta-v1.png`: propuesta del logo en un fondo oscuro opaco. Para producción deberá prepararse el formato limpio y escalable apropiado una vez elegida la identidad.
- `tueste-inicio-desktop-movil-v1.png`: referencia visual de inicio en escritorio y celular.
- `tueste-referidos-movil-v1.png`: referencia visual del recorrido principal de referidos en celular.
- `tueste-prompts-imagenes-v1.json`: instrucciones exactas usadas para generar los conceptos con la herramienta integrada ImageGen.

Las imágenes de producto y los empaques son conceptuales, generados para el caso académico. No son fotografías de productos comerciales existentes de Tueste. Los mockups son objetivos visuales para conversar sobre el diseño; no acreditan funcionamiento.

## Dirección y criterios de diseño

La experiencia se centra en el ritual del café y en compartir un descubrimiento. El logo propone un grano dividido en dos partes complementarias, junto a un nombre de formas redondeadas y legibles. Tueste tiene una identidad propia de café.

La guía principal es `diseno-frontend-sebastian` revisada en el repositorio `sebassebitas12/vertice-cr`, commit `cc097261e61de733b81ff1d9e5bc992a6fa4146f`. Se aplican su arquitectura multipágina, portada curada, equilibrio aproximado 70/30 entre contenido libre y tarjetas, superficies mates, curvas y jerarquía. Las reglas de fabricación, visores CAD y ejemplos industriales pertenecen a Vértice y no se trasladan al caso de café.

Objetivo tipográfico para la implementación: Bitter en títulos y DM Sans en texto e interfaz. El wordmark es una propuesta gráfica propia. La imagen generada puede aproximar las fuentes; no constituye una extracción exacta de sus métricas.

| Token propuesto | Valor |
| --- | --- |
| Fondo | `#1A1917` |
| Superficie | `#25231F` |
| Superficie elevada | `#302D27` |
| Texto principal | `#F5F0E7` |
| Texto secundario | `#C0B7A9` |
| Acento | `#D6B67B` |
| Texto sobre acento | `#211B11` |
| Curvas de controles y superficies | 16–24 px según componente |
| Margen lateral móvil | 18–22 px |
| Objetivo táctil | al menos 44 × 44 px |

Usar componentes compartidos, espaciado coherente, foco visible y movimiento reducido. El contraste y el comportamiento responsive requieren validación en la implementación: una imagen no los comprueba.

## Verdad de producto que el diseño debe conservar

Datos del caso: dos bolsas de 340 g cuestan $34; el pack de tres cuesta $48; la suscripción de dos bolsas al mes cuesta $30,60. No asumir que el pack tiene la adopción del 30% planteada en la entrega anterior: era una hipótesis.

El programa actual ofrece $8 a la amistad y $8 a quien invita. La propuesta del equipo conserva esos beneficios y añade un accesorio único al alcanzar tres amistades compradoras. El accesorio tiene un costo completo SUPUESTO de $24, sujeto a cotización; no es su precio de venta ni un costo observado. Con tres referidos, el presupuesto de recompensas es ($48 + $24) / 3 = $24 por referido. No equivale al costo total de operar el programa ni garantiza rentabilidad.

Reglas propuestas, no datos originales del caso: permitir saldo de crédito acumulado con uso máximo de $8 por pedido; validar pedidos antes de consolidar beneficios; excluir autorreferidos y duplicados; adjuntar el accesorio al próximo pedido regular considerando todos los costos incrementales. Plazo de validación, elegibilidad exacta y tratamiento de crédito ya canjeado en una devolución siguen pendientes de definición.

Toda compra, persona, notificación y resultado de demostración debe identificarse como simulado. No realizar cobros, enviar mensajes reales ni solicitar datos bancarios para la práctica.

## Cobertura de pantallas pendiente de completar en imágenes

1. Inicio: composición editorial, selección de productos, navegación real al catálogo y programa.
2. Catálogo: opciones del caso; no inventar variantes, existencias o disponibilidad.
3. Producto: detalle, cantidad, precio y acción de compra.
4. Invitación recibida: identidad de quien invita y beneficio aplicado sin código manual.
5. Carrito: productos, beneficio, envío y total coherentes.
6. Finalizar compra: datos mínimos y simulación explícita.
7. Confirmación: resultado del pedido y siguiente paso.
8. Mi cuenta y pedidos: seguimiento y saldo.
9. Mis referidos: compartir y progreso por compras confirmadas.
10. Recompensas y condiciones: costos internos fuera del flujo del cliente, condiciones claras y premio identificado como propuesta cuando corresponda.
11. Actividad: invitaciones y compras diferenciadas; pendientes, confirmadas y anuladas.
12. Panel de Diego: embudo y costos con denominadores y fuente claros.

Las referencias iniciales no cubren todavía cada pantalla ni sus estados. Después de elegir esta dirección, completar las imágenes y estados vacíos, de carga, de error, devolución y enlace inválido. No presentar una imagen conceptual como si fuera el prototipo funcional.

## Paso a implementación

Al continuar en Codex de Visual Studio Code, abrir un proyecto independiente de Tueste y entregar las imágenes elegidas, este brief y los PDFs originales de Tueste Partes 1 y 2. Leer primero el contexto y las instrucciones del proyecto; no depender de que el nuevo chat herede esta conversación. Las decisiones y fuentes deben quedar disponibles en `docs/`.

Implementar rutas independientes, componentes compartidos y datos simulados coherentes. Comparar capturas a 390, 768 y 1440 px con las imágenes objetivo. Verificar sintaxis, lint, compilación y recorridos aplicables. La aprobación visual requiere inspeccionar el resultado, además de comprobar el código.

El entregable académico final incluye prototipo móvil funcional, ficha de Growth de una página y demostración de tres minutos. Las imágenes de diseño no sustituyen esos entregables.
