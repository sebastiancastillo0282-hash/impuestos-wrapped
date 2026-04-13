'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TaxType } from '@/lib/taxes'

const PROFILES = [
  {
    type: 'employee' as TaxType,
    label: 'Empleado formal',
    sublabel: 'Trabajo en relación de dependencia, con IGSS',
    icon: '👔',
  },
  {
    type: 'independiente' as TaxType,
    label: 'Independiente / Freelance',
    sublabel: 'Emito facturas, soy profesional independiente',
    icon: '💼',
  },
  {
    type: 'empresa' as TaxType,
    label: 'Empresa',
    sublabel: 'Tengo o represento una empresa, pago ISR sobre utilidades',
    icon: '🏢',
  },
]

export default function InputForm() {
  const router = useRouter()
  const [step, setStep] = useState<'profile' | 'income'>('profile')
  const [taxType, setTaxType] = useState<TaxType | null>(null)
  const [income, setIncome] = useState('')

  const handleProfileSelect = (type: TaxType) => {
    setTaxType(type)
    setStep('income')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(income.replace(/,/g, ''))
    if (!taxType || isNaN(amount) || amount <= 0) return

    const param = taxType === 'empresa' ? 'utilidad' : 'ingreso'
    router.push(`/wrapped?tipo=${taxType}&${param}=${amount}`)
  }

  const incomeLabel =
    taxType === 'empresa' ? 'utilidad neta anual (Q)' : 'ingreso bruto anual (Q)'

  if (step === 'profile') {
    return (
      <div className="space-y-4 w-full max-w-md">
        <h2 className="text-xl font-semibold text-center text-white">
          ¿Cómo describes tu situación fiscal?
        </h2>
        {PROFILES.map(p => (
          <button
            key={p.type}
            onClick={() => handleProfileSelect(p.type)}
            className="w-full flex items-start gap-4 p-4 rounded-xl bg-white/10 hover:bg-white/20 transition text-left text-white border border-white/20"
          >
            <span className="text-3xl">{p.icon}</span>
            <div>
              <div className="font-semibold">{p.label}</div>
              <div className="text-sm text-white/70">{p.sublabel}</div>
            </div>
          </button>
        ))}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
      <h2 className="text-xl font-semibold text-center text-white">
        ¿Cuál fue tu {incomeLabel} en 2024?
      </h2>
      <div>
        <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-3">
          <span className="text-white font-bold text-xl">Q</span>
          <input
            type="number"
            value={income}
            onChange={e => setIncome(e.target.value)}
            placeholder="120,000"
            min="1"
            className="flex-1 bg-transparent text-white text-xl font-bold outline-none placeholder-white/30"
            autoFocus
          />
        </div>
        <p className="text-white/50 text-sm mt-2 text-center">
          Solo se usa para calcular. No se guarda ningún dato.
        </p>
      </div>
      <button
        type="submit"
        disabled={!income || parseFloat(income) <= 0}
        className="w-full py-4 rounded-xl bg-white text-black font-bold text-lg disabled:opacity-40 hover:bg-white/90 transition"
      >
        Ver mi Wrapped →
      </button>
      <button
        type="button"
        onClick={() => setStep('profile')}
        className="w-full text-white/50 text-sm hover:text-white/80 transition"
      >
        ← Cambiar perfil
      </button>
    </form>
  )
}
