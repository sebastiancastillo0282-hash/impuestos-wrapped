'use client'

import { motion } from 'framer-motion'
import SlideBase from './SlideBase'
import { formatQ } from '@/lib/formatters'
import { BudgetCategory } from '@/lib/budget'

const CONFIGS: Record<string, { bg: string; accent: string }> = {
  educacion: { bg: '#0A1A0F', accent: '#16A34A' },
  salud: { bg: '#1A0A0A', accent: '#DC2626' },
  infraestructura: { bg: '#1A1200', accent: '#D97706' },
  seguridad: { bg: '#0D0D0D', accent: '#6B7280' },
  municipalidades: { bg: '#091518', accent: '#0891B2' },
  pensiones: { bg: '#120A1A', accent: '#7C3AED' },
  defensa: { bg: '#0D0D0D', accent: '#374151' },
  desarrollo_social: { bg: '#1A0A10', accent: '#DB2777' },
}

export default function CategorySlide({ category, totalTax }: { category: BudgetCategory & { amount: number }; totalTax: number }) {
  const config = CONFIGS[category.key] ?? { bg: '#0A0A0A', accent: '#F2EDE4' }

  return (
    <SlideBase bg={config.bg} accentColor={config.accent}>
      <div className="flex flex-col h-full justify-between">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xs tracking-[0.3em] mb-6"
            style={{ color: config.accent, opacity: 0.7 }}
          >
            DE TU APORTE TOTAL
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="font-display leading-none mb-2"
            style={{ fontSize: 'clamp(3rem, 14vw, 5.5rem)', color: '#F2EDE4', fontFamily: 'var(--font-bebas)' }}
          >
            {formatQ(category.amount, true)}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm mb-1 opacity-50"
            style={{ color: '#F2EDE4', fontFamily: 'var(--font-dm-sans)' }}
          >
            fueron a
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="font-display text-3xl mb-1"
            style={{ color: config.accent, fontFamily: 'var(--font-bebas)', letterSpacing: '0.05em' }}
          >
            {category.label.toUpperCase()}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs opacity-30"
            style={{ color: '#F2EDE4' }}
          >
            {category.pct}% del presupuesto nacional · {category.description}
          </motion.p>
        </div>

        {category.viralFact && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="py-4"
            style={{ borderTop: '1px solid rgba(242,237,228,0.08)' }}
          >
            <p className="text-sm leading-relaxed" style={{ color: '#F2EDE4', opacity: 0.65, fontFamily: 'var(--font-dm-sans)' }}>
              {category.viralFact}
            </p>
          </motion.div>
        )}
      </div>
    </SlideBase>
  )
}
