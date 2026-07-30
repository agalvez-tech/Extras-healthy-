import { EMPLEADOS } from '../data'

export default function Home({ onSelectEmployee, onGerencia }) {
  return (
    <div className="screen">
      <div style={{ textAlign: 'center', margin: '4px 0 24px' }}>
        <img
          src="/logo.jpg"
          alt="HealthyMeat"
          style={{ width: 92, height: 92, borderRadius: '50%', border: '1px solid var(--line)', objectFit: 'cover' }}
        />
      </div>
      <h1 className="page-title">Horas extra</h1>
      <p className="page-subtitle">Elige tu nombre para registrar tus horas extra.</p>

      <div className="card-grid">
        {EMPLEADOS.map((emp) => (
          <button key={emp.id} className="card" onClick={() => onSelectEmployee(emp.id)}>
            <div className="title">{emp.nombre}</div>
          </button>
        ))}
      </div>

      <div style={{ marginTop: 40, textAlign: 'center' }}>
        <button className="link-btn" onClick={onGerencia}>Acceso gerencia</button>
      </div>
    </div>
  )
}
