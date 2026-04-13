'use client'

import { motion } from 'framer-motion'
import SlideBase from './SlideBase'
import { formatQ } from '@/lib/formatters'
import { BudgetCategory } from '@/lib/budget'

export default function DeudaSlide({ allocation }: { allocation: BudgetCategory & { amount: number } }) {
  return (
    <SlideBase bg="#150505" accentColor="#C0392B">
      <div className="flex flex-col h-full justify-between">
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xs tracking-[0.3em] mb-4"
            style={{ color: '#C0392B', opacity: 0.7 }}
          >
            A PAGAR DEUDA PUSISTE
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="font-display leading-none mb-2"
            style={{ fontSize: 'clamp(3rem, 14vw, 5rem)', color: '#F2EDE4', fontFamily: 'var(--font-bebas)' }}
          >
            {formatQ(allocation.amount, true)}
          </motion.div>
          <p className="text-xs opacity-30 mb-6" style={{ color: '#F2EDE4' }}>12.5% de tu aporte · solo para pagar intereses y capital</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <div>
            <p className="text-xs tracking-widest opacity-40 mb-1" style={{ color: '#C0392B' }}>DEUDA TOTAL DEL PAÍS</p>
            <p className="font-display" style={{ fontSize: 'clamp(2rem, 10vw, 3rem)', color: '#C0392B', fontFamily: 'var(--font-bebas)' }}>
              Q253,000 MILLONES
            </p>
          </div>
          <p className="text-xs leading-relaxed opacity-45" style={{ color: '#F2EDE4', fontFamily: 'var(--font-dm-sans)' }}>
            En 2025 se contrató la deuda nueva más alta de la historia: Q25,104 millones.
            El 47.9% va a gastos corrientes — no a inversión.
          </p>
          <p className="text-xs opacity-25" style={{ color: '#F2EDE4' }}>
            Naciste debiendo. Seguirás pagando.
          </p>
        </motion.div>
      </div>
    </SlideBase>
  )
}
