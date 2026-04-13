'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TaxType } from '@/lib/taxes'

const PROFILES = [
  { type: 'employee' as TaxType, label: 'EMPLEADO FORMAL', sub: 'Con IGSS · relación de dependencia', icon: '👔' },
  { type: 'independiente' as TaxType, label: 'INDEPENDIENTE', sub: 'Freelance · factura propia · sin IGSS', icon: '💼' },
  { type: 'empresa' as TaxType, label: 'EMPRESA', sub: 'ISR sobre utilidades netas · 25%', icon: '🏢' },
]

export default function InputForm() {
  const router = useRouter()
  const [step, setStep] = useState<'profile' | 'income'>('profile')
  const [taxType, setTaxType] = useState<TaxType | null>(null)
  const [income, setIncome] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(income.replace(/,/g, ''))
    if (!taxType || isNaN(amount) || amount <= 0) return
    const param = taxType === 'empresa' ? 'utilidad' : 'ingreso'
    router.push(`/wrapped?tipo=${taxType}&${param}=${amount}`)
  }

  if (step === 'profile') {
    return (
      <div className="space-y-3">
        <p className="text-xs tracking-[0.2em] mb-4 opacity-40" style={{ color: 'var(--white)' }}>
          ¿CÓMO PAGÁS IMPUESTOS?
        </p>
        {PROFILES.map(p => (
          <button
            key={p.type}
            onClick={() => { setTaxType(p.type); setStep('income') }}
            className="w-full flex items-center gap-4 p-4 text-left transition-all duration-150 group"
            style={{
              border: '1px solid rgba(242,237,228,0.12)',
              background: 'rgba(242,237,228,0.03)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(232,197,71,0.5)'
              e.currentTarget.style.background = 'rgba(232,197,71,0.05)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(242,237,228,0.12)'
              e.currentTarget.style.background = 'rgba(242,237,228,0.03)'
            }}
          >
            <span className="text-2xl">{p.icon}</span>
            <div className="flex-1">
              <div className="font-display text-lg tracking-wide" style={{ color: 'var(--white)' }}>{p.label}</div>
              <div className="text-xs mt-0.5 opacity-40" style={{ color: 'var(--white)' }}>{p.sub}</div>
            </div>
            <span className="opacity-20 group-hover:opacity-60 transition-opacity" style={{ color: 'var(--yellow)' }}>→</span>
          </button>
        ))}
      </div>
    )
  }

  const isEmpresa = taxType === 'empresa'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-xs tracking-[0.2em] opacity-40" style={{ color: 'var(--white)' }}>
        {isEmpresa ? 'UTILIDAD NETA ANUAL (Q)' : 'INGRESO BRUTO ANUAL (Q)'}
      </p>
      <div className="flex items-center gap-3 pb-3" style={{ borderBottom: '1px solid rgba(242,237,228,0.2)' }}>
        <span className="font-display text-4xl" style={{ color: 'var(--yellow)' }}>Q</span>
        <input
          type="number"
          value={income}
          onChange={e => setIncome(e.target.value)}
          placeholder="120000"
          min="1"
          autoFocus
          className="flex-1 bg-transparent font-display text-4xl outline-none placeholder-opacity-20"
          style={{ color: 'var(--white)', fontFamily: 'var(--font-bebas)', caretColor: 'var(--yellow)' }}
        />
      </div>
      <p className="text-xs opacity-25" style={{ color: 'var(--white)' }}>
        Solo para calcular. No se guarda nada.
      </p>
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => setStep('profile')}
          className="px-4 py-3 text-xs tracking-widest opacity-40 hover:opacity-70 transition-opacity"
          style={{ color: 'var(--white)', border: '1px solid rgba(242,237,228,0.15)' }}
        >
          ← VOLVER
        </button>
        <button
          type="submit"
          disabled={!income || parseFloat(income) <= 0}
          className="flex-1 py-3 font-display text-lg tracking-wider transition-all duration-150 disabled:opacity-20"
          style={{
            background: 'var(--yellow)',
            color: 'var(--black)',
            letterSpacing: '0.1em',
          }}
        >
          CALCULÁ TU WRAPPED →
        </button>
      </div>
    </form>
  )
}
