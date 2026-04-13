'use client'

import { motion } from 'framer-motion'
import SlideBase from './SlideBase'

export default function EvacionSlide() {
  return (
    <SlideBase gradient="bg-gradient-to-br from-zinc-900 to-black">
      <div className="text-7xl">👻</div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-2"
      >
        <p className="text-white/70 text-lg">Mientras tú pagabas...</p>
        <p className="text-3xl font-black text-red-400">Q45,189 millones</p>
        <p className="text-white/70">se evadieron en IVA e ISR en 2023</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/10 rounded-xl p-4 space-y-3 text-sm"
      >
        <div className="flex justify-between text-white">
          <span>ISR evadido</span>
          <span className="font-bold text-red-300">Q30,618M</span>
        </div>
        <div className="flex justify-between text-white">
          <span>IVA evadido</span>
          <span className="font-bold text-red-300">Q14,571M</span>
        </div>
        <div className="border-t border-white/10 pt-3 text-white/50 text-xs">
          Fuente: SAT, presentación oficial julio 2024
        </div>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="text-white/50 text-sm"
      >
        Eso es 3 veces el presupuesto de salud del país.
      </motion.p>
    </SlideBase>
  )
}
