'use client'

import { motion } from 'framer-motion'
import SlideBase from './SlideBase'
import { formatQ, diputadoDays } from '@/lib/formatters'
import { BudgetCategory } from '@/lib/budget'

export default function CongresoSlide({ allocation }: { allocation: BudgetCategory & { amount: number } }) {
  const days = diputadoDays(allocation.amount)
  const hours = Math.round(days * 24)

  return (
    <SlideBase bg="#180E00" accentColor="#E8C547">
      <div className="flex flex-col h-full justify-between">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xs tracking-[0.3em] mb-4"
            style={{ color: '#E8C547', opacity: 0.6 }}
          >
            AL CONGRESO PUSISTE
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="font-display leading-none mb-6"
            style={{ fontSize: 'clamp(3rem, 14vw, 5rem)', color: '#F2EDE4', fontFamily: 'var(--font-bebas)' }}
          >
            {formatQ(allocation.amount, true)}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <div className="p-4" style={{ background: 'rgba(232,197,71,0.06)', border: '1px solid rgba(232,197,71,0.15)' }}>
            <p className="text-xs tracking-widest opacity-50 mb-2" style={{ color: '#E8C547' }}>CON ESO FINANCIASTE</p>
            <p className="font-display" style={{ fontSize: 'clamp(2rem, 10vw, 3.5rem)', color: '#E8C547', fontFamily: 'var(--font-bebas)' }}>
              {hours < 24 ? `${hours} HORAS` : `${days} DÍAS`}
            </p>
            <p className="text-xs opacity-40 mt-1" style={{ color: '#F2EDE4' }}>del salario de un diputado</p>
          </div>

          <div className="space-y-1 text-xs" style={{ color: '#F2EDE4', opacity: 0.45, fontFamily: 'var(--font-dm-sans)' }}>
            <p>En febrero 2025, en una madrugada, 160 diputados se</p>
            <p>subieron el sueldo <span style={{ color: '#E8C547', opacity: 1 }}>64%</span>: de Q29,150 a Q67,300 al mes.</p>
            <p className="mt-2 opacity-30">Nadie les preguntó si podían.</p>
          </div>
        </motion.div>
      </div>
    </SlideBase>
  )
}
