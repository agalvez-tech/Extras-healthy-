# HealthyMeat · Horas extra

App muy sencilla para que Mónica, Vicente (Vicente Alcover Biot) y Marcelo registren
sus horas extra. Nada más: sin vacaciones, sin pausas, sin varias empresas.

## Qué incluye

- Cada uno elige su nombre → pone su PIN (el mismo que ya usan en la app de
  fichajes) → registra una fecha, el número de horas y una nota opcional.
- Cada uno ve su propio historial y el total de horas extra acumuladas, y puede
  borrar un registro si se equivocó.
- Gerencia entra con su PIN y ve todos los registros de los tres, con el total de
  cada uno y el total general. También puede borrar un registro desde ahí.

No hay aprobación de por medio: en cuanto alguien registra sus horas, ya se ve en
el resumen de gerencia. Si más adelante quieres que gerencia tenga que aprobarlas
(como en la app de fichajes), dímelo y lo añado.

## 1. Antes de publicarla

Abre `src/data.js` si quieres cambiar algo:

- **PIN de cada empleado**: por defecto son los mismos que ya tienen en la app de
  fichajes (últimas 4 cifras de su DNI). Cámbialos si quieres.
- **PIN de gerencia**: `2026` de ejemplo, cámbialo por el que prefieras.

## 2. Publicar la app (sin usar la terminal)

1. Crea un **repositorio nuevo** en GitHub (distinto al de la app de fichajes) y
   sube esta carpeta completa.
2. En [vercel.com](https://vercel.com) → **Add New → Project** → importa ese
   repositorio.
3. Antes de darle a Deploy, ve a **Settings → Environment Variables** (una vez
   creado el proyecto) y añade a mano las mismas dos variables que ya tienes en tu
   app de fichajes (o en cualquier otra tuya con Redis):
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

   Puedes copiarlas literalmente de ese otro proyecto (Settings → Environment
   Variables → icono del ojo para revelar el valor → copiar). No hace falta crear
   una base de datos nueva: esta app guarda sus datos bajo su propia "carpeta"
   (`healthymeat:horasextra:db`), así que no se mezcla con nada de la otra app.
4. Dale a **Deploy**.
5. Si añadiste las variables después del primer deploy, ve a **Deployments** → tres
   puntos del último → **Redeploy**.

## 3. Comprobar que la base de datos está conectada

Abre en el navegador `https://tu-dominio.vercel.app/api/db` — si ves un JSON como
`{"registros":[]}` (o con datos dentro), está todo conectado. Si ves un mensaje de
error explicando qué variable falta, sigue las instrucciones de ese mismo mensaje.
