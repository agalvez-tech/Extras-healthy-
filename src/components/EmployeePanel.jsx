import { useState } from 'react'
import { EMPLEADOS } from '../data'

function hoyISO() {
  const d = new Date()
  const tz = new Date(d.toLocaleString('en-US', { timeZone: 'Europe/Madrid' }))
  return tz.toISOString().slice(0, 10)
}

export default function EmployeePanel({ employeeId, registros, busy, onBack, onRegistrar, onEliminar }) {
  const empleado = EMPLEADOS.find((e) => e.id === employeeId)
  const [fecha, setFecha] = useState(hoyISO())
  const [horas, setHoras] = useState('')
  const [nota, setNota] = useState('')
  const [error, setError] = useState('')

  const misRegistros = registros
    .filter((r) => r.employeeId === employeeId)
    .sort((a, b) => (a.fecha < b.fecha ? 1 : -1))
  const totalHoras = misRegistros.reduce((acc, r) => acc + r.horas, 0)

  const enviar = (e) => {
    e.preventDefault()
    setError('')
    const horasNum = Number(horas)
    if (!fecha) {
      setError('Indica la fecha.')
      return
    }
    if (!horasNum || horasNum <= 0 || horasNum > 12) {
      setError('Indica un número de horas válido (entre 0,5 y 12).')
      return
    }
    onRegistrar({ fecha, horas: horasNum, nota })
    setHoras('')
    setNota('')
  }

  return (
    <div className="screen">
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <h1 className="page-title" style={{ textAlign: 'left', margin: 0 }}>{empleado?.nombre}</h1>
        <button className="btn ghost" onClick={onBack}>← Volver</button>
      </div>

      <div className="summary-strip">
        <div className="summary-item">
          <div className="num">{totalHoras.toFixed(2)}</div>
          <div className="label">Horas extra totales</div>
        </div>
        <div className="summary-item">
          <div className="num">{misRegistros.length}</div>
          <div className="label">Registros</div>
        </div>
      </div>

      <div className="panel">
        <h3>Registrar horas extra</h3>
        <form onSubmit={enviar}>
          <div className="row">
            <div className="field" style={{ flex: 1, minWidth: 140 }}>
              <label>Fecha</label>
              <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
            </div>
            <div className="field" style={{ flex: 1, minWidth: 120 }}>
              <label>Horas</label>
              <input
                type="number"
                step="0.25"
                min="0.25"
                max="12"
                placeholder="ej. 2.5"
                value={horas}
                onChange={(e) => setHoras(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="field">
            <label>Nota (opcional)</label>
            <input
              type="text"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              placeholder="ej. cierre de sábado"
            />
          </div>
          {error && <p className="pin-error" style={{ textAlign: 'left' }}>{error}</p>}
          <button className="btn gold block" type="submit" disabled={busy}>
            Guardar horas extra
          </button>
        </form>
      </div>

      <div className="panel">
        <h3>Tu historial</h3>
        {misRegistros.length === 0 ? (
          <p className="empty-state">Todavía no has registrado horas extra.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Horas</th>
                  <th>Nota</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {misRegistros.map((r) => (
                  <tr key={r.id}>
                    <td>{formatearFecha(r.fecha)}</td>
                    <td>{r.horas.toFixed(2)} h</td>
                    <td>{r.nota || '—'}</td>
                    <td>
                      <button
                        className="link-btn"
                        disabled={busy}
                        onClick={() => {
                          if (confirm('¿Borrar este registro?')) onEliminar(r.id)
                        }}
                      >
                        Borrar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function formatearFecha(iso) {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}
