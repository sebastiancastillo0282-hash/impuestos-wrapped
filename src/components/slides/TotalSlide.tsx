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

export default function TotalSlide({ taxResult, tipo }: { taxResult: TaxResult; tipo: TaxType }) {
  return (
    <SlideBase bg="#080808" accentColor="#E8C547">
      <div className="flex flex-col h-full justify-between">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xs tracking-[0.3em] mb-2"
            style={{ color: '#E8C547', opacity: 0.7 }}
          >
            {LABELS[tipo]} · 2024
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm mb-1"
            style={{ color: '#F2EDE4', opacity: 0.5, fontFamily: 'var(--font-dm-sans)' }}
          >
            Le diste al Estado:
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="font-display leading-none"
            style={{ fontSize: 'clamp(3.5rem, 16vw, 6rem)', color: '#E8C547', fontFamily: 'var(--font-bebas)' }}
          >
            {formatQ(taxResult.total, true)}
          </motion.div>
        </div>

        {taxResult.igss > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-2 py-4"
            style={{ borderTop: '1px solid rgba(242,237,228,0.1)', borderBottom: '1px solid rgba(242,237,228,0.1)' }}
          >
            {[
              { label: 'ISR', value: taxResult.isr },
              { label: 'IGSS (4.83%)', value: taxResult.igss },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-baseline">
                <span className="text-xs tracking-widest opacity-40" style={{ color: '#F2EDE4' }}>{item.label}</span>
                <span className="font-display text-xl" style={{ color: '#F2EDE4', fontFamily: 'var(--font-bebas)' }}>{formatQ(item.value, true)}</span>
              </div>
            ))}
          </motion.div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-xs tracking-widest opacity-25"
          style={{ color: '#F2EDE4' }}
        >
          TOCÁ PARA VER EN QUÉ SE FUE →
        </motion.p>
      </div>
    </SlideBase>
  )
}
