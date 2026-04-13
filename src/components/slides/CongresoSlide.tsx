'use client'

import { motion } from 'framer-motion'
import SlideBase from './SlideBase'
import { formatQ, diputadoDays } from '@/lib/formatters'
import { BudgetCategory } from '@/lib/budget'

export default function CongresoSlide({
  allocation,
}: {
  allocation: BudgetCategory & { amount: number }
}) {
  const days = diputadoDays(allocation.amount)

  return (
    <SlideBase gradient="bg-gradient-to-br from-amber-800 to-yellow-900">
      <div className="text-7xl">🏛️</div>
      <div className="space-y-2">
        <p className="text-white/70 text-lg">Tu aporte al Congreso:</p>
        <motion.p
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-4xl font-black text-white"
        >
          {formatQ(allocation.amount)}
        </motion.p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-black/30 rounded-xl p-5 space-y-3 text-left"
      >
        <p className="text-white font-semibold">Con eso financiaste:</p>
        <p className="text-white/80 text-sm">
          <span className="text-2xl font-black text-yellow-300">{days} días</span>{' '}
          del salario total de un diputado
        </p>
        <div className="border-t border-white/10 pt-3 space-y-1 text-xs text-white/50">
          <p>Salario base: Q47,700/mes</p>
          <p>Con dietas: hasta Q67,300/mes</p>
          <p className="text-white/70 font-semibold">
            Antes de feb 2025 ganaban Q29,150/mes.
            Se aumentaron 64% en una madrugada.
          </p>
        </div>
      </motion.div>
    </SlideBase>
  )
}
