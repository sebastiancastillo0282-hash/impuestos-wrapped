'use client'

import { motion } from 'framer-motion'
import SlideBase from './SlideBase'
import { formatQ } from '@/lib/formatters'
import { BudgetCategory } from '@/lib/budget'
import { TaxType } from '@/lib/taxes'

const QUESTIONS: Record<TaxType, string> = {
  employee:      '¿Cuándo fue la última vez que alguien te preguntó si querías contraer esta deuda?',
  independiente: '¿Por qué la deuda que contrajeron otros la pagás vos que sí declarás y sí cumplís?',
  empresa:       '¿Cuánta de esa deuda fue a inversión que beneficia tu negocio vs. a gasto corriente?',
}

export default function DeudaSlide({ allocation, tipo }: { allocation: BudgetCategory & { amount: number }; tipo: TaxType }) {
  return (
    <SlideBase bg="#0D0404" accentColor="#EF4444" question={QUESTIONS[tipo]}>
      <div className="flex flex-col h-full">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="font-mono text-xs tracking-[0.25em] mb-4"
          style={{ color: '#EF4444', opacity: 0.65 }}
        >
          SERVICIO DE DEUDA PÚBLICA
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="font-mono text-xs mb-4"
          style={{ color: '#F2EDE4', opacity: 0.3 }}
        >
          pusiste a pagar deuda
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, type: 'spring', stiffness: 160 }}
          className="font-display leading-none"
          style={{ fontSize: 'clamp(4rem, 21vw, 8.5rem)', color: '#F2EDE4' }}
        >
          {formatQ(allocation.amount, true)}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-5 space-y-1"
        >
          <p className="font-mono text-xs" style={{ color: '#EF4444', opacity: 0.5 }}>
            deuda total: Q253,000 millones
          </p>
          <p className="font-mono text-xs" style={{ color: '#F2EDE4', opacity: 0.2 }}>
            47.9% va a gasto corriente, no a inversión
          </p>
        </motion.div>
      </div>
    </SlideBase>
  )
}
