# Tueste — prototipo académico

Prototipo local full stack para recorrer el programa de referidos del caso Tueste. Las compras son demostraciones: no se cobran, no se despachan productos y no se envían mensajes.

## Requisitos

- Node.js **24.13.0 o superior** y npm.
- No hace falta instalar SQLite como servicio. El servidor utiliza `node:sqlite` de Node y crea el archivo local al preparar los datos.
- No se requieren cuentas, claves API ni servicios externos.
- `.env.example` documenta las opciones locales (`PORT`, `HOST` y `DB_PATH`). Si ocupás cambiarlas, copiá ese archivo a `.env`; por defecto no necesitás crear uno.

## Instalación y arranque

En la raíz del proyecto:

```bash
npm install
npm run db:prepare
npm run dev
```

Abrí `http://localhost:5173`. La API corre en `http://localhost:3001`; Vite redirige `/api` durante el desarrollo. Para compilar y arrancar en modo de revisión local:

```bash
npm run check
npm run test:smoke
npm start
```

`npm run check` ejecuta ESLint y la compilación Vite. `npm run test:smoke` verifica API, proxy Vite, validación de negocio e idempotencia con una base temporal. El servidor usa el host `0.0.0.0` para permitir la prueba dentro de la red local.

## Acceso de demostración

La barra superior **Acceso de demostración** permite alternar:

- **Ana · cliente**: cuenta con dos amistades de ejemplo que ya compraron, $16 de crédito y progreso 2/3.
- **Diego · panel**: tablero con los datos del embudo del caso y métricas locales de la demo.

No hay contraseñas ni autenticación real. Sofía y Luis son nombres de muestra.

## Recorrido sugerido (3 minutos)

1. En `/cuenta/referidos`, copiá el enlace `ana-demo` o abrí `/invitacion/ana-demo`.
2. La amistad ve aplicado el descuento; agregá las dos bolsas y abrí el carrito ($34 − $8 = $26, envío incluido).
3. En checkout, usá un nombre y correo ficticios. Se crea un pedido pendiente en SQLite.
4. En la confirmación, elegí **Simular compra confirmada**. El pedido se confirma y el crédito de Ana sube $8; con la tercera compra se crea un único premio.
5. Alterná a Diego en la barra de demo o abrí `/panel-diego` para revisar el embudo y supuestos.

La vista previa de WhatsApp muestra el texto dentro de la aplicación local y permite copiarlo; no abre WhatsApp ni envía mensajes.

## Probar desde un celular en la misma red

1. Conectá computadora y celular a la misma red Wi-Fi.
2. Averiguá la IP local de la computadora (por ejemplo, `ipconfig` en Windows).
3. Ejecutá `npm run dev` y desde el teléfono abrí `http://IP-DE-LA-COMPUTADORA:5173`.
4. Si el firewall de la computadora bloquea el puerto 5173, permití ese acceso en la red privada. La API y la interfaz usan el mismo equipo.

## Base de datos y reinicio

SQLite se crea como `data/tueste.sqlite` (ignorado por Git). El esquema está en `server/src/schema.sql`. El seed es reproducible e inserta usuarios de demo y actividad base sin duplicarlos.

```bash
npm run db:prepare  # prepara esquema y agrega datos demo que falten
npm run db:reset    # reinicia por completo y reconstruye la demo
```

Al resetear se borran todos los pedidos locales que se hayan creado durante la práctica. Detené primero el servidor para evitar conexiones abiertas.

## Rutas principales

`/` inicio · `/catalogo` catálogo · `/catalogo/duo` producto · `/invitacion/ana-demo` invitación · `/carrito` carrito · `/checkout` checkout · `/confirmacion/:id` confirmación · `/cuenta` cuenta · `/cuenta/pedidos` pedidos · `/cuenta/referidos` programa · `/cuenta/recompensas` premios · `/cuenta/actividad` actividad · `/condiciones` reglas · `/panel-diego` panel.

## Reglas y trazabilidad

- Del caso: dos bolsas de 340 g cuestan $34; pack de tres $48; suscripción mensual $30,60; beneficio de piloto de $8 para cada lado.
- Decisión del equipo para el prototipo: descuento de $8 limitado al producto de dos bolsas en la primera compra elegible; $8 de crédito para quien invita tras confirmarse. Se impide el autorreferido y el segundo referido del mismo correo.
- Canje en este prototipo: se pueden reservar hasta $8 de crédito en un pedido de dos bolsas; no se combina con el descuento de invitación. La reserva se confirma con el pedido y se revierte al cancelarlo o devolverlo. Es una regla de demostración, no una política comercial; el tratamiento de crédito ya usado ante una devolución queda pendiente. Si la devolución haría negativo el saldo por crédito de invitación ya gastado, la demo la bloquea y explica la decisión pendiente.
- Propuesta: premio único de accesorio al tercer referido confirmado. Los $24 son un **costo supuesto pendiente de cotización**, no costo observado.
- La meta 12% → 24% y el correo al día 6 son hipótesis/metas de planificación, no resultados. El embudo del panel proviene del caso; los pedidos actuales de la demo provienen de SQLite local.
- Los importes se guardan como centavos enteros. Precios y beneficio se calculan y validan en el servidor. La llave de idempotencia evita crear el mismo pedido al reintentar.
- Pendiente de decisión comercial: plazo de validación, elegibilidad fuera del prototipo y tratamiento de créditos canjeados ante una devolución. El pago y envío reales quedan fuera del alcance.

Más trazabilidad: [`docs/CONTEXTO_TUESTE.md`](docs/CONTEXTO_TUESTE.md), [`docs/FICHA_GROWTH.md`](docs/FICHA_GROWTH.md) y [`docs/GUION_DEMO.md`](docs/GUION_DEMO.md).
