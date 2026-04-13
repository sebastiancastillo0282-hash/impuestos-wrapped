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

export default function ShareSlide({
  taxResult,
  tipo,
}: {
  taxResult: TaxResult
  tipo: TaxType
}) {
  const handleShare = async () => {
    const params = new URLSearchParams(window.location.search)
    const url = `${window.location.origin}/wrapped?${params.toString()}`
    const text = `Pagué ${formatQ(taxResult.total)} en impuestos en 2024. ¿Sabés en qué los gastó el Estado guatemalteco? 🇬🇹`

    if (navigator.share) {
      await navigator.share({ title: 'Mis Impuestos Wrapped', text, url })
    } else {
      await navigator.clipboard.writeText(`${text}\n${url}`)
      alert('¡Enlace copiado!')
    }
  }

  return (
    <SlideBase gradient="bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      <div className="text-6xl">🇬🇹</div>
      <div className="space-y-2">
        <p className="text-white/70 text-xl">Tu resumen fiscal 2024</p>
        <p className="text-5xl font-black text-white">{formatQ(taxResult.total)}</p>
        <p className="text-white/50">en impuestos como {TYPE_LABELS[tipo]}</p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3 w-full"
      >
        <button
          onClick={handleShare}
          className="w-full py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-white/90 transition"
        >
          Compartir mi Wrapped
        </button>
        <a
          href="/"
          className="block w-full py-3 rounded-xl border border-white/30 text-white text-center hover:bg-white/10 transition"
        >
          Calcular otro
        </a>
      </motion.div>
      <p className="text-white/20 text-xs">
        Datos del Presupuesto 2025 (Decreto 36-2024) y SAT
      </p>
    </SlideBase>
  )
}
