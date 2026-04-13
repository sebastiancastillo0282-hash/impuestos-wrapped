'use client'

import { motion } from 'framer-motion'
import SlideBase from './SlideBase'

export default function EvacionSlide() {
  return (
    <SlideBase bg="#080808" accentColor="#C0392B">
      <div className="flex flex-col h-full justify-between">
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xs tracking-[0.3em] mb-4 opacity-50"
            style={{ color: '#F2EDE4' }}
          >
            MIENTRAS VOS PAGABAS
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
          >
            <p className="font-display leading-none" style={{ fontSize: 'clamp(3.5rem, 16vw, 6rem)', color: '#C0392B', fontFamily: 'var(--font-bebas)' }}>
              Q45,189
            </p>
            <p className="font-display leading-none" style={{ fontSize: 'clamp(1.5rem, 7vw, 2.5rem)', color: '#C0392B', opacity: 0.7, fontFamily: 'var(--font-bebas)' }}>
              MILLONES
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm mt-2 opacity-50"
            style={{ color: '#F2EDE4', fontFamily: 'var(--font-dm-sans)' }}
          >
            se evadieron en IVA e ISR. Solo en 2023.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          <div className="space-y-2">
            {[
              { label: 'ISR EVADIDO', value: 'Q30,618M', note: 'tasa de incumplimiento: 70.1%' },
              { label: 'IVA EVADIDO', value: 'Q14,571M', note: 'tasa de incumplimiento: 24.8%' },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-baseline">
                <div>
                  <p className="text-xs tracking-widest opacity-40" style={{ color: '#F2EDE4' }}>{item.label}</p>
                  <p className="text-xs opacity-20" style={{ color: '#F2EDE4' }}>{item.note}</p>
                </div>
                <p className="font-display text-2xl" style={{ color: '#C0392B', fontFamily: 'var(--font-bebas)' }}>{item.value}</p>
              </div>
            ))}
          </div>
          <p className="text-xs opacity-25 pt-2" style={{ color: '#F2EDE4', borderTop: '1px solid rgba(242,237,228,0.08)' }}>
            Eso es 3 presupuestos de salud. Fuente: SAT, julio 2024.
          </p>
        </motion.div>
      </div>
    </SlideBase>
  )
}
