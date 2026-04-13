'use client'

import { motion } from 'framer-motion'
import SlideBase from './SlideBase'
import { formatQ } from '@/lib/formatters'
import { BudgetCategory } from '@/lib/budget'

export default function DeudaSlide({
  allocation,
}: {
  allocation: BudgetCategory & { amount: number }
}) {
  return (
    <SlideBase gradient="bg-gradient-to-br from-red-900 to-rose-950">
      <div className="text-7xl">💳</div>
      <div className="space-y-2">
        <p className="text-white/70 text-lg">Tu aporte al pago de deuda:</p>
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-black/30 rounded-xl p-4 space-y-2 text-sm text-white/70"
      >
        <p>Guatemala debe en total:</p>
        <p className="text-3xl font-black text-red-300">Q253,000 millones</p>
        <p className="text-white/50 text-xs mt-2">
          En 2025 se contrató la deuda nueva más alta de la historia: Q25,104 millones.
          El 47.9% va a gastos operativos, no a inversión.
        </p>
      </motion.div>
    </SlideBase>
  )
}
