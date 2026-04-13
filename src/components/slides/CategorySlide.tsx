'use client'

import { motion } from 'framer-motion'
import SlideBase from './SlideBase'
import { formatQ } from '@/lib/formatters'
import { BudgetCategory } from '@/lib/budget'
import { TaxType } from '@/lib/taxes'

const CONFIGS: Record<string, { bg: string; accent: string }> = {
  educacion:      { bg: '#060F09', accent: '#22C55E' },
  salud:          { bg: '#0F0606', accent: '#EF4444' },
  infraestructura:{ bg: '#0F0B00', accent: '#F59E0B' },
  seguridad:      { bg: '#07070E', accent: '#818CF8' },
  municipalidades:{ bg: '#050D10', accent: '#22D3EE' },
  pensiones:      { bg: '#0A0610', accent: '#A78BFA' },
  defensa:        { bg: '#080808', accent: '#6B7280' },
  desarrollo_social: { bg: '#0F0608', accent: '#F472B6' },
}

const QUESTIONS: Record<string, Record<TaxType, string>> = {
  educacion: {
    employee:      '¿Cuántas de esas escuelas tienen maestro los 180 días del año lectivo?',
    independiente: '¿Por qué financiás el sistema que no pudo darte empleo formal?',
    empresa:       '¿Cuánto tenés que capacitar a un egresado de escuela pública antes de que te sirva?',
  },
  salud: {
    employee:      '¿Cuánto tardaste la última vez que fuiste al IGSS a que te atendieran?',
    independiente: '¿Por qué pagás salud pública si vos no tenés IGSS propio?',
    empresa:       '¿Cuánto gastaste en seguro médico privado para tus empleados encima de este aporte?',
  },
  infraestructura: {
    employee:      '¿Cuántas calles en tu ruta diaria están en buen estado hoy?',
    independiente: '¿Cuánto tardaste de más en llegar a algún lugar por las carreteras este mes?',
    empresa:       '¿Cuánto te costó en logística el estado de la infraestructura este año?',
  },
  seguridad: {
    employee:      '¿Te sentís más seguro en la calle que hace cinco años?',
    independiente: '¿Cuánto gastás en seguridad privada encima de este aporte al Estado?',
    empresa:       '¿Cuánto de tu presupuesto mensual va a seguridad privada además de lo que pagás en impuestos?',
  },
  municipalidades: {
    employee:      '¿Qué obra o servicio de tu municipalidad notaste este año?',
    independiente: '¿En cuántos trámites municipales te pidieron algo extra este año?',
    empresa:       '¿Algún trámite municipal tardó lo que prometió este año?',
  },
  pensiones: {
    employee:      '¿Confías en que el IGSS te va a pagar cuando llegue el momento?',
    independiente: '¿Quién te paga la jubilación a vos si nunca cotizaste al IGSS?',
    empresa:       '¿Cuántos de tus empleados entienden cómo funciona realmente su pensión del IGSS?',
  },
  defensa: {
    employee:      '¿Cuándo fue la última vez que el ejército te protegió directamente a vos?',
    independiente: '¿Sabés exactamente qué defienden con este presupuesto?',
    empresa:       '¿Qué porcentaje del presupuesto de defensa va a operaciones vs. a sueldos?',
  },
  desarrollo_social: {
    employee:      '¿Sabías que desarrollo social es el rubro más pequeño del presupuesto?',
    independiente: '¿Por qué el rubro que más debería crecer recibe menos del 2% del presupuesto?',
    empresa:       '¿Qué relación hay entre este número y la calidad del mercado laboral?',
  },
}

export default function CategorySlide({ category, totalTax, tipo }: { category: BudgetCategory & { amount: number }; totalTax: number; tipo: TaxType }) {
  const config = CONFIGS[category.key] ?? { bg: '#0A0A0A', accent: '#F2EDE4' }
  const question = QUESTIONS[category.key]?.[tipo]

  return (
    <SlideBase bg={config.bg} accentColor={config.accent} question={question}>
      <div className="flex flex-col h-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="font-mono text-xs tracking-[0.25em] mb-4"
          style={{ color: config.accent, opacity: 0.65 }}
        >
          {category.label.toUpperCase()} · {category.pct}% DEL PRESUPUESTO
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="font-mono text-xs mb-4"
          style={{ color: '#F2EDE4', opacity: 0.3 }}
        >
          de tu aporte total fueron a
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, type: 'spring', stiffness: 160 }}
          className="font-display leading-none"
          style={{ fontSize: 'clamp(4rem, 21vw, 8.5rem)', color: '#F2EDE4' }}
        >
          {formatQ(category.amount, true)}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-mono text-xs mt-3"
          style={{ color: config.accent, opacity: 0.45 }}
        >
          {category.description}
        </motion.p>
      </div>
    </SlideBase>
  )
}
