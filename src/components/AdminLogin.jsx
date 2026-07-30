import PinPad from './PinPad'
import { GERENCIA } from '../data'

export default function AdminLogin({ onBack, onSuccess }) {
  return (
    <PinPad
      eyebrow="Acceso"
      title={GERENCIA.nombre}
      subtitle="Introduce el PIN para ver el resumen de horas extra."
      correctPin={GERENCIA.pin}
      onBack={onBack}
      onSuccess={onSuccess}
    />
  )
}
