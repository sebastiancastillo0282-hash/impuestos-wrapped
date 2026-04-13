'use client'

import { motion } from 'framer-motion'
import SlideBase from './SlideBase'
import { formatQ } from '@/lib/formatters'
import { BudgetCategory } from '@/lib/budget'
import { TaxType } from '@/lib/taxes'

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

const QUESTIONS: Record<string, Record<TaxType, string>> = {
  educacion: {
    employee: '¿Cuántas escuelas públicas tienen techo, maestros y libros? Tu dinero entró. Los resultados son otra conversación.',
    independiente: 'El sistema que no te dio trabajo formal recibe tu dinero igual.',
    empresa: 'El capital humano que contratás se educó aquí... o intentó hacerlo.',
  },
  salud: {
    employee: '¿Cuánto esperaste la última vez que fuiste al IGSS? ¿O directamente fuiste a privado?',
    independiente: 'Sin IGSS y sin seguro privado subsidiado. Pero con ISR puntual.',
    empresa: 'Tus empleados descuentan IGSS. ¿Lo usarán cuando más lo necesiten?',
  },
  infraestructura: {
    employee: '¿Cuántas calles en tu ruta diaria están en buen estado? Exacto.',
    independiente: 'Tu negocio depende de carreteras, luz y agua que no funcionan igual en todos lados.',
    empresa: 'Tu cadena de suministro depende de infraestructura que no mejora al ritmo que crece tu negocio.',
  },
  seguridad: {
    employee: '¿Te sentís más seguro en la calle que hace cinco años?',
    independiente: 'Pagás por seguridad pública que no llega donde operás. Y además pagás seguridad privada.',
    empresa: '¿Cuánto gastaste en seguridad privada encima de este aporte? Sumalo.',
  },
  municipalidades: {
    employee: 'Tu municipalidad recibió transferencias del presupuesto. ¿En qué lo usó este año?',
    independiente: 'La municipalidad te cobra, te regula y te multa. También recibe esto del presupuesto.',
    empresa: 'Tu municipio recibió fondos. ¿Agilizó algún trámite para tu empresa este año?',
  },
  pensiones: {
    employee: '¿Confías en que el IGSS te va a pagar cuando te jubiles? Preguntale a alguien que ya intentó cobrar.',
    independiente: 'Financiás las pensiones de los demás. Vos no tenés pensión. Ese es el trato.',
    empresa: 'El sistema de pensiones es para tus empleados, no para vos. Planificá en serio.',
  },
  defensa: {
    employee: '¿Cuándo fue la última vez que el ejército te protegió a vos directamente?',
    independiente: 'Financiás defensa. No sabés exactamente qué defiende.',
    empresa: 'Una fracción de tu aporte. El menor porcentaje del presupuesto.',
  },
  desarrollo_social: {
    employee: 'El menor rubro del presupuesto. Justo el que más debería crecer.',
    independiente: 'Menos del 2% del presupuesto. Para todo el desarrollo social del país.',
    empresa: 'Q1.74 de cada Q100 del Estado va a desarrollo social. Eso también explica el mercado laboral.',
  },
}

export default function CategorySlide({ category, totalTax, tipo }: { category: BudgetCategory & { amount: number }; totalTax: number; tipo: TaxType }) {
  const config = CONFIGS[category.key] ?? { bg: '#0A0A0A', accent: '#F2EDE4' }
  const question = QUESTIONS[category.key]?.[tipo]

  return (
    <SlideBase bg={config.bg} accentColor={config.accent} question={question}>
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
