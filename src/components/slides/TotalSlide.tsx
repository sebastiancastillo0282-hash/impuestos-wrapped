'use client'

import { motion } from 'framer-motion'
import SlideBase from './SlideBase'
import { formatQ } from '@/lib/formatters'
import { TaxResult, TaxType } from '@/lib/taxes'

const LABELS: Record<string, string> = {
  employee: 'EMPLEADO FORMAL',
  independiente: 'INDEPENDIENTE',
  empresa: 'EMPRESA',
}

const QUESTIONS: Record<string, string> = {
  employee: '¿Sabías que ese dinero salió antes de que llegara a tu cuenta bancaria?',
  independiente: '¿Por qué pagás como empresa sin tener ninguna de las prestaciones de un empleado?',
  empresa: '¿Cuánto de tu competencia compite en tu mismo mercado sin pagar este mismo monto?',
}

export default function TotalSlide({ taxResult, tipo }: { taxResult: TaxResult; tipo: TaxType }) {
  return (
    <SlideBase bg="#080808" accentColor="#E8C547" question={QUESTIONS[tipo]}>
      <div className="flex flex-col h-full">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="font-mono text-xs tracking-[0.25em] mb-1"
          style={{ color: '#E8C547', opacity: 0.6 }}
        >
          {LABELS[tipo]} · 2024
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="font-mono text-xs mb-4"
          style={{ color: '#F2EDE4', opacity: 0.35 }}
        >
          le diste al Estado:
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, type: 'spring', stiffness: 160 }}
          className="font-display leading-none"
          style={{ fontSize: 'clamp(4rem, 21vw, 8.5rem)', color: '#E8C547' }}
        >
          {formatQ(taxResult.total, true)}
        </motion.div>

        {taxResult.igss > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 space-y-2"
          >
            {[
              { label: 'ISR', value: taxResult.isr },
              { label: 'IGSS (4.83%)', value: taxResult.igss },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-baseline">
                <span className="font-mono text-xs tracking-widest" style={{ color: '#F2EDE4', opacity: 0.3 }}>{item.label}</span>
                <span className="font-mono text-sm" style={{ color: '#F2EDE4', opacity: 0.55 }}>{formatQ(item.value, true)}</span>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </SlideBase>
  )
}
