import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from './api'
import Home from './components/Home'
import EmployeeLogin from './components/EmployeeLogin'
import EmployeePanel from './components/EmployeePanel'
import AdminLogin from './components/AdminLogin'
import AdminPanel from './components/AdminPanel'
import Toast from './components/Toast'

export default function App() {
  const [screen, setScreen] = useState('home') // home | employee-pin | employee | admin-login | admin
  const [employeeId, setEmployeeId] = useState(null)
  const [registros, setRegistros] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  const showToast = useCallback((message, type = 'ok') => {
    setToast({ message, type })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 3200)
  }, [])

  const refresh = useCallback(async () => {
    try {
      const data = await api.getAll()
      setRegistros(data.registros || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
    const t = setInterval(refresh, 20000)
    return () => clearInterval(t)
  }, [refresh])

  const registrar = async ({ fecha, horas, nota }) => {
    setBusy(true)
    try {
      await api.registrar(employeeId, fecha, horas, nota)
      await refresh()
      showToast('Horas extra guardadas.')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  const eliminar = async (registroId, restringidoAlPropio = false) => {
    setBusy(true)
    try {
      await api.eliminar(registroId, restringidoAlPropio ? employeeId : undefined)
      await refresh()
      showToast('Registro borrado.')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return (
      <div className="app-shell">
        <Header />
        <div className="screen">
          <p className="empty-state">Cargando…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <Header />

      {screen === 'home' && (
        <Home
          onSelectEmployee={(id) => {
            setEmployeeId(id)
            setScreen('employee-pin')
          }}
          onGerencia={() => setScreen('admin-login')}
        />
      )}

      {screen === 'employee-pin' && (
        <EmployeeLogin
          employeeId={employeeId}
          onBack={() => setScreen('home')}
          onSuccess={() => setScreen('employee')}
        />
      )}

      {screen === 'employee' && (
        <EmployeePanel
          employeeId={employeeId}
          registros={registros}
          busy={busy}
          onBack={() => setScreen('home')}
          onRegistrar={registrar}
          onEliminar={(id) => eliminar(id, true)}
        />
      )}

      {screen === 'admin-login' && (
        <AdminLogin onBack={() => setScreen('home')} onSuccess={() => setScreen('admin')} />
      )}

      {screen === 'admin' && (
        <AdminPanel
          registros={registros}
          busy={busy}
          onBack={() => setScreen('home')}
          onEliminar={(id) => eliminar(id, false)}
        />
      )}

      <Toast message={toast?.message} type={toast?.type} />
    </div>
  )
}

function Header() {
  return (
    <div className="topbar">
      <img src="/logo.jpg" alt="HealthyMeat" />
      <div className="brand-text">
        <span className="k">HEALTHYMEAT</span>
        <span className="sub">Horas extra</span>
      </div>
      <div className="spacer" />
    </div>
  )
}
