# Tueste — prototipo académico

Prototipo local full stack para recorrer el programa de referidos del caso Tueste. La API y SQLite son la fuente de verdad de pedidos, referidos, créditos, recompensas y métricas. Las compras, pagos, envíos y notificaciones son simulados: no se cobran compras ni se envían mensajes.

## Requisitos

- Node.js **24.13.0 o superior** y npm.
- La API usa el módulo integrado `node:sqlite` de Node 24 (`DatabaseSync`); no hace falta instalar SQLite como servicio. Node 24 puede mostrar la advertencia de experimental.
- No se requieren cuentas, claves API ni servicios externos.

## Instalar y ejecutar desde la raíz

```bash
npm install
npm run db:prepare
npm run dev
```

Abrí `http://localhost:5173`. Vite sirve React y reenvía `/api` a Express en `http://localhost:3001`. Para compilar, ejecutar lint e integración:

```bash
npm run check
```

También podés ejecutar cada comprobación por separado con `npm run lint`, `npm run build` y `npm run test:integration`. `npm start` inicia API e interfaz local. Los scripts de instalación, preparación, desarrollo y arranque se ejecutan desde la raíz del repositorio.

## Estructura

```text
frontend/              React, Vite, páginas y componentes
  src/app/             Rutas y composición de la aplicación
  src/pages/           Una vista por ruta
  src/components/      Navegación, visuales y estados reutilizables
  src/context/         Selección de usuario demo y carrito local
  src/hooks/           Lecturas de cuenta
  src/services/        Cliente HTTP
  src/utils/           Formato de importes y recursos
backend/               Express, reglas del negocio y SQLite
  src/routes/          Rutas HTTP
  src/controllers/     Adaptadores HTTP
  src/services/        Reglas y transacciones de pedidos
  src/repositories/    Consultas y escrituras SQLite
  src/db/              Conexión, esquema y seed reproducible
  tests/               Prueba de integración Vite → API → SQLite
docs/                  Contexto, fuentes, diseño y entregables académicos
```

El lockfile único está en la raíz. La base de ejecución se crea en `backend/data/tueste.sqlite` y está excluida de Git. El esquema está en `backend/src/db/schema.sql`; el seed agrega las cuentas demo, productos, métricas y actividad inicial sin duplicarlas.

## Acceso demo

La barra **Acceso de demostración** aparece en la interfaz e identifica estas vistas como demostración:

- **Ana · cliente:** dos amistades confirmadas, $16 de crédito y progreso 2/3.
- **Diego · panel:** embudo del caso y actividad local demo.

No hay autenticación real. Sofía y Luis son nombres de muestra; los datos se guardan localmente en SQLite.

## Recorrido sugerido (3 minutos)

1. Abrí `/cuenta/referidos` y copiá el enlace `ana-demo`, o entrá directo a `/invitacion/ana-demo`.
2. Revisá el beneficio de $8. Agregá dos bolsas y comprobá en el carrito el cálculo $34 − $8 = $26, con envío incluido.
3. En checkout, usá nombre y correo ficticios. El backend crea un pedido pendiente en SQLite.
4. En la confirmación, elegí **Simular compra confirmada**. Ana pasa de 2/3 a 3/3 y de $16 a $24 de crédito; se crea un premio único.
5. Alterná a Diego o abrí `/panel-diego` para ver embudo, métricas locales y ficha de Growth.

La vista previa de WhatsApp queda en la página y permite copiar el texto. No abre la app ni envía mensajes.

## Probar desde un celular en la misma red

1. Conectá la computadora y el celular a la misma red Wi‑Fi.
2. Averiguá la IP local de la computadora (`ipconfig` en Windows).
3. Ejecutá `npm run dev`; desde el celular abrí `http://IP-DE-LA-COMPUTADORA:5173`.
4. Si el firewall bloquea el puerto 5173, permití ese acceso en la red privada. API e interfaz usan la misma computadora.

## Datos locales y reinicio

```bash
npm run db:prepare  # conserva datos y agrega semillas faltantes
npm run db:reset    # reconstruye la base demo desde cero
```

El reset borra pedidos locales de práctica. Detené la API antes de reiniciar. `.env.example` muestra `PORT`, `HOST` y `DB_PATH`; si necesitás cambiar valores, copiá el archivo como `.env` en la raíz. Por defecto no hace falta crear `.env`.

## Rutas

`/` inicio · `/catalogo` catálogo · `/catalogo/duo` producto · `/invitacion/ana-demo` invitación · `/carrito` carrito · `/checkout` checkout · `/confirmacion/:id` confirmación · `/cuenta` cuenta · `/cuenta/pedidos` pedidos · `/cuenta/referidos` referidos · `/cuenta/recompensas` recompensas · `/cuenta/actividad` actividad · `/condiciones` condiciones · `/panel-diego` panel.

## Reglas, hipótesis y límites

- Datos del caso: dos bolsas de 340 g por $34, pack de tres por $48, suscripción mensual por $30,60 y beneficio piloto de $8 para cada lado.
- Regla demo: amistad recibe $8 en primera compra elegible de dos bolsas; quien invita obtiene $8 de crédito cuando la compra se confirma. Se bloquean autorreferidos, correos duplicados y compras no elegibles. Se pueden canjear hasta $8 en un pedido de dos bolsas, sin combinar con descuento de invitación.
- Cancelar o devolver revierte los créditos canjeados. La devolución que dejaría saldo negativo por un crédito ya gastado se bloquea; la política comercial real sigue pendiente.
- Al confirmar tres amistades compradoras se entrega un accesorio único. Su costo completo de $24 es un **supuesto pendiente de cotización**, no un costo observado.
- La meta 12% → 24% y el correo del día 6 son hipótesis/metas, no resultados. El embudo histórico viene del caso y la actividad actual de la base local.
- Los importes se calculan en centavos enteros en el backend; las restricciones SQLite e idempotencia evitan pedidos y premios duplicados al repetir solicitudes.
- El plazo de validación y la elegibilidad comercial fuera del prototipo requieren decisión. Pagos, envíos y notificaciones reales quedan fuera del alcance.

Más trazabilidad: [`docs/CONTEXTO_TUESTE.md`](docs/CONTEXTO_TUESTE.md), [`docs/FICHA_GROWTH.md`](docs/FICHA_GROWTH.md) y [`docs/GUION_DEMO.md`](docs/GUION_DEMO.md).

## Estado de validación

`npm run check` verifica ESLint, build de Vite e integración real con base temporal. La revisión visual por capturas en escritorio y móvil debe hacerse en el navegador local; el resultado de compilación por sí solo no valida la fidelidad visual.
