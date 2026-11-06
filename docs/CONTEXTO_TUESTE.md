# Contexto portátil — Tueste

## Objetivo

### Decisión vigente de entrega y arquitectura

Sebastián eligió frontend y backend reales entregados como un repositorio normal de GitHub. No se desplegará en Vercel, Sites ni Supabase. La revisión será por ejecución local documentada: frontend React/Vite, API Node/Express y SQLite, con datos demo y scripts sencillos de instalación, preparación y arranque. La compra sigue siendo simulada; la persistencia y reglas de negocio deben funcionar en el backend. El estado de negocio no puede depender solo del navegador. Esta decisión reemplaza las alternativas previas de frontend únicamente o alojamiento en la nube. El profesor necesitará descargar o clonar el repositorio y ejecutarlo con Node; GitHub almacena el proyecto, no sustituye su ejecución.

Proyecto académico de Mercadeo/Growth de Sebastián. El profesor dirige la clase y la IA acompaña. Caso ficticio; cifras en USD. El usuario pidió analizar antes de construir y ya revisó los requisitos, cálculos, recompensas y propuesta visual. Autorizó pasar a implementación y retiró expresamente el límite anterior de las 12:00 porque todavía no está habilitado el espacio de entrega. Completar el trabajo y verificarlo sin recortes motivados por esa hora. No necesita otra ronda de investigación o generación de imágenes.

Los PNG de `diseno/` fueron aprobados como dirección visual. Ilustran el inicio de escritorio y celular, la cuenta de referidos, invitación recibida y carrito. Las otras pantallas deben extender ese sistema; no están todas diseñadas en imágenes. Usar la solución más sencilla consistente con el caso, anotando decisiones pendientes.

## Entregables del profesor

1. Prototipo móvil funcional de punta a punta, con datos del caso y simulaciones identificadas.
2. Ficha Growth de una página: ciclo, abandono principal, meta numérica e impacto, métrica semanal, matriz de canales de 90 días, experimento con métrica y contramétrica, recompensas con costos y un error concreto de la IA.
3. Demostración en vivo de tres minutos: problema, recorrido, número que busca mover y respuesta si falla el experimento.

Rúbrica: criterio de growth 30; experiencia 25; funciona 20; medición y plata 15; uso de IA 10. El diseño precede la construcción. Las reglas completas están en la Parte 2 del caso, páginas 4–7.

## Continuación de la Parte 1

Entrega anterior en https://docs.google.com/spreadsheets/d/1QLX-Z5aPnScsLQv8ZLhkdxr9Pv39mluuUvkhC-fVbZ8/edit . Fue leída en este chat mediante el conector de Google Sheets.

Recomendación presentada: rechazar $16.000 de Meta con 30% de descuento; reducir publicidad temporalmente a $4.000 y ofrecer tres bolsas por $48. La adopción del pack del 30% es una hipótesis, no un resultado observado. La Parte 2 confirma que Diego redujo Meta a $4.000; no confirma adopción del pack.

CAC real actual: ($4.000 + $1.000 de agencia) / 100 nuevos clientes de Meta = $50. Regla de Diego: todas las recompensas por cada nuevo referido cuestan como máximo la mitad, $25. Ese límite no incluye automáticamente todos los costos operativos ni garantiza rentabilidad.

## Datos reales del enunciado

- Pedido estándar: dos bolsas de 340 g, $34. Pack de tres: $48. Suscripción: dos bolsas mensuales, $30,60.
- Costos pedido estándar: café $10,88, envío $4,50, caja $1,20, pasarela 4,5% de lo pagado.
- Un pedido de $34 deja $15,89 de contribución.
- El café tarda tres días en llegar; hoy el correo de referidos llega al día siguiente de pagar.
- 82% de visitas desde celular. 6% publica foto espontánea, principalmente al recibir el paquete.
- 30% de clientes de pedidos sueltos recompra en 90 días. Churn mensual de suscriptores: 9%; motivo frecuente: café acumulado.
- Piloto actual: $8 de descuento para amistad y $8 de crédito para quien invita.
- Embudo por 1.000 clientes iniciales: 350 abren correo; 120 entran al programa; 100 invitan y mandan 300 invitaciones; 150 amistades abren tienda; 60 compran. Son dos poblaciones: clientes que invitan y amistades invitadas. No contar invitaciones como compradores.
- Tasas: 35% abre; 120/350=34,29% llega al programa desde aperturas; 100/120=83,33% invita; 150/300=50% abre tienda; 60/150=40% compra. Solo 12% de clientes iniciales ve el programa; se generan seis compradores referidos por cada 100 iniciales, K=0,06.

## Decisiones propuestas para el prototipo

Mantener $8 de primera compra para amistad y $8 de crédito para quien invita por compra válida. El crédito puede acumularse, pero se utilizan hasta $8 por pedido elegible. Son reglas propuestas del equipo, no condiciones textuales originales. Referido válido: cliente nuevo con enlace personal y primera compra validada; no autorreferidos ni duplicados. Cancelaciones y devoluciones no consolidan premios. No inventar un plazo comercial definitivo de validación.

Regla de implementación de esta demo: el beneficio de amistad se restringe a dos bolsas; el crédito también se puede canjear hasta $8 en ese producto, reservado en pedidos pendientes y sin combinar ambos beneficios. Cancelar o devolver un pedido de demo restaura el crédito canjeado. Esta simulación no resuelve la política comercial ante una devolución; una devolución que dejaría negativo el saldo por un crédito de invitación ya usado queda bloqueada hasta definir esa política.

Nivel de tres amistades compradoras: accesorio único, una sola vez, con costo completo SUPUESTO de $24, sujeto a cotización. El premio conceptual de los PNG no es una elección de proveedor ni una cotización. Se entregaría en el próximo pedido regular y se incluye todo costo incremental dentro del presupuesto. No regalar más café a quien ya acumula.

Costos acumulados presupuestados con canje del 100%: 1 referido=$16; 2=$32; 3=$72; 4=$88; 6=$120. Por referido: $16, $16, $24, $22, $20. No asumir un costo promedio poblacional sin conocer cuántos usuarios alcanzan tres. No acumular otros premios no calculados.

Con $8 de descuento, un pedido estándar cobra $26 y deja $8,25 de contribución. Reservando crédito de $8 y parte proporcional de accesorio de $8, el saldo económico inicial conservador es −$7,75 por referido al completar un grupo de tres. No llamarlo salida inmediata de caja: el crédito y el accesorio tienen tiempos de canje/entrega distintos. No afirmar que se recupera sin observar recompra. El LTV específico de referidos es desconocido.

## Experimento y plan

Propuesta A/B: asignar clientes aleatoriamente, correo al día 1 frente a día 6 después del pago. Mismas pantallas y recompensas en ambos grupos. Día 6 es hipótesis; no demuestra que ya probaron el café. Observar 21 días desde la compra inicial.

Principal: personas que visitan programa / todos los clientes asignados al grupo. Contramétrica: bajas de comunicaciones / asignados. Resultado adicional: compras referidas por cada 100 asignados. Meta de planificación: ver programa del 12% histórico al 24%; no es una tasa observada ni un benchmark. Si el resto de tasas se mantiene, se pasa de 6 a 12 nuevos compradores referidos por cada 100; esta proyección condicional no equivale al resultado del A/B. Comparar grupos simultáneos y reconocer limitaciones de muestra.

Matriz de canales a 90 días como propuesta: Meta $4.000/mes en siempre activo con seguimiento de CAC/caja; referidos en probar; contenido educativo en largo plazo; canales pagados adicionales sin validar en descartar por ahora. Las asignaciones son decisiones del equipo, no datos del enunciado. Meta conserva su función; no prometer sustitución completa.

## Pantallas y demostración

Rutas independientes para inicio, catálogo, producto, invitación por enlace, carrito, checkout simulado, confirmación, cuenta/pedidos, mis referidos, recompensas/condiciones, actividad y panel de Diego. El enlace de la amistad entra directamente al beneficio, sin exigir navegar por inicio ni copiar un código.

Ejemplo visual: cuenta con dos compras confirmadas (Sofía y Luis, nombres simulados), $16 de crédito y avance 2/3. Al confirmar una tercera compra simulada, actualizar coherentemente crédito a $24, avance 3/3 y premio disponible. Mantener todos los totales consistentes. El carrito referido del pedido estándar: $34 − $8, envío incluido, total $26.

Estado inicial vacío, enlace inválido, compra pendiente/confirmada/cancelada, premio bloqueado/disponible, error y confirmación deben tener salidas comprensibles. No inventar éxito ni datos en vivo. Los precios del panel son costos internos y no van en el flujo comercial del cliente.

Demo sugerida: 0:00–0:30 problema (88% no ve el programa); 0:30–2:15 mostrar compartir, beneficio, compra simulada y progreso; 2:15–2:45 panel/costos/experimento; 2:45–3:00 qué revisar si no mejora o cuesta demasiado.

Business Problem Solver v1.0.1 y Octalysis ya se utilizaron como apoyo. Octalysis es opcional: compartir con una amistad, avance comprensible y recompensa útil. No presupone que los puntos o niveles por sí solos generen ventas. Se descartó agregar un sistema separado de puntos por compra para no ampliar el alcance.
