'use client'

import { motion } from 'framer-motion'
import SlideBase from './SlideBase'
import { formatQ } from '@/lib/formatters'
import { TaxResult, TaxType } from '@/lib/taxes'

const TYPE_LABELS: Record<string, string> = {
  employee: 'empleado',
  independiente: 'independiente',
  empresa: 'empresa',
}

export default function TotalSlide({
  taxResult,
  tipo,
}: {
  taxResult: TaxResult
  tipo: TaxType
}) {
  return (
    <SlideBase gradient="bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      <div className="text-6xl">🇬🇹</div>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="space-y-2"
      >
        <p className="text-white/70 text-lg">Como {TYPE_LABELS[tipo]}, en 2024 pagaste</p>
        <p className="text-5xl font-black text-white">{formatQ(taxResult.total)}</p>
        <p className="text-white/50 text-sm">en impuestos</p>
      </motion.div>
      {taxResult.igss > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/10 rounded-xl p-4 text-left space-y-2"
        >
          <div className="flex justify-between text-white">
            <span>ISR</span>
            <span className="font-bold">{formatQ(taxResult.isr)}</span>
          </div>
          <div className="flex justify-between text-white">
            <span>IGSS (4.83%)</span>
            <span className="font-bold">{formatQ(taxResult.igss)}</span>
          </div>
        </motion.div>
      )}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-white/40 text-sm"
      >
        Toca para ver a dónde fue →
      </motion.p>
    </SlideBase>
  )
}
