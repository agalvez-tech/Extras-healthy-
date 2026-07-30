import { EMPLEADOS } from '../data'

function nombreEmpleado(id) {
  return EMPLEADOS.find((e) => e.id === id)?.nombre || id
}

export default function AdminPanel({ registros, busy, onBack, onEliminar }) {
  const ordenados = [...registros].sort((a, b) => (a.fecha < b.fecha ? 1 : -1))
  const totalGeneral = registros.reduce((acc, r) => acc + r.horas, 0)

  return (
    <div className="screen">
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <h1 className="page-title" style={{ textAlign: 'left', margin: 0 }}>Gerencia</h1>
        <button className="btn ghost" onClick={onBack}>← Salir</button>
      </div>

      <div className="summary-strip">
        {EMPLEADOS.map((emp) => {
          const total = registros.filter((r) => r.employeeId === emp.id).reduce((acc, r) => acc + r.horas, 0)
          return (
            <div className="summary-item" key={emp.id}>
              <div className="num">{total.toFixed(2)}</div>
              <div className="label">{emp.nombre.split(' ')[0]}</div>
            </div>
          )
        })}
        <div className="summary-item">
          <div className="num">{totalGeneral.toFixed(2)}</div>
          <div className="label">Total horas extra</div>
        </div>
      </div>

      <div className="panel">
        <h3>Todos los registros</h3>
        {ordenados.length === 0 ? (
          <p className="empty-state">Todavía no hay horas extra registradas.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Empleado</th>
                  <th>Fecha</th>
                  <th>Horas</th>
                  <th>Nota</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {ordenados.map((r) => (
                  <tr key={r.id}>
                    <td>{nombreEmpleado(r.employeeId)}</td>
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
