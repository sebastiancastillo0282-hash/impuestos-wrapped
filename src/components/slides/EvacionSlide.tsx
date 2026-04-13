'use client'

import { motion } from 'framer-motion'
import SlideBase from './SlideBase'
import { TaxType } from '@/lib/taxes'

const QUESTIONS: Record<TaxType, string> = {
  employee:      '¿Por qué vos pagás puntual y el servicio público sigue exactamente igual?',
  independiente: '¿Por qué el que opera informal paga menos impuestos que vos que sí facturás?',
  empresa:       '¿Cuánto de tu competencia está entre ese 70% que no pagó ISR este año?',
}

export default function EvacionSlide({ tipo }: { tipo: TaxType }) {
  return (
    <SlideBase bg="#080808" accentColor="#EF4444" question={QUESTIONS[tipo]}>
      <div className="flex flex-col h-full">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="font-mono text-xs tracking-[0.25em] mb-4"
          style={{ color: '#F2EDE4', opacity: 0.35 }}
        >
          MIENTRAS VOS PAGABAS
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="font-mono text-xs mb-3"
          style={{ color: '#F2EDE4', opacity: 0.3 }}
        >
          se evadieron en IVA e ISR (2023):
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, type: 'spring', stiffness: 160 }}
          className="font-display leading-none"
          style={{ fontSize: 'clamp(4rem, 21vw, 8.5rem)', color: '#EF4444' }}
        >
          Q45,189M
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-5 space-y-1"
        >
          <p className="font-mono text-xs" style={{ color: '#EF4444', opacity: 0.5 }}>
            ISR: Q30,618M (incumplimiento 70.1%)
          </p>
          <p className="font-mono text-xs" style={{ color: '#EF4444', opacity: 0.35 }}>
            IVA: Q14,571M (incumplimiento 24.8%)
          </p>
          <p className="font-mono text-xs mt-2" style={{ color: '#F2EDE4', opacity: 0.2 }}>
            fuente: SAT, julio 2024 · equivale a 3 presupuestos de salud
          </p>
        </motion.div>
      </div>
    </SlideBase>
  )
}
