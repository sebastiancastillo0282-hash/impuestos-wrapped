'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TaxType } from '@/lib/taxes'

const PROFILES = [
  {
    type: 'employee' as TaxType,
    label: 'EMPLEADO FORMAL',
    sub: 'relación de dependencia · con IGSS',
  },
  {
    type: 'independiente' as TaxType,
    label: 'INDEPENDIENTE',
    sub: 'factura propia · sin IGSS · freelance',
  },
  {
    type: 'empresa' as TaxType,
    label: 'EMPRESA',
    sub: 'ISR sobre utilidades netas · 25%',
  },
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
      <div className="space-y-2">
        <p className="font-mono text-xs tracking-[0.2em] mb-5" style={{ color: 'var(--white)', opacity: 0.3 }}>
          ¿CÓMO PAGÁS IMPUESTOS?
        </p>
        {PROFILES.map((p, i) => (
          <button
            key={p.type}
            onClick={() => { setTaxType(p.type); setStep('income') }}
            className="w-full flex items-center justify-between p-4 text-left transition-all duration-150"
            style={{
              border: '1px solid rgba(242,237,228,0.1)',
              background: 'transparent',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(232,197,71,0.4)'
              e.currentTarget.style.background = 'rgba(232,197,71,0.04)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(242,237,228,0.1)'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <div>
              <div className="font-display text-xl" style={{ color: 'var(--white)' }}>{p.label}</div>
              <div className="font-mono text-xs mt-0.5" style={{ color: 'var(--white)', opacity: 0.3 }}>{p.sub}</div>
            </div>
            <span className="font-mono text-xs" style={{ color: 'var(--yellow)', opacity: 0.35 }}>→</span>
          </button>
        ))}
      </div>
    )
  }

  const isEmpresa = taxType === 'empresa'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <p className="font-mono text-xs tracking-[0.2em]" style={{ color: 'var(--white)', opacity: 0.3 }}>
        {isEmpresa ? 'UTILIDAD NETA ANUAL (Q)' : 'INGRESO BRUTO ANUAL (Q)'}
      </p>
      <div className="flex items-center gap-3 pb-3" style={{ borderBottom: '1px solid rgba(242,237,228,0.15)' }}>
        <span className="font-display text-4xl" style={{ color: 'var(--yellow)' }}>Q</span>
        <input
          type="number"
          value={income}
          onChange={e => setIncome(e.target.value)}
          placeholder="120000"
          min="1"
          autoFocus
          className="flex-1 bg-transparent font-display text-4xl outline-none"
          style={{ color: 'var(--white)', caretColor: 'var(--yellow)' }}
        />
      </div>
      <p className="font-mono text-xs" style={{ color: 'var(--white)', opacity: 0.2 }}>
        Solo para calcular. No se guarda nada.
      </p>
      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={() => setStep('profile')}
          className="px-4 py-3 font-mono text-xs tracking-widest transition-opacity"
          style={{ color: 'var(--white)', opacity: 0.35, border: '1px solid rgba(242,237,228,0.12)' }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '0.35')}
        >
          ← VOLVER
        </button>
        <button
          type="submit"
          disabled={!income || parseFloat(income) <= 0}
          className="flex-1 py-3 font-display text-xl tracking-wider transition-opacity disabled:opacity-20"
          style={{ background: 'var(--yellow)', color: 'var(--black)' }}
        >
          CALCULÁ TU WRAPPED →
        </button>
      </div>
    </form>
  )
}
