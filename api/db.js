import { Redis } from '@upstash/redis'

// Clave propia y distinta a la de la app de fichajes, aunque compartan la misma
// base de datos Redis: así no se mezclan ni se pisan los datos.
const DB_KEY = 'healthymeat:horasextra:db'

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
  if (!url || !token) {
    const candidatas = Object.keys(process.env).filter((k) => /REDIS|KV_|UPSTASH/i.test(k))
    const detalle =
      candidatas.length > 0
        ? `Variables encontradas con nombres parecidos: ${candidatas.join(', ')}.`
        : 'No encuentro ninguna variable con "REDIS", "KV_" o "UPSTASH" en el nombre en este entorno.'
    throw new Error(
      `Falta conectar la base de datos: no encuentro UPSTASH_REDIS_REST_URL/TOKEN ni KV_REST_API_URL/TOKEN. ${detalle} Ve a Storage → conecta la base de datos Redis a este proyecto (puede ser la misma que ya usas en otra app) → y vuelve a hacer Redeploy.`
    )
  }
  return new Redis({ url, token })
}

const emptyDb = () => ({ registros: [] })

async function loadDb(redis) {
  const data = await redis.get(DB_KEY)
  if (!data) return emptyDb()
  if (typeof data === 'string') {
    try {
      return JSON.parse(data)
    } catch {
      return emptyDb()
    }
  }
  return data
}

async function saveDb(redis, db) {
  await redis.set(DB_KEY, JSON.stringify(db))
}

function hoyISO() {
  const d = new Date()
  const tz = new Date(d.toLocaleString('en-US', { timeZone: 'Europe/Madrid' }))
  return tz.toISOString().slice(0, 10)
}

function id() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    const redis = getRedis()

    if (req.method === 'GET') {
      const db = await loadDb(redis)
      return res.status(200).json(db)
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Método no permitido' })
    }

    const { action, payload } = req.body || {}
    const db = await loadDb(redis)

    switch (action) {
      case 'registrar': {
        const { employeeId, fecha, horas, nota } = payload
        const horasNum = Number(horas)
        if (!fecha) {
          return res.status(400).json({ error: 'Indica la fecha.' })
        }
        if (!horasNum || horasNum <= 0 || horasNum > 12) {
          return res.status(400).json({ error: 'Indica un número de horas válido (entre 0,5 y 12).' })
        }
        const registro = {
          id: id(),
          employeeId,
          fecha,
          horas: Math.round(horasNum * 4) / 4, // redondeo a cuartos de hora
          nota: nota || '',
          registradoEl: hoyISO(),
        }
        db.registros.push(registro)
        await saveDb(redis, db)
        return res.status(200).json({ ok: true, registro })
      }

      case 'eliminar': {
        const { id: registroId, employeeId } = payload
        const antes = db.registros.length
        db.registros = db.registros.filter(
          (r) => !(r.id === registroId && (employeeId ? r.employeeId === employeeId : true))
        )
        if (db.registros.length === antes) {
          return res.status(404).json({ error: 'No se encontró ese registro.' })
        }
        await saveDb(redis, db)
        return res.status(200).json({ ok: true })
      }

      default:
        return res.status(400).json({ error: 'Acción no reconocida.' })
    }
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: err.message || 'Error interno.', detail: String(err) })
  }
}
