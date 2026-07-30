const BASE = '/api/db'

async function call(method, body) {
  const res = await fetch(BASE, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || 'Error de conexión con el servidor.')
  }
  return data
}

export const api = {
  getAll: () => call('GET'),
  registrar: (employeeId, fecha, horas, nota) =>
    call('POST', { action: 'registrar', payload: { employeeId, fecha, horas, nota } }),
  eliminar: (registroId, employeeId) =>
    call('POST', { action: 'eliminar', payload: { id: registroId, employeeId } }),
}
