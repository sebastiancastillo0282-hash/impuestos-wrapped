'use client'

import { motion } from 'framer-motion'
import SlideBase from './SlideBase'
import { formatQ } from '@/lib/formatters'
import { TaxResult, TaxType } from '@/lib/taxes'

const LABELS: Record<string, string> = {
  employee: 'empleado',
  independiente: 'independiente',
  empresa: 'empresa',
}

export default function ShareSlide({ taxResult, tipo }: { taxResult: TaxResult; tipo: TaxType }) {
  const handleShare = async () => {
    const params = new URLSearchParams(window.location.search)
    const url = `${window.location.origin}/wrapped?${params.toString()}`
    const text = `Le di ${formatQ(taxResult.total)} al Estado guatemalteco en 2024. ¿Sabés en qué se fue? 🇬🇹`
    if (navigator.share) {
      await navigator.share({ title: 'Impuestos Wrapped GT', text, url })
    } else {
      await navigator.clipboard.writeText(`${text}\n${url}`)
      alert('¡Copiado!')
    }
  }

  return (
    <SlideBase bg="#080808" accentColor="#E8C547">
      <div className="flex flex-col h-full justify-between">
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xs tracking-[0.3em] mb-4 opacity-40"
            style={{ color: '#F2EDE4' }}
          >
            TU RESUMEN 2024
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="font-display leading-none"
            style={{ fontSize: 'clamp(3.5rem, 15vw, 5.5rem)', color: '#E8C547', fontFamily: 'var(--font-bebas)' }}
          >
            {formatQ(taxResult.total, true)}
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm opacity-40 mt-1"
            style={{ color: '#F2EDE4' }}
          >
            en impuestos como {LABELS[tipo]}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <button
            onClick={handleShare}
            className="w-full py-4 font-display text-lg tracking-wider transition-all duration-150 hover:opacity-90"
            style={{ background: '#E8C547', color: '#080808', fontFamily: 'var(--font-bebas)', letterSpacing: '0.1em' }}
          >
            COMPARTIR MI WRAPPED
          </button>
          <a
            href="/"
            className="block w-full py-3 text-xs tracking-widest text-center opacity-30 hover:opacity-60 transition-opacity"
            style={{ color: '#F2EDE4', border: '1px solid rgba(242,237,228,0.1)' }}
          >
            CALCULAR OTRO
          </a>
          <p className="text-xs text-center opacity-15" style={{ color: '#F2EDE4' }}>
            ACELERAGUATE.COM · DATOS VERIFICADOS · DECRETO 36-2024
          </p>
        </motion.div>
      </div>
    </SlideBase>
  )
}
