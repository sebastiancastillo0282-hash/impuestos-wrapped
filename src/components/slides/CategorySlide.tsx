'use client'

import { motion } from 'framer-motion'
import SlideBase from './SlideBase'
import { formatQ } from '@/lib/formatters'
import { BudgetCategory } from '@/lib/budget'

const GRADIENTS: Record<string, string> = {
  educacion: 'bg-gradient-to-br from-green-800 to-emerald-900',
  salud: 'bg-gradient-to-br from-red-800 to-rose-900',
  infraestructura: 'bg-gradient-to-br from-yellow-800 to-orange-900',
  seguridad: 'bg-gradient-to-br from-slate-700 to-slate-900',
  municipalidades: 'bg-gradient-to-br from-teal-800 to-cyan-900',
  pensiones: 'bg-gradient-to-br from-violet-800 to-purple-900',
}

export default function CategorySlide({
  category,
  totalTax,
}: {
  category: BudgetCategory & { amount: number }
  totalTax: number
}) {
  const gradient = GRADIENTS[category.key] ?? 'bg-gradient-to-br from-indigo-800 to-indigo-900'

  return (
    <SlideBase gradient={gradient}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.1 }}
        className="text-7xl"
      >
        {category.emoji}
      </motion.div>
      <div className="space-y-1">
        <p className="text-white/70 text-lg">De lo que pagaste,</p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-black text-white"
        >
          {formatQ(category.amount)}
        </motion.p>
        <p className="text-white/70 text-lg">fue a {category.label}</p>
        <p className="text-white/40 text-sm">{category.pct}% del presupuesto nacional</p>
      </div>
      {category.viralFact && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-white/15 rounded-xl p-4 text-white/80 text-sm leading-relaxed"
        >
          {category.viralFact}
        </motion.div>
      )}
    </SlideBase>
  )
}
