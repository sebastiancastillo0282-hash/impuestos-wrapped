'use client'

import { motion } from 'framer-motion'
import SlideBase from './SlideBase'
import { formatQ, diputadoDays } from '@/lib/formatters'
import { BudgetCategory } from '@/lib/budget'
import { TaxType } from '@/lib/taxes'

const QUESTIONS: Record<TaxType, string> = {
  employee:      '¿Cuándo fue la última vez que un diputado te preguntó si podía subirse el sueldo?',
  independiente: '¿Por qué un diputado tiene sueldo fijo garantizado y vos trabajás por resultados variables?',
  empresa:       '¿Cuántos de los 160 que se subieron el sueldo esa noche saben cómo funciona una empresa?',
}

export default function CongresoSlide({ allocation, tipo }: { allocation: BudgetCategory & { amount: number }; tipo: TaxType }) {
  const days = diputadoDays(allocation.amount)
  const hours = Math.round(days * 24)

  return (
    <SlideBase bg="#0D0800" accentColor="#E8C547" question={QUESTIONS[tipo]}>
      <div className="flex flex-col h-full">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="font-mono text-xs tracking-[0.25em] mb-4"
          style={{ color: '#E8C547', opacity: 0.6 }}
        >
          CONGRESO DE LA REPÚBLICA
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="font-mono text-xs mb-4"
          style={{ color: '#F2EDE4', opacity: 0.3 }}
        >
          pusiste
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
          className="mt-5"
        >
          <p className="font-mono text-xs" style={{ color: '#E8C547', opacity: 0.5 }}>
            eso son {hours < 24 ? `${hours} horas` : `${days} días`} del salario de un diputado
          </p>
          <p className="font-mono text-xs mt-3" style={{ color: '#F2EDE4', opacity: 0.25 }}>
            Feb 2025: 160 diputados subieron su sueldo 64% en una madrugada.
          </p>
        </motion.div>
      </div>
    </SlideBase>
  )
}
